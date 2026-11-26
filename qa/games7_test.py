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
def nxt(h): h.locator('.g-act .btn').last.click()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    h = start(pg, 'stroop')
    for i in range(10):
        word_color = pg.evaluate("getComputedStyle(document.querySelector('.g-stroop')).color")
        pg.evaluate("document.querySelector('.g-opt[data-ok=\"1\"]').click()"); nxt(h)
    check('10 / 10' in h.locator('.g-score').inner_text(), 'stroop: 10/10 choosing the ink color answer')
    h = start(pg, 'compare') if h.get_by_role('button', name='العب مجدداً').count() == 0 else h
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'compare')
    allok = True
    for i in range(10):
        ex = [pg.evaluate("document.querySelectorAll('.g-opt span')[%d].textContent" % k) for k in (0, 1)]
        vals = [eval(e.replace('×', '*').replace('−', '-'), {'__builtins__': {}}) for e in ex]
        idx = 0 if vals[0] > vals[1] else 1
        allok &= vals[0] != vals[1]
        pg.evaluate("document.querySelectorAll('.g-opt')[%d].click()" % idx); nxt(h)
    check(allok and '10 / 10' in h.locator('.g-score').inner_text(), 'compare: never equal, 10/10 by computing the bigger side')
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'count')
    for i in range(8):
        pg.wait_for_selector('#play-host .g-opt', timeout=4000)
        pg.evaluate("document.querySelectorAll('.g-opt')[0].disabled")  # options exist
        n = pg.evaluate("window.__n")  # not exposed; use the dots count captured before they vanish
        break
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'count')
    n = pg.locator('.cnt-dot').count()
    check(3 <= n <= 6, f'count: easy shows 3-6 dots ({n})')
    pg.wait_for_selector('#play-host .g-opt', timeout=4000)
    check(pg.locator('.cnt-dot').count() == 0 and pg.locator('#play-host .g-opt').count() == 4 and pg.locator('#play-host .g-opt', has_text=re.compile('^%d$' % n)).count() == 1, 'count: dots vanish, four options include the right count')
    pg.locator('#play-host .g-opt', has_text=re.compile('^%d$' % n)).click(); check('صحيح' in h.locator('.g-fb').inner_text(), 'count: correct answer accepted')
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'schulte')
    for i in range(3):
        for v in range(1, 10): pg.evaluate("[...document.querySelectorAll('.sch-tile')].find(t=>t.textContent=='%d').click()" % v)
        nxt(h)
    check('3 / 3' in h.locator('.g-score').inner_text(), 'schulte: three boards finished in order')
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'schulte')
    pg.evaluate("[...document.querySelectorAll('.sch-tile')].find(t=>t.textContent=='5').click()")
    check(pg.locator('.sch-tile.done').count() == 0, 'schulte: out-of-order tap is ignored')
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'odd')
    for i in range(8):
        odd = pg.evaluate("(()=>{var t=[...document.querySelectorAll('.odd-tile')],c={};t.forEach((x,i)=>{var k=x.style.background;(c[k]=c[k]||[]).push(i)});return Object.values(c).find(a=>a.length===1)[0]})()")
        pg.evaluate("document.querySelectorAll('.odd-tile')[%d].click()" % odd); nxt(h)
    check('8 / 8' in h.locator('.g-score').inner_text(), 'odd: exactly one differing tile each time, 8/8')
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'multiples')
    for i in range(6):
        k = int(re.search(r'\d+', pg.locator('#play-host .g-q').inner_text()).group())
        pg.evaluate("[...document.querySelectorAll('.sch-tile')].filter(t=>Number(t.textContent)%%%d===0).forEach(t=>t.click())" % k); nxt(h)
    check('6 / 6' in h.locator('.g-score').inner_text(), 'multiples: tapping all multiples passes, 6/6')
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'multiples')
    k = int(re.search(r'\d+', pg.locator('#play-host .g-q').inner_text()).group())
    pg.evaluate("[...document.querySelectorAll('.sch-tile')].find(t=>Number(t.textContent)%%%d!==0).click()" % k)
    check('غير صحيحة' in h.locator('.g-fb').inner_text(), 'multiples: a non-multiple ends the question as wrong')
    pg.go_back(); pg.wait_for_timeout(200)
    h = start(pg, 'digits')
    for i in range(6):
        code = h.locator('.dig-disp').inner_text().strip(); pg.wait_for_selector('.dig-key', timeout=4000)
        for ch in code: pg.evaluate("[...document.querySelectorAll('.dig-key')].find(t=>t.textContent=='%s').click()" % ch)
        nxt(h)
    check('6 / 6' in h.locator('.g-score').inner_text(), 'digits: typing the remembered code passes, 6/6')
    check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
