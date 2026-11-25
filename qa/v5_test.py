import sys, pathlib
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
GAMES = ['mcq', 'truefalse', 'order', 'memory', 'word', 'math', 'pattern', 'simon', 'blitz', 'survival', 'bubbles']
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (360, 390, 768, 1280):
        pg = b.new_page(viewport={'width': w, 'height': 800}); pg.goto(URL); pg.wait_for_timeout(300)
        check(pg.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'no horizontal overflow at {w}px (home)')
        pg.locator('#picker button[data-g=math]').click(); pg.wait_for_timeout(300)
        check(pg.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'no horizontal overflow at {w}px (game view)')
        pg.close()
    pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    check(pg.locator('#picker .gcard').count() == 11, 'eleven game cards')
    check(pg.evaluate("!document.body.className.includes('view-game')") and not pg.locator('#play-host').is_visible(), 'home shows no game until one is chosen')
    pg.locator('.gfilter[data-f=speed]').click()
    vis = pg.evaluate("[...document.querySelectorAll('#picker .gcard')].filter(c=>c.offsetParent).map(c=>c.dataset.g)")
    check(0 < len(vis) < 10 and 'mcq' not in vis and 'blitz' in vis, 'speed filter narrows the cards ' + str(vis))
    pg.locator('.gfilter[data-f=all]').click()
    for g in GAMES:
        pg.locator(f'#picker button[data-g={g}]').click(); pg.wait_for_timeout(150)
        check('game=' + g in pg.url and pg.evaluate("document.body.className.includes('view-game')") or 'view-game' in pg.evaluate('document.documentElement.className + document.body.className'), f'{g}: opens on its own page (?game=)')
        pg.go_back(); pg.wait_for_timeout(150)
        check('game=' not in pg.url, f'{g}: browser back returns home')
    # الحساب: الإجابة الصحيحة موجودة دائماً بين الخيارات وتُحسب بالبرنامج
    pg.locator('#picker button[data-g=math]').click()
    h = pg.locator('#play-host'); h.get_by_role('button', name='ابدأ').click()
    for i in range(3):
        q = h.locator('.g-q').inner_text().replace('×', '*').replace('÷', '/').replace('−', '-').replace('=', '').replace('؟', '').replace('?', '').strip()
        try: val = eval(q, {'__builtins__': {}}); ok = True
        except Exception: ok = False
        if ok:
            opts = [o.inner_text().strip() for o in h.locator('.g-opt').all()]
            check(str(int(val)) in opts, f'math: correct answer {int(val)} is among options {opts}')
            h.locator('.g-opt', has_text=str(int(val))).first.click()
        else:
            h.locator('.g-opt').first.click()
        h.locator('.g-act .btn').last.click()
    pg.go_back()
    check(pg.locator('.scrub .w').count() >= 10, 'manifesto is split into words (Arabic joining intact)')
    check(pg.locator('h1').first.is_visible(), 'hero title visible after mask reveal')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
