#!/usr/bin/env python3
"""اختبار تشغيل فعلي للألعاب في Chromium على preview/index.html (نفس app.js وapp.css المضمّنين في القالب)."""
import json, re, sys
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

def right(q_text):
    for q in BANK['mcq']:
        if q['q'] == q_text: return q['o'][q['a']]

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1000, 'height': 900})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL)
    host = pg.locator('#play-host')
    check(host.locator('h3').inner_text() != '', 'home shows first game intro')
    # mcq: ثلاث جولات: كلها صحيحة، ثم كلها خاطئة
    host.get_by_role('button', name='ابدأ').click()
    for i in range(10):
        qt = host.locator('.g-q').inner_text()
        ans = right(qt)
        host.locator('.g-opt', has_text=ex(ans)).first.click()
        check(host.locator('.g-fb').is_visible() and 'صحيحة' in host.locator('.g-fb').inner_text() or i > 0, 'feedback shown') if i == 0 else None
        host.locator('.g-act .btn').click()
    check('10 / 10' in host.locator('.g-score').inner_text(), 'mcq perfect round scores 10/10')
    check('اجتزت' in host.inner_text(), 'pass message')
    st = pg.evaluate("JSON.parse(localStorage.getItem('basira.v2'))")
    check(st['stats']['mcq']['best'] == 100 and st['stats']['mcq']['plays'] == 1, 'stats saved (best 100, plays 1)')
    check(len(st['seen']['mcq']) == 10, '10 seen ids stored')
    host.get_by_role('button', name='جولة جديدة').click()
    seen1 = set(st['seen']['mcq'])
    for i in range(10):
        qt = host.locator('.g-q').inner_text(); ans = right(qt)
        host.locator('.g-opt:not([data-ok="1"])').first.click()
        host.locator('.g-act .btn').click()
    check('0 / 10' in host.locator('.g-score').inner_text(), 'all-wrong round scores 0/10')
    st2 = pg.evaluate("JSON.parse(localStorage.getItem('basira.v2'))")
    check(st2['stats']['mcq']['best'] == 100 and st2['stats']['mcq']['plays'] == 2, 'best stays 100 after worse round')
    check(len(set(st2['seen']['mcq']) - seen1) == 10, 'second round uses 10 new questions')
    # صح/خطأ
    pg.locator('#picker button[data-g=truefalse]').click()
    host.get_by_role('button', name='ابدأ').click()
    tfm = {q['s']: q['v'] for q in BANK['tf']}
    for i in range(10):
        s = host.locator('.g-q').inner_text()
        host.locator('.g-opt', has_text=ex('صح' if tfm[s] else 'خطأ')).first.click()
        host.locator('.g-act .btn').click()
    check('10 / 10' in host.locator('.g-score').inner_text(), 'truefalse perfect round')
    # ترتيب
    pg.locator('#picker button[data-g=order]').click()
    host.get_by_role('button', name='ابدأ').click()
    om = {q['q'] + '|' + ''.join(sorted(q['items'])): q['items'] for q in BANK['order']}
    for i in range(5):
        q = host.locator('.g-q').inner_text()
        texts = host.locator('.g-opts .g-opt').all_inner_texts()
        items = om[q + '|' + ''.join(sorted(texts))]
        for it in items: host.locator('.g-opts .g-opt:not([disabled])', has_text=ex(it)).first.click()
        check('الترتيب الصحيح' in host.locator('.g-fb').inner_text() and 'صحيحة' in host.locator('.g-fb strong').inner_text() and 'غير' not in host.locator('.g-fb strong').inner_text(), f'order round {i+1} correct') if i == 0 else None
        host.locator('.g-act .btn').click()
    check('5 / 5' in host.locator('.g-score').inner_text(), 'order perfect round')
    # كلمة: خطأ ثم صحيح
    pg.locator('#picker button[data-g=word]').click()
    host.get_by_role('button', name='ابدأ').click()
    wm = {q['h']: q['w'] for q in BANK['word']}
    for i in range(5):
        hint = host.locator('.g-q').inner_text().split('التلميح: ', 1)[1]
        host.locator('.g-in').fill('xx'); host.get_by_role('button', name='تحقق').click()
        if i == 0: check('2' in host.locator('.note').last.inner_text(), 'wrong guess reduces attempts')
        host.locator('.g-in').fill(wm[hint]); host.get_by_role('button', name='تحقق').click()
        host.locator('.g-act .btn').click()
    check('5 / 5' in host.locator('.g-score').inner_text(), 'word perfect round')
    # ذاكرة: نتعلم الأماكن ثم نطابق
    pg.locator('#picker button[data-g=memory]').click()
    host.get_by_role('button', name='ابدأ').click()
    cards = host.locator('.g-card'); n = cards.count(); pairs = {}
    for a in range(n):
        for _ in (0,): pass
    pair_map = {}
    for s in BANK['mem']:
        for x, y in s['pairs']: pair_map[x] = y; pair_map[y] = x
    texts = {}
    for i in range(n):
        cards.nth(i).click(); texts[i] = cards.nth(i).inner_text()
        if i % 2 == 1:
            a, c = i - 1, i
            if pair_map.get(texts[a]) != texts[c]: pg.wait_for_timeout(800)
    # الآن كل النصوص معروفة
    pg.wait_for_timeout(900)
    for i in range(n):
        if 'done' in (cards.nth(i).get_attribute('class') or ''): continue
        j = next(k for k in range(n) if k != i and pair_map[texts[i]] == texts[k] and 'done' not in (cards.nth(k).get_attribute('class') or ''))
        cards.nth(i).click(); cards.nth(j).click()
    pg.wait_for_selector('.g-score', timeout=3000)
    check('/ 100' in host.locator('.g-score').inner_text(), 'memory finishes with a score')
    # صفحات اللعبة المستقلة
    check(pg.locator('[data-slug=mcq] .bsr-game h3').count() == 1, 'standalone game pages mount')
    # الوضع الداكن
    pg.locator('.js-theme').first.click()
    check(pg.evaluate("document.documentElement.getAttribute('data-theme')") == 'dark', 'dark mode toggles')
    # الجوال: لا تمرير أفقي
    pg.set_viewport_size({'width': 375, 'height': 800})
    check(pg.evaluate('document.documentElement.scrollWidth') <= 376, 'no horizontal scroll at 375px')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
