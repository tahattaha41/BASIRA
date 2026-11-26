import sys, pathlib, re
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def start(pg, slug, level='سهل'):
    pg.locator(f'#picker button[data-g={slug}]').click(); h = pg.locator('#play-host')
    h.locator('.g-chip', has_text=re.compile('^' + level + '$')).click(); h.get_by_role('button', name='ابدأ').click(); return h
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto(URL); pg.wait_for_timeout(300)
    # برج: أسقط دائماً حين تتطابق الكتلة (بالتحكم في موضعها عبر المحاكاة بالوقت الحقيقي: نحاول عدة مرات ونتأكد أن اللعبة تنتهي وتسجل)
    h = start(pg, 'stack')
    check(pg.locator('.stk-b').count() == 2, 'stack: base block and moving block present')
    pg.wait_for_timeout(300)
    for i in range(30):
        if pg.locator('.g-end').count(): break
        pg.locator('.stk').dispatch_event('pointerdown'); pg.wait_for_timeout(120)
    pg.wait_for_selector('.g-end', timeout=8000)
    check(pg.locator('.g-score').count() == 1 and '/ 15' in h.locator('.g-score').inner_text(), 'stack: round ends with a score out of 15')
    pg.go_back(); pg.wait_for_timeout(200)
    # إيقاع: نضغط عند الوقت المناسب بقراءة الدقة من الصفحة؛ أيسر: تجاهل الضغط وتأكد من انتهاء 16 نبضة كلها فاتت
    h = start(pg, 'rhythm', 'سهل')
    check(pg.evaluate("!!document.querySelector('.rhy')"), 'rhythm: arena present')
    pg.wait_for_selector('.rhy-t', state='attached', timeout=3000)
    hits = 0
    for i in range(16):
        pg.wait_for_selector('.rhy-t', state='attached', timeout=4000)
        pg.wait_for_function("(()=>{var d=document.querySelector('.rhy-c');if(!d)return false;var m=/scale\\(([\\d.]+)\\)/.exec(d.style.transform);return m&&parseFloat(m[1])<=1.12})()", timeout=4000, polling='raf')
        pg.locator('.rhy').dispatch_event('pointerdown')
        pg.wait_for_timeout(700)
    pg.wait_for_selector('.g-end', timeout=8000)
    sc = h.locator('.g-score').inner_text()
    check(re.match(r'\d+ / 16', sc) is not None and int(sc.split()[0]) >= 8, f'rhythm: timed taps register as hits ({sc})')
    pg.go_back(); pg.wait_for_timeout(200)
    # ادمج: منطق الدمج على لوحة مضبوطة عبر التحكم المباشر
    h = start(pg, 'merge')
    check(pg.locator('.mrg-t.v').count() == 2, 'merge: starts with two tiles')
    before = pg.evaluate("[...document.querySelectorAll('.mrg-t')].map(t=>t.textContent).join(',')")
    for k in ('يمين', 'يسار', 'أعلى', 'أسفل'):
        h.get_by_role('button', name=k).click()
    after = pg.evaluate("[...document.querySelectorAll('.mrg-t')].map(t=>t.textContent).join(',')")
    check(before != after and pg.locator('.mrg-t.v').count() >= 2, 'merge: buttons move tiles and spawn new ones')
    sums = pg.evaluate("[...document.querySelectorAll('.mrg-t.v')].map(t=>+t.textContent).reduce((a,b)=>a+b,0)")
    check(sums % 2 == 0 and sums >= 4, f'merge: tile sum is consistent ({sums})')
    for i in range(400):
        if pg.locator('.g-end').count(): break
        for k in ('يمين', 'أسفل', 'يسار', 'أعلى'):
            if pg.locator('.g-end').count(): break
            pg.evaluate("[...document.querySelectorAll('.mrg-pad button')].find(b=>b.getAttribute('aria-label')=='%s')&&[...document.querySelectorAll('.mrg-pad button')].find(b=>b.getAttribute('aria-label')=='%s').click()" % (k, k))
    pg.wait_for_selector('.g-end', timeout=8000)
    check(pg.locator('.g-end').count() == 1, 'merge: game ends (goal or stuck) and shows results')
    check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
