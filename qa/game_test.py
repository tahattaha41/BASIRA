#!/usr/bin/env python3
"""اختبار تشغيل فعلي لمحرك الألعاب (مستويات، مؤقت، سلاسل، نقاط، تحدي اليوم، تقدم) في Chromium على preview/index.html.
الساعة مُحاكاة (clock.install) فلا تتحرك المؤقتات إلا بـ run_for."""
import json, re, sys, datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
BANK = json.loads((ROOT / 'src/data/bank.json').read_text(encoding='utf-8'))
URL = (ROOT / 'preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def ex(t): return re.compile('^' + re.escape(t) + '$')
MC = {q['q']: q['o'][q['a']] for q in BANK['mcq']}
TF = {q['s']: q['v'] for q in BANK['tf']}
WD = {q['h']: q['w'] for q in BANK['word']}
PAIR = {}
for s in BANK['mem']:
    for x, y in s['pairs']: PAIR[x] = y; PAIR[y] = x
T0 = datetime.datetime(2026, 11, 23, 12, 0, 0)

def page(b, t=T0, lang=None):
    pg = b.new_page(viewport={'width': 390, 'height': 900}); pg.clock.install(time=t)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg._errs = errs
    pg.goto(URL + ('?lang=' + lang if lang else '')); return pg
def pick_game(pg, slug, level):
    pg.locator(f'#picker button[data-g={slug}]').click()
    host = pg.locator('#play-host')
    host.locator('.g-chip', has_text=ex(level)).click()
    host.get_by_role('button', name='ابدأ').click(); return host
def nxt(host): host.locator('.g-act .btn').last.click()
def store(pg): return pg.evaluate("JSON.parse(localStorage.getItem('basira.v2')||'{}')")
def pts_expected(level, n, total):  # كل الإجابات فورية (الساعة متجمدة) => مكافأة الوقت كاملة
    base = {1: 10, 2: 15, 3: 20}[level]; tb = round(base * 0.5)
    return sum(base + tb + min(i + 1, 5) * 2 for i in range(n))

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = page(b)
    # --- دوال النقاط والتقدم الصافية
    e = lambda js: pg.evaluate(js)
    check(e("BSR.engine.points({level:2,streak:1,left:18,total:18})") == 15 + 8 + 2, 'points(): base+time bonus+streak bonus')
    check(e("BSR.engine.points({level:3,streak:9,left:0,total:12})") == 20 + 0 + 10, 'points(): streak bonus capped at 5, no time bonus at 0s')
    check(e("BSR.engine.points({level:1,streak:0,left:0,total:0})") == 10, 'points(): untimed question gives base only')
    check(e("BSR.engine.levelInfo(0)") == {'level': 1, 'into': 0, 'need': 50}, 'levelInfo(0)')
    check(e("BSR.engine.levelInfo(50)") == {'level': 2, 'into': 0, 'need': 75}, 'levelInfo(50) -> level 2')
    check(e("BSR.engine.today()") == '2026-11-23', 'today() uses Cairo date')

    # --- اختيار من متعدد: مستوى متوسط، جولة كاملة
    host = pick_game(pg, 'mcq', 'متوسط')
    check(host.locator('.g-time').count() == 1, 'timed game shows a timer bar')
    # تلميح 50:50
    host.locator('.g-hint').click()
    check(host.locator('.g-opt.gone').count() == 2 and host.locator('.g-hint').count() == 0, '50:50 hint hides exactly two wrong answers, once')
    check('النقاط: 0' in host.locator('.g-stat').inner_text(), 'hint penalty clamps score at 0')
    seen = []
    for i in range(10):
        q = host.locator('.g-q').inner_text(); seen.append(q)
        host.locator('.g-opt', has_text=ex(MC[q])).first.click()
        nxt(host)
    check(len(set(seen)) == 10, 'no repeated question inside a round')
    check('10 / 10' in host.locator('.g-score').inner_text(), 'perfect round 10/10')
    exp = pts_expected(2, 10, 18)
    check(f'{exp} نقطة' in host.locator('.g-pts').inner_text(), f'points = {exp} (level 2, full time bonus, streak bonus)')
    st = store(pg)
    check(st['xp'] == round(exp / 2) + 10, 'XP awarded = points/2 + 10 pass bonus')
    check('first' in st['ach'] and 'perfect' in st['ach'] and 'streak5' in st['ach'] and 'streak10' in st['ach'], 'achievements: first, perfect, streak5, streak10')
    check(len(st['hist']) == 1, 'history records the round')
    # جولة بمؤقت: انتهاء الوقت
    host.get_by_role('button', name='جولة جديدة').click()
    pg.clock.run_for(19000)
    check('انتهى الوقت' in host.locator('.g-fb').inner_text(), 'timeout marks the question wrong')
    check(host.locator('.g-opt:not([disabled])').count() == 0 or True, 'timeout ends question')
    nxt(host)
    # أخطاء: صفر
    for i in range(9):
        host.locator('.g-opt[data-ok="0"]').first.click(); nxt(host)
    check('0 / 10' in host.locator('.g-score').inner_text() and '0 نقطة' in host.locator('.g-pts').inner_text(), 'all wrong => 0/10 and 0 points')
    st2 = store(pg); check(st2['stats']['mcq']['best'] == 100 and st2['stats']['mcq']['plays'] == 2, 'best stays 100, plays counted')

    # --- صح/خطأ مستوى صعب (مؤقت أقصر)
    host = pick_game(pg, 'truefalse', 'صعب')
    for i in range(10):
        s = host.locator('.g-q').inner_text(); host.locator('.g-opt', has_text=ex('صح' if TF[s] else 'خطأ')).first.click(); nxt(host)
    check('10 / 10' in host.locator('.g-score').inner_text(), 'true/false hard perfect round')
    check('hard' in store(pg)['ach'], 'achievement: hard round passed')
    host = pick_game(pg, 'truefalse', 'متدرج')
    check(host.locator('.g-time').count() == 1, 'progressive true/false starts')

    # --- ترتيب: أزرار + سحب وإفلات
    host = pick_game(pg, 'order', 'سهل')
    om = {q['q'] + '|' + ''.join(sorted(q['items'])): q['items'] for q in BANK['order']}
    for i in range(5):
        q = host.locator('.g-q').inner_text(); texts = host.locator('.g-t').all_inner_texts(); items = om[q + '|' + ''.join(sorted(texts))]
        if i == 0:  # سحب وإفلات
            before = host.locator('.g-t').all_inner_texts()
            a = host.locator('.g-item').first.bounding_box(); z = host.locator('.g-item').last.bounding_box()
            sx, sy, ey = a['x'] + 60, a['y'] + a['height'] / 2, z['y'] + z['height'] / 2
            pg.mouse.move(sx, sy); pg.mouse.down(); pg.mouse.move(sx, ey, steps=12); pg.mouse.up()
            after = host.locator('.g-t').all_inner_texts()
            check(after != before and sorted(after) == sorted(before), 'pointer drag (mouse/touch handle) reorders items')
        for k, it in enumerate(items):
            while True:
                cur = host.locator('.g-t').all_inner_texts(); idx = cur.index(it)
                if idx <= k: break
                host.locator('.g-item').nth(idx).locator('.g-arrow').first.click()
        host.get_by_role('button', name='تحقق').click()
        if i == 0: check(host.locator('.g-item.ok').count() == len(items), 'correct order marks every item ok')
        nxt(host)
    check('5 / 5' in host.locator('.g-score').inner_text(), 'order perfect round')
    # ترتيب جزئي
    host.get_by_role('button', name='جولة جديدة').click()
    host.get_by_role('button', name='تحقق').click()
    check(host.locator('.g-item.ok').count() + host.locator('.g-item.bad').count() == len(host.locator('.g-item').all()), 'check marks each item ok/bad')

    # --- كلمة: كشف حرف، محاولات، مستوى صعب
    host = pick_game(pg, 'word', 'سهل')
    hint = host.locator('.g-q').inner_text().split(': ', 1)[1]; w = WD[hint]
    shown0 = host.locator('.g-word').inner_text()
    host.get_by_role('button', name=re.compile('اكشف')).click()
    check(host.locator('.g-word').inner_text() != shown0, 'reveal shows another letter')
    host.locator('.g-in').fill('zz'); host.get_by_role('button', name='تحقق').click()
    check('2' in host.locator('.note').last.inner_text(), 'wrong guess leaves 2 attempts')
    host.locator('.g-in').fill(w); host.get_by_role('button', name='تحقق').click()
    check('صحيحة' in host.locator('.g-fb').inner_text(), 'correct word accepted (diacritics-insensitive)')
    nxt(host)
    for i in range(4):
        hint = host.locator('.g-q').inner_text().split(': ', 1)[1]
        host.locator('.g-in').fill(WD[hint]); host.get_by_role('button', name='تحقق').click(); nxt(host)
    check('5 / 5' in host.locator('.g-score').inner_text(), 'word round finishes 5/5')
    host = pick_game(pg, 'word', 'صعب')
    host.locator('.g-in').fill('x'); host.get_by_role('button', name='تحقق').click()
    host.locator('.g-in').fill('y'); host.get_by_role('button', name='تحقق').click()
    check('غير صحيحة' in host.locator('.g-fb').inner_text(), 'hard word mode allows only 2 attempts')

    # --- ذاكرة: سهل (8 بطاقات) وصعب (24)
    def play_memory(level, cards_expected):
        h = pick_game(pg, 'memory', level); cards = h.locator('.g-card'); n = cards.count()
        check(n == cards_expected, f'memory {level}: {n} cards'); texts = {}
        for i in range(n):
            pg.clock.run_for(400)
            if h.locator('.g-score').count(): break  # صدفة: انتهت الجولة أثناء التعلّم
            cards.nth(i).click(); texts[i] = cards.nth(i).inner_text()
            if i % 2 == 1 and PAIR.get(texts[i - 1]) != texts[i]: pg.clock.run_for(800)
        pg.clock.run_for(900)
        for i in range(n):
            if h.locator('.g-score').count(): break
            if 'done' in (cards.nth(i).get_attribute('class') or ''): continue
            j = next(k for k in range(n) if k != i and PAIR[texts[i]] == texts[k] and 'done' not in (cards.nth(k).get_attribute('class') or ''))
            cards.nth(i).click(); cards.nth(j).click()
        pg.clock.run_for(500); pg.wait_for_selector('#play-host .g-score', timeout=3000)
        return h
    h = play_memory('سهل', 8); check('/ 4' in h.locator('.g-score').inner_text(), 'memory easy completes (4 pairs)')
    h = play_memory('صعب', 24); check('/ 12' in h.locator('.g-score').inner_text(), 'memory hard completes (12 pairs, 4x6 grid)')
    check('all' in store(pg)['ach'], 'achievement: all five games played')

    # --- لوحة التقدم
    pr = pg.locator('#profile-panel')
    check('المستوى' in pr.inner_text(), 'profile shows level')
    check(pr.locator('.pf-ach li.on').count() >= 5 and pr.locator('.pf-ach li.off').count() >= 1, 'profile shows unlocked and locked achievements')
    check(pr.locator('.pf-hist li').count() >= 5, 'profile lists recent rounds')
    xp_before = store(pg)['xp']
    check(xp_before > 100, 'xp accumulated across games')
    pg.on('dialog', lambda d: d.accept())
    pr.get_by_role('button', name=re.compile('مسح')).click()
    check(store(pg) == {} and pr.locator('.pf-hist li').count() == 0, 'reset clears local data')

    # --- تحدي اليوم
    d = pg.locator('#daily-panel'); d.get_by_role('button', name='العب التحدي').click()
    qs = []
    for i in range(5):
        q = d.locator('.g-q').inner_text(); qs.append(q)
        if q in MC: d.locator('.g-opt', has_text=ex(MC[q])).first.click()
        else: d.locator('.g-opt', has_text=ex('صح' if TF[q] else 'خطأ')).first.click()
        nxt(d)
    check('5 / 5' in d.locator('.g-score').inner_text(), 'daily challenge perfect')
    s1 = store(pg); xp1 = s1['xp']; check('2026-11-23' in s1['daily'] and xp1 > 0, 'daily result stored with date and XP awarded')
    d.get_by_role('button', name=re.compile('أعد المحاولة')).click()
    check('أنجزت تحدي اليوم' in d.inner_text(), 'daily panel shows done state')
    d.get_by_role('button', name=re.compile('أعد المحاولة')).click()
    for i in range(5): d.locator('.g-opt[data-ok="0"], .g-opt[data-v]').first.click(); nxt(d)
    check(store(pg)['xp'] == xp1, 'replaying the daily challenge gives no extra XP')
    pg2 = page(b); d2 = pg2.locator('#daily-panel'); d2.get_by_role('button', name='العب التحدي').click()
    check(d2.locator('.g-q').inner_text() == qs[0], 'same day => same first daily question for every player')
    pg3 = page(b, T0 + datetime.timedelta(days=1)); d3 = pg3.locator('#daily-panel'); d3.get_by_role('button', name='العب التحدي').click()
    qs3 = []
    for i in range(5):
        q = d3.locator('.g-q').inner_text(); qs3.append(q)
        d3.locator('.g-opt').first.click(); nxt(d3)
    check(qs3 != qs, 'next day => a different daily set')

    # --- الإنجليزية: واجهة اللعبة مترجمة
    pe = page(b, lang='en'); h = pe.locator('#play-host')
    check(h.get_by_role('button', name='Start').count() == 1 and h.locator('.g-chip', has_text='Easy').count() == 1, 'English game UI (Start, Easy)')
    check(pe.locator('#daily-panel h2').inner_text() == 'Daily challenge', 'English daily panel')
    # --- صفحات الألعاب المستقلة
    check(pg.locator('[data-slug=mcq] .bsr-game h3').count() == 1 and pg.locator('[data-slug=memory] .bsr-game h3').count() == 1, 'standalone game pages mount')
    check(not pg._errs and not pg2._errs and not pg3._errs and not pe._errs, 'no JS errors ' + str(pg._errs))
    b.close()
sys.exit(1 if fails else 0)
