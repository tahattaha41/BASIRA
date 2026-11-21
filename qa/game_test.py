#!/usr/bin/env python3
"""اختبار الألعاب فعلياً: صحة بنك الأسئلة + لعب كامل في Chromium (فوز وخسارة وتسجيل وعدم التكرار)."""
import json, os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(__file__))
from blogger_sim import Sim
from fixtures import PAGES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dist', 'preview'); os.makedirs(OUT, exist_ok=True)
BANK = json.load(open(os.path.join(ROOT, 'src/data/bank.json'), encoding='utf-8'))
SITE = json.load(open(os.path.join(ROOT, 'src/site.json'), encoding='utf-8'))
fails = []
def check(n, ok, d=''):
    print(('PASS ' if ok else 'FAIL ') + n + (' — ' + str(d)[:300] if not ok else ''))
    if not ok: fails.append(n)

# ---------- 1) صحة البنك ----------
KB = 'ابتثجحخدذرزسشصضطظعغفقكلمنهويةء'
NORM = str.maketrans({'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ؤ': 'و', 'ئ': 'ي', 'ى': 'ي'})
ids = [x['id'] for k in ('mcq', 'tf', 'order', 'word') for x in BANK[k]]
check('معرّفات الأسئلة فريدة', len(ids) == len(set(ids)))
check('mcq: أربع إجابات مختلفة ومؤشر صحيح ضمن النطاق وتفسير', all(len(q['o']) == 4 and len(set(q['o'])) == 4 and 0 <= q['a'] < 4 and q['x'] and q['l'] in (1, 2, 3) for q in BANK['mcq']))
check('mcq: لا سؤال مكرر', len({q['q'] for q in BANK['mcq']}) == len(BANK['mcq']))
check('tf: قيمة منطقية وتفسير', all(isinstance(q['v'], bool) and q['x'] and q['s'] for q in BANK['tf']))
check('order: ثلاثة عناصر فأكثر بلا تكرار', all(len(q['items']) >= 3 and len(set(q['items'])) == len(q['items']) for q in BANK['order']))
check('word: كل الحروف على لوحة المفاتيح', all(all(c in KB for c in w['w'].translate(NORM)) for w in BANK['word']))
check('word: التلميحات فريدة (لازم للاختبار ولتجنب الغموض)', len({w['h'] for w in BANK['word']}) == len(BANK['word']))
check('mem: كل مجموعة ستة أزواج بلا نصوص مكررة', all(len(m['pairs']) >= 6 and len({t for p in m['pairs'] for t in p}) == 2 * len(m['pairs']) for m in BANK['mem']))
check('الأقسام الثمانية في البنك تطابق site.json', [t[0] for t in SITE['topics']] == BANK['topics'])
check('كل قسم له سؤال mcq واحد على الأقل', all(any(q['t'] == t for q in BANK['mcq']) for t in BANK['topics']))

# ---------- 2) اللعب ----------
sim = Sim(open(os.path.join(ROOT, 'dist/theme.xml'), encoding='utf-8').read())
def page_path(key):
    p = os.path.join(OUT, 'gt-' + key + '.html'); open(p, 'w', encoding='utf-8').write(sim.html(PAGES[key]())); return 'file://' + p

MCQ = {q['q']: q for q in BANK['mcq']}; TF = {q['s']: q for q in BANK['tf']}; ORD = {q['q'] + '|' + q['items'][0]: q for q in BANK['order']}
def sc(pg): return pg.evaluate("document.querySelector('.bg-sc')&&document.querySelector('.bg-sc').textContent")
def stats(pg): return pg.evaluate("JSON.parse(localStorage.getItem('basira.v1')||'null')")
def start(pg, lv):
    pg.click(f'.bg-lv >> nth={lv - 1}'); pg.click('.bg-go')

