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
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto(URL); pg.wait_for_timeout(300)
    for lvl in ('سهل', 'متوسط', 'صعب'):
        h = start(pg, 'opsign', lvl); ok = True
        for i in range(10):
            eq = pg.locator('.g-eq').inner_text().replace('−', '-').replace('×', '*')
            m = re.match(r'(\d+)\s+\?\s+(\d+)\s+=\s+(\d+)', eq); a, bb, c = map(int, m.groups())
            ops = [o for o in ('+', '-', '*', '/') if (bb and eval(f'{a}{o}{bb}') == c)]
            ok &= len(ops) == 1
            sym = {'+': '+', '-': '−', '*': '×', '/': '÷'}[ops[0]]
            pg.evaluate("[...document.querySelectorAll('.g-opt')].find(b=>b.textContent=='%s').click()" % sym); nxt(h)
        check(ok and '10 / 10' in h.locator('.g-score').inner_text(), f'opsign ({lvl}): exactly one valid sign each time, 10/10')
        pg.go_back(); pg.wait_for_timeout(150)
    h = start(pg, 'numline')
    for i in range(8):
        n = int(re.search(r'\d+', pg.locator('#play-host .g-q').inner_text()).group())
        box = pg.locator('.nl-line').bounding_box()
        pg.mouse.click(box['x'] + box['width'] * n / 100, box['y'] + 20); nxt(h)
    check('8 / 8' in h.locator('.g-score').inner_text(), 'numline: tapping the exact position passes, 8/8')
    pg.go_back(); pg.wait_for_timeout(150)
    h = start(pg, 'numline'); box = pg.locator('.nl-line').bounding_box(); n = int(re.search(r'\d+', pg.locator('#play-host .g-q').inner_text()).group())
    pg.mouse.click(box['x'] + box['width'] * (((n + 50) % 100) / 100), box['y'] + 20)
    check('غير صحيحة' in h.locator('.g-fb').inner_text(), 'numline: a far tap is wrong')
    pg.go_back(); pg.wait_for_timeout(150)
    h = start(pg, 'pathmem')
    seq = pg.evaluate("""new Promise(r=>{var s=[],cells=[...document.querySelectorAll('.path-c')];var mo=new MutationObserver(m=>{m.forEach(x=>{var i=cells.indexOf(x.target);if(i>=0&&x.target.classList.contains('lit')&&!(x.oldValue||'').includes('lit'))s.push(i)})});
      cells.forEach(c=>mo.observe(c,{attributes:true,attributeOldValue:true,attributeFilter:['class']}));setTimeout(()=>{mo.disconnect();r(s)},500+3*650+500)})""")
    check(len(seq) == 3, f'pathmem: three cells lit in sequence {seq}')
    pg.wait_for_timeout(600)
    for i in seq: pg.evaluate("document.querySelectorAll('.path-c')[%d].click()" % i)
    check(pg.locator('.g-fb').inner_text().startswith('إجابة صحيحة'), 'pathmem: repeating the path is correct')
    pg.go_back(); pg.wait_for_timeout(150)
    h = start(pg, 'revdigits')
    for i in range(6):
        code = h.locator('.dig-disp').inner_text().strip(); pg.wait_for_selector('.dig-key', timeout=4000)
        for ch in code[::-1]: pg.evaluate("[...document.querySelectorAll('.dig-key')].find(t=>t.textContent=='%s').click()" % ch)
        nxt(h)
    check('6 / 6' in h.locator('.g-score').inner_text(), 'revdigits: typing the reverse passes, 6/6')
    pg.go_back(); pg.wait_for_timeout(150)
    h = start(pg, 'shades')
    for i in range(6):
        order = pg.evaluate("[...document.querySelectorAll('.shd-t')].map((t,i)=>{var m=getComputedStyle(t).backgroundColor.match(/[\\d.]+/g).map(Number);return [(Math.max(m[0],m[1],m[2])+Math.min(m[0],m[1],m[2]))/2,i]}).sort((a,b)=>a[0]-b[0]).map(x=>x[1])")
        for k in order: pg.evaluate("document.querySelectorAll('.shd-t')[%d].click()" % k)
        nxt(h)
    check('6 / 6' in h.locator('.g-score').inner_text(), 'shades: darkest-to-lightest order passes, 6/6')
    pg.go_back(); pg.wait_for_timeout(150)
    h = start(pg, 'intruder')
    for i in range(8):
        k = int(re.search(r'\d+', pg.locator('#play-host .g-q').inner_text()).group())
        bad = pg.evaluate("[...document.querySelectorAll('.sch-tile')].filter(t=>Number(t.textContent)%%%d!==0).length" % k)
        pg.evaluate("[...document.querySelectorAll('.sch-tile')].find(t=>Number(t.textContent)%%%d!==0).click()" % k); nxt(h)
        if bad != 1: check(False, 'intruder: exactly one non-multiple')
    check('8 / 8' in h.locator('.g-score').inner_text(), 'intruder: exactly one intruder each time, 8/8')
    check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
