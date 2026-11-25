import sys, pathlib
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    pg.locator('#picker button[data-g=bubbles]').click(); h = pg.locator('#play-host')
    h.locator('.g-chip', has_text='سهل').click(); h.get_by_role('button', name='ابدأ').click()
    check(h.locator('.bub').count() == 4 and h.locator('.bub[data-ok="1"]').count() == 1, 'four bubbles, exactly one correct')
    y1 = pg.evaluate("document.querySelector('.bub').style.transform"); pg.wait_for_timeout(400)
    y2 = pg.evaluate("document.querySelector('.bub').style.transform")
    check(y1 != y2, 'bubbles are moving')
    small = pg.evaluate("[...document.querySelectorAll('.bub')].every(b=>b.getBoundingClientRect().width>=88)")
    check(small, 'bubbles are large enough to tap (>=88px)')
    for i in range(8):
        pg.evaluate("document.querySelector('.bub[data-ok=\"1\"]').click()")
        pg.wait_for_timeout(120)
        h.locator('.g-act .btn').last.click()
    check('8 / 8' in h.locator('.g-score').inner_text(), 'perfect round 8/8 by popping correct bubbles')
    h.get_by_role('button', name='جولة جديدة').click()
    pg.evaluate("document.querySelector('.bub[data-ok=\"0\"]').click()")
    check(h.locator('.bub.bad').count() == 1 and h.locator('.bub.ok').count() == 1, 'wrong pop marks it and reveals the right one')
    check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    pr = b.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce'); pr.goto(URL)
    pr.locator('#picker button[data-g=bubbles]').click(); pr.locator('#play-host').get_by_role('button', name='ابدأ').click()
    a = pr.evaluate("document.querySelector('.bub').style.transform"); pr.wait_for_timeout(400)
    check(a == pr.evaluate("document.querySelector('.bub').style.transform"), 'reduced motion: bubbles stay still')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