with sync_playwright() as pw:
    br = pw.chromium.launch()
    def fresh(key, **kw):
        ctx = br.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, **kw)
        pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
        pg.goto(page_path(key)); return ctx, pg, errs

    # ===== mcq =====
    ctx, pg, errs = fresh('game-mcq')
    check('mcq: شاشة البداية فيها ثلاثة مستويات وقواعد', pg.locator('.bg-lv').count() == 3 and pg.locator('.bg-rules').count() == 1)
    start(pg, 1)
    for i in range(10):
        qt = pg.evaluate("document.querySelector('.bg-q').textContent"); q = MCQ[qt]
        idx = pg.evaluate("(t)=>[...document.querySelectorAll('.bg-opt')].findIndex(b=>b.children[1].textContent===t)", q['o'][q['a']])
        pg.click(f'.bg-opt >> nth={idx}')
        if i == 0:
            pg.evaluate("document.querySelectorAll('.bg-opt').forEach(b=>{b.disabled=false;b.click();})")  # محاولة إعادة العدّ
            check('mcq: لا عدّ مزدوج للسؤال الواحد', sc(pg) == 'النقاط: 10', sc(pg))
            check('mcq: يظهر تفسير وزر التالي', pg.locator('.bg-fb.ok').count() == 1 and pg.locator('.bg-next').count() == 1)
        pg.click('.bg-next')
    check('mcq: فوز كامل = 100 نقطة وحالة فوز', pg.locator('.bg-end.win .bg-big2').text_content() == '100 نقطة')
    s = stats(pg)
    check('mcq: الحفظ المحلي (جولة واحدة وأفضل نتيجة 100)', s and s['g']['mcq']['plays'] == 1 and s['g']['mcq']['best']['1'] == 100 and s['g']['mcq']['right'] == 10, s)
    seen1 = set(s['seen']['mcq'])
    pg.click('.bg-actions .play')
    for i in range(10):   # كلها خاطئة
        qt = pg.evaluate("document.querySelector('.bg-q').textContent"); q = MCQ[qt]
        idx = pg.evaluate("(t)=>[...document.querySelectorAll('.bg-opt')].findIndex(b=>b.children[1].textContent!==t)", q['o'][q['a']])
        pg.click(f'.bg-opt >> nth={idx}'); 
        if i == 0: check('mcq: الإجابة الخاطئة تُظهر الصحيحة والخاطئة', pg.locator('.bg-opt.ok').count() == 1 and pg.locator('.bg-opt.bad').count() == 1)
        pg.click('.bg-next')
    check('mcq: خسارة = 0 نقطة وحالة خسارة', pg.locator('.bg-end.lose .bg-big2').text_content() == '0 نقطة')
    s = stats(pg)
    check('mcq: الجولة الثانية تظهر أسئلة جديدة (تجنّب التكرار)', len(set(s['seen']['mcq'])) == 20, len(set(s['seen']['mcq'])))
    check('mcq: أفضل نتيجة لا تنخفض بعد جولة خاسرة', s['g']['mcq']['best']['1'] == 100 and s['g']['mcq']['plays'] == 2)
    pg.reload(); pg.wait_for_selector('.bg-lv'); pg.click('.bg-lv >> nth=0')
    check('mcq: أفضل نتيجة تظهر بعد إعادة التحميل', '100' in pg.locator('.bg-best').text_content())
    check('mcq: لا أخطاء JS', not errs, errs); ctx.close()

    # ===== mcq صعب بمؤقت =====
    ctx, pg, errs = fresh('game-mcq'); pg.clock.install(); pg.reload(); pg.wait_for_selector('.bg-lv')
    start(pg, 3)
    check('mcq صعب: يظهر المؤقت', '0:20' in pg.locator('.bg-timer').text_content())
    pg.clock.run_for(21000)
    check('mcq صعب: انتهاء الوقت يُحسب خاطئاً ويكشف الإجابة', pg.locator('.bg-fb.bad').count() == 1 and 'انتهى الوقت' in pg.locator('.bg-fb b').text_content() and pg.locator('.bg-opt:not([disabled])').count() == 0)
    check('mcq صعب: لا عدّ إضافي بعد انتهاء الوقت', sc(pg) == 'النقاط: 0')
    ctx.close()

    # ===== صح/خطأ =====
    ctx, pg, errs = fresh('game-truefalse'); start(pg, 2); right = 0
    for i in range(10):
        st_ = pg.evaluate("document.querySelector('.bg-q').textContent"); q = TF[st_]
        pg.click(f".bg-big >> nth={0 if q['v'] else 1}"); right += 1
        pg.click('.bg-next')
    check('صح/خطأ: فوز كامل بمستوى متوسط = 150 نقطة', pg.locator('.bg-end.win .bg-big2').text_content() == '150 نقطة')
    pg.click('.bg-actions .alt'); start(pg, 1)
    for i in range(10):
        st_ = pg.evaluate("document.querySelector('.bg-q').textContent"); q = TF[st_]
        pg.click(f".bg-big >> nth={1 if q['v'] else 0}"); pg.click('.bg-next')
    check('صح/خطأ: كل الإجابات خاطئة = خسارة', pg.locator('.bg-end.lose').count() == 1)
    check('صح/خطأ: لا أخطاء JS', not errs, errs); ctx.close()

    # ===== ترتيب =====
    ctx, pg, errs = fresh('game-order'); start(pg, 1)
    n = pg.evaluate("0")
    for i in range(5):
        qt = pg.evaluate("document.querySelector('.bg-q').textContent"); first = None
        items = pg.evaluate("[...document.querySelectorAll('.bg-rt')].map(e=>e.textContent)")
        q = next(x for x in BANK['order'] if x['q'] == qt and set(x['items']) == set(items))
        if i == 0:   # محاولة خاطئة أولى عبر التحقق المباشر
            pg.click('.bg-check')
            check('ترتيب: الترتيب الأولي المخلوط يُرفض ويُعرض الصحيح', pg.locator('.bg-fb.bad').count() == 1 and q['items'][0] in pg.locator('.bg-fb p').text_content())
            check('ترتيب: لا تحقق ثانٍ لنفس السؤال', pg.locator('.bg-check:visible').count() == 0)
            pg.click('.bg-next'); continue
        for target in range(len(q['items'])):
            for _ in range(10):
                cur = pg.evaluate("[...document.querySelectorAll('.bg-rt')].map(e=>e.textContent)")
                pos = cur.index(q['items'][target])
                if pos == target: break
                pg.click(f'.bg-row2 >> nth={pos} >> .bg-mv >> nth=0')
        pg.click('.bg-check')
        check(f'ترتيب: سؤال {i + 1} صحيح بعد الترتيب اليدوي', pg.locator('.bg-fb.ok').count() == 1)
        pg.click('.bg-next')
    check('ترتيب: نهاية الجولة 4 من 5 = نجاح (80%) و40 نقطة', pg.locator('.bg-end.win .bg-big2').text_content() == '40 نقطة', pg.locator('.bg-end').text_content())
    check('ترتيب: لا أخطاء JS', not errs, errs); ctx.close()

    # ===== ذاكرة =====
    def pair_of(txt):
        for m in BANK['mem']:
            for p in m['pairs']:
                if txt in p: return p
    def txt_of(pg, i): return pg.evaluate(f"(document.querySelectorAll('.bg-card')[{i}]||{{firstChild:{{textContent:''}}}}).firstChild.textContent")
    def is_done(pg, i): return pg.evaluate(f"!!(document.querySelectorAll('.bg-card')[{i}]&&document.querySelectorAll('.bg-card')[{i}].classList.contains('done'))")
    ctx, pg, errs = fresh('game-memory'); start(pg, 1)
    check('ذاكرة سهل: 8 بطاقات', pg.locator('.bg-card').count() == 8)
    pg.click('.bg-card >> nth=0')
    check('ذاكرة: النقر يكشف البطاقة', txt_of(pg, 0) != '')
    pg.click('.bg-card >> nth=0')
    check('ذاكرة: النقر على بطاقة مكشوفة لا يُحسب محاولة', 'المحاولات: 0' in pg.locator('.bg-row span').first.text_content())
    pg.reload(); pg.wait_for_selector('.bg-lv'); start(pg, 1)
    known = {}
    for _ in range(40):
        if pg.locator('.bg-end').count(): break
        a = next(i for i in range(8) if not is_done(pg, i))
        pg.click(f'.bg-card >> nth={a}'); ta = txt_of(pg, a); known[a] = ta
        partner = next((i for i, t in known.items() if i != a and t in pair_of(ta) and not is_done(pg, i)), None)
        if partner is None:
            partner = next(i for i in range(8) if i != a and i not in known and not is_done(pg, i))
        pg.click(f'.bg-card >> nth={partner}')
        if pg.locator('.bg-end').count(): break
        if not is_done(pg, partner):
            known[partner] = txt_of(pg, partner); pg.wait_for_timeout(1000)
    check('ذاكرة سهل: الفوز بعد مطابقة كل الأزواج', pg.locator('.bg-end.win').count() == 1)
    check('ذاكرة: النقاط ضمن الحد الأقصى (40)', 0 < int(pg.locator('.bg-big2').text_content().split()[0]) <= 40, pg.locator('.bg-big2').text_content())
    check('ذاكرة: الحفظ المحلي', stats(pg)['g']['memory']['plays'] == 1)
    check('ذاكرة: لا أخطاء JS (سهل)', not errs, errs)
    ctx.close()

    # ذاكرة صعب: خسارة بعد 14 محاولة
    ctx, pg, errs = fresh('game-memory'); pg.clock.install(); pg.reload(); pg.wait_for_selector('.bg-lv'); start(pg, 3)
    check('ذاكرة صعب: 12 بطاقة وحدّ 14 محاولة', pg.locator('.bg-card').count() == 12 and '14' in pg.locator('.bg-row span').first.text_content())
    for _ in range(40):
        if pg.locator('.bg-end').count(): break
        free = [i for i in range(12) if not is_done(pg, i)]
        pg.click(f'.bg-card >> nth={free[0]}'); pg.click(f'.bg-card >> nth={free[1]}')
        if pg.locator('.bg-end').count(): break
        pg.clock.run_for(1000)
    check('ذاكرة صعب: خسارة عند نفاد المحاولات', pg.locator('.bg-end.lose').count() == 1 and '14' in pg.locator('.bg-end').text_content())
    check('ذاكرة صعب: لا أخطاء JS', not errs, errs); ctx.close()

    # ===== خمّن الكلمة =====
    W = {w['h']: w for w in BANK['word']}
    ctx, pg, errs = fresh('game-word'); start(pg, 1); wins = 0
    for i in range(5):
        hint = pg.evaluate("document.querySelector('.bg-hint').textContent.replace('تلميح: ','')"); w = W[hint]
        letters = sorted({c.translate(NORM) for c in w['w']})
        for c in letters: pg.click(f".bg-key:text-is('{c}')")
        check(f'كلمة {i + 1}: «{w["w"]}» تُكشف بالحروف الصحيحة', pg.locator('.bg-fb.ok').count() == 1)
        pg.click('.bg-next')
    check('كلمة: خمس كلمات صحيحة = نجاح', pg.locator('.bg-end.win').count() == 1)
    pg.click('.bg-actions .alt'); start(pg, 3)
    check('كلمة صعب: التلميح غير ظاهر ويوجد زر تلميح', pg.locator('.bg-hint').text_content() == '' and pg.locator('.bg-hintbtn').count() == 1)
    pg.click('.bg-hintbtn')
    check('كلمة صعب: التلميح يكلّف محاولة (4 → 3)', '3' in pg.locator('.bg-left').text_content() and pg.locator('.bg-hint').text_content().startswith('تلميح'))
    hint = pg.evaluate("document.querySelector('.bg-hint').textContent.replace('تلميح: ','')"); w = W[hint]
    inw = {c.translate(NORM) for c in w['w']}; wrong = [c for c in KB if c not in inw][:3]
    for c in wrong: pg.click(f".bg-key:text-is('{c}')")
    check('كلمة صعب: نفاد المحاولات = خسارة الكلمة وكشفها', pg.locator('.bg-fb.bad').count() == 1 and w['w'] in pg.locator('.bg-fb p').text_content())
    check('كلمة صعب: لوحة المفاتيح مقفلة بعد الخسارة', pg.locator('.bg-key:not([disabled])').count() == 0)
    check('كلمة: لا أخطاء JS', not errs, errs); ctx.close()

    # ===== الصفحة الرئيسية: لعب داخل المسرح + لوحة التقدم =====
    ctx, pg, errs = fresh('home')
    check('الرئيسية: اللعبة الأولى مركّبة جاهزة للعب', pg.locator('.p-mcq .bg-lv').count() == 3)
    check('الرئيسية: ألعاب التبويبات الأخرى لا تُركّب قبل اختيارها', pg.locator('.p-word .bg-lv').count() == 0)
    pg.click('label[for=gm-truefalse]'); pg.wait_for_selector('.p-truefalse .bg-lv')
    pg.click('.p-truefalse .bg-lv >> nth=0'); pg.click('.p-truefalse .bg-go')
    q = TF[pg.evaluate("document.querySelector('.p-truefalse .bg-q').textContent")]
    pg.click(f".p-truefalse .bg-big >> nth={0 if q['v'] else 1}")
    check('الرئيسية: اللعب داخل المسرح يعمل', pg.locator('.p-truefalse .bg-fb.ok').count() == 1)
    pg.click('label[for=gm-mcq]'); 
    check('الرئيسية: العودة للعبة أخرى ترجعها إلى شاشة البداية', pg.locator('.p-truefalse .bg-lv').count() == 3)
    check('الرئيسية: لوحة التقدم تبدأ بنص صادق بلا أرقام وهمية', 'لم تلعب أي جولة' in pg.locator('#bsr-progress').text_content())
    check('الرئيسية: لا أخطاء JS', not errs, errs); ctx.close()
    # بعد لعب جولة كاملة على صفحة مستقلة ثم فتح الرئيسية بنفس السياق
    ctx = br.new_context(viewport={'width': 390, 'height': 844}); pg = ctx.new_page()
    pg.goto(page_path('game-mcq'))
    start(pg, 2)
    for i in range(10):
        q = MCQ[pg.evaluate("document.querySelector('.bg-q').textContent")]
        idx = pg.evaluate("(t)=>[...document.querySelectorAll('.bg-opt')].findIndex(b=>b.children[1].textContent===t)", q['o'][q['a']])
        pg.click(f'.bg-opt >> nth={idx}'); pg.click('.bg-next')
    pg.goto(page_path('home'))
    txt = pg.locator('#bsr-progress').text_content()
    check('الرئيسية: لوحة التقدم تعرض النتيجة الفعلية (150 نقطة، 1 جولة، 100%)', '150' in txt and '100%' in txt and 'اختبارات' in txt, txt)
    pg.once('dialog', lambda d: d.accept()); pg.click('#bsr-progress .btn-quiet')
    check('الرئيسية: مسح البيانات يعمل', 'لم تلعب أي جولة' in pg.locator('#bsr-progress').text_content() and stats(pg) is None)
    ctx.close()
    # التخزين غير متاح
    ctx = br.new_context(viewport={'width': 390, 'height': 844}); ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
    pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto(page_path('game-truefalse')); start(pg, 1)
    for i in range(10):
        q = TF[pg.evaluate("document.querySelector('.bg-q').textContent")]
        pg.click(f".bg-big >> nth={0 if q['v'] else 1}"); pg.click('.bg-next')
    check('بدون تخزين: اللعبة تعمل وتخبر المستخدم بصدق', pg.locator('.bg-end.win').count() == 1 and 'تعذّر الحفظ' in pg.locator('.bg-end').text_content() and not errs, errs)
    ctx.close()
    br.close()
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
