import sys, pathlib
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def open_game(pg, slug, lvl='سهل'):
    pg.locator('#picker button[data-g=%s]' % slug).click(); h = pg.locator('#play-host')
    h.locator('.g-chip', has_text=lvl).click(); h.get_by_role('button', name='ابدأ').click(); return h
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    # battle
    h = open_game(pg, 'battle')
    check(h.locator('.btl .chr-owl').count() == 1 and h.locator('.btl .chr-imp').count() == 1, 'battle: hero and monster characters drawn')
    w0 = pg.evaluate("document.querySelector('.btl-hp-m i').style.width")
    h.locator('.g-opt[data-ok="1"]').click(); pg.wait_for_timeout(500)
    w1 = pg.evaluate("document.querySelector('.btl-hp-m i').style.width")
    check(w0 == '100%' and w1 != w0 and h.locator('.btl-h.atk').count() == 1, 'battle: right answer damages the monster and the hero attacks ' + w1)
    h.locator('.g-act .btn').last.click()
    h.locator('.g-opt[data-ok="0"]').first.click(); pg.wait_for_timeout(300)
    check(h.locator('.btl-m.atk').count() == 1 and pg.evaluate("document.querySelector('.btl-hp i').style.width") == '75%', 'battle: wrong answer hurts the hero by 25%')
    h.locator('.g-act .btn').last.click()
    for i in range(6):
        h.locator('.g-opt[data-ok="1"]').click(); h.locator('.g-act .btn').last.click()
    check('/ 8' in h.locator('.g-score').inner_text(), 'battle: round finishes with a score')
    # lanes
    pg.goto(URL); pg.wait_for_timeout(200); h = open_game(pg, 'lanes')
    check(h.locator('.lns-g').count() == 3 and h.locator('.lns-g[data-ok="1"]').count() == 1 and h.locator('.chr-cat').count() == 1, 'lanes: three gates, one correct, runner drawn')
    for i in range(8):
        k = pg.evaluate("[...document.querySelectorAll('.lns-g')].findIndex(g=>g.dataset.ok==='1')")
        h.locator('.lns-c').nth(k).click(); h.locator('.g-fb').wait_for(state='visible', timeout=3000)
        if i == 0: check(h.locator('.lns-g.ok').count() == 1 and h.locator('.lns-r.cheer').count() == 1, 'lanes: runner cheers on right lane')
        h.locator('.g-act .btn').last.click()
    check('8 / 8' in h.locator('.g-score').inner_text(), 'lanes: perfect 8/8 by choosing lanes')
    # hopper
    pg.goto(URL); pg.wait_for_timeout(200); h = open_game(pg, 'hopper')
    check(h.locator('.hop-l').count() == 3 and h.locator('.chr-frog').count() == 1, 'hopper: three pads and a frog')
    h.locator('.hop-l[data-ok="0"]').first.dispatch_event('click'); h.locator('.g-fb').wait_for(state='visible', timeout=3000); pg.wait_for_timeout(700)
    check(h.locator('.hop-f.sink').count() == 1 and h.locator('.hop-l.bad').count() == 1, 'hopper: wrong pad sinks the frog')
    h.locator('.g-act .btn').last.click()
    for i in range(7):
        h.locator('.hop-l[data-ok="1"]').dispatch_event('click'); h.locator('.g-fb').wait_for(state='visible', timeout=3000); h.locator('.g-act .btn').last.click()
    check('7 / 8' in h.locator('.g-score').inner_text(), 'hopper: 7/8 after one wrong pad')
    # moles
    pg.goto(URL); pg.wait_for_timeout(200); h = open_game(pg, 'moles', 'سهل')
    check(h.locator('.mol-h[data-k]').count() == 4 and h.locator('.mol-h').count() == 6, 'moles: six holes, four moles carry answers')
    ok = 0
    for i in range(8):
        h.locator('.mol-h.up[data-ok="1"]').wait_for(timeout=12000); h.locator('.mol-h.up[data-ok="1"]').click(); ok += 1
        h.locator('.g-act .btn').last.click()
    check('8 / 8' in h.locator('.g-score').inner_text(), 'moles: 8/8 by tapping the right mole')
    h.get_by_role('button', name='جولة جديدة').click()
    h.locator('.mol-h.up[data-ok="0"]').wait_for(timeout=12000); h.locator('.mol-h.up[data-ok="0"]').click()
    check(h.locator('.mol-h.bad').count() == 1 and h.locator('.mol-h.ok').count() >= 1, 'moles: wrong mole is marked and the right one revealed')
    check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow (phone)')
    check(not errs, 'no page errors ' + str(errs[:2]))
    # reduced motion
    pr = b.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce'); pr.goto(URL); pr.wait_for_timeout(200)
    hr = open_game(pr, 'hopper'); hr.locator('.hop-l[data-ok="1"]').dispatch_event('click'); hr.locator('.g-fb').wait_for(state='visible', timeout=2000)
    check(hr.locator('.hop-l.ok').count() >= 1, 'hopper works with reduced motion')
    # english LTR
    pe = b.new_page(viewport={'width': 1280, 'height': 800}); pe.goto(URL); pe.wait_for_timeout(200)
    print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
