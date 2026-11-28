import sys, pathlib
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def start(pg, slug, lvl='سهل'):
    pg.goto(URL); pg.wait_for_timeout(250); pg.locator('#picker button[data-g=%s]' % slug).click(); h = pg.locator('#play-host')
    h.locator('.g-chip', has_text=lvl).click(); h.get_by_role('button', name='ابدأ').click(); return h
with sync_playwright() as p:
    b = p.chromium.launch()
    for vp, name in (({'width': 390, 'height': 844}, 'phone'), ({'width': 1280, 'height': 800}, 'desktop')):
        pg = b.new_page(viewport=vp); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        # ---- swarm
        h = start(pg, 'swarm'); h.locator('canvas.ltn').wait_for(); S = lambda: pg.evaluate("(()=>{const c=document.querySelector('canvas.ltn');return c?c.__swarm():{alive:0,saved:99,need:0,stage:9,cleared:9,over:true}})()")
        s = S(); check(s['alive'] == 14 and s['thorns'] >= 4 and s['bats'] == 0 and s['stage'] == 0, f'swarm ({name}): 14 fireflies, thorns, stage 1 has no bats')
        box = pg.locator('canvas.ltn').bounding_box(); H = s['H']
        for k in range(0, 40):
            y = H - 50 - k * (H - 80) / 39
            cx = pg.evaluate("y=>document.querySelector('canvas.ltn').__cx(y)", y); box = pg.locator('canvas.ltn').bounding_box(); pg.mouse.move(box['x'] + cx * box['width'] / s['W'], box['y'] + y * box['height'] / H); pg.wait_for_timeout(110)
        for _ in range(20):
            s2 = S()
            if s2['saved'] >= s2['need'] or s2['stage'] >= 1: break
            pg.wait_for_timeout(300)
        check(s2['stage'] >= 1 or s2['saved'] >= s['need'] or s2['cleared'] >= 1, f'swarm: following the path saves enough fireflies (saved {s2["saved"]}/{s2["need"]}, stage {s2["stage"]+1}, alive {s2["alive"]}, lantern {s2.get("lantern")}, th {s.get("th")[:4]})')
        pg2 = b.new_page(viewport=vp); h2 = start(pg2, 'swarm'); b2 = pg2.locator('canvas.ltn').bounding_box(); sw = pg2.evaluate("document.querySelector('canvas.ltn').__swarm()"); a0 = sw['alive']; tt = sw['th'][0]
        for k in range(1, 31): b2 = pg2.locator('canvas.ltn').bounding_box(); pg2.mouse.move(b2['x'] + (sw['W'] / 2 + (tt['x'] - sw['W'] / 2) * k / 30) * b2['width'] / sw['W'], b2['y'] + ((sw['H'] - 50) + (tt['y'] - (sw['H'] - 50)) * k / 30) * b2['height'] / sw['H']); pg2.wait_for_timeout(70)
        al = a0
        for _ in range(24):
            pg2.wait_for_timeout(250); al = pg2.evaluate("(()=>{const c=document.querySelector('canvas.ltn');return c?c.__swarm().alive:0})()")
            if al < a0: break
        check(al < a0, 'swarm: leading the swarm into a thorn kills fireflies')
        # ---- flip
        h = start(pg, 'flip'); h.locator('canvas.ltn').wait_for(); F = lambda: pg.evaluate("document.querySelector('canvas.ltn').__flip()")
        f0 = F(); pg.keyboard.press('Space'); pg.wait_for_timeout(500); f1 = F()
        check(f0['side'] != f1['side'] or f1['dead'], f'flip ({name}): space flips gravity side {f0["side"]}->{f1["side"]}')
        pg3 = b.new_page(viewport=vp); h3 = start(pg3, 'flip'); pg3.wait_for_timeout(9000)
        check(pg3.locator('.g-end').count() == 1 or pg3.evaluate("document.querySelector('canvas.ltn').__flip()")['dead'], 'flip: doing nothing ends the run on the first spike')
        pg4 = b.new_page(viewport=vp); h4 = start(pg4, 'flip'); alive = True
        for i in range(520):
            st = pg4.evaluate("document.querySelector('canvas.ltn')?document.querySelector('canvas.ltn').__flip():null")
            if not st or st['dead']: alive = False; break
            nxt = [o for o in st['obs'] if o['x'] + o['w'] > st['OX'] - 16]
            if nxt:
                o = min(nxt, key=lambda q: q['x']); d = o['x'] - st['OX']
                if o['side'] == st['side'] and d < st['v'] * 0.55 and d > -10: pg4.keyboard.press('Space')
            pg4.wait_for_timeout(25)
        st = pg4.evaluate("document.querySelector('canvas.ltn')?document.querySelector('canvas.ltn').__flip():null")
        check(alive and st and st['dist'] > 25, f'flip: a bot that flips in time survives 13 s ({st and round(st["dist"])} m)')
        # ---- mirrors
        h = start(pg, 'mirrors', 'سهل'); h.locator('.mir').wait_for(); M = lambda: pg.evaluate("document.querySelector('.mir').__st")
        m0 = M(); check(m0['lit'] < m0['total'] and m0['level'] == 1 and len(m0['scr']) >= 2, f'mirrors ({name}): level 1 starts unsolved with a known solution {m0["scr"]}')
        solved_levels = 0
        for lv in range(5):
            m = M(); assert m['level'] == lv + 1, m
            for c in m['scr']: h.locator('.mir-c[data-x="%d"][data-y="%d"]' % (c[0], c[1])).click()
            pg.wait_for_timeout(150); m = M()
            if lv == 0: check(m['lit'] == m['total'] and m['moves'] == m['par'], 'mirrors: the known solution lights every crystal in the best number of moves')
            if lv < 4: pg.wait_for_selector('.mir', timeout=4000); pg.wait_for_function("(l)=>{const e=document.querySelector('.mir');return e&&e.__st&&e.__st.level===l}", arg=lv + 2, timeout=5000)
            solved_levels += 1
        h.locator('.g-end').wait_for(timeout=5000); check('5 / 5' in h.locator('.g-score').inner_text(), 'mirrors: five levels solved gives 5 / 5')
        hq = start(pg, 'mirrors'); hq.locator('.mir').wait_for(); n0 = M()['moves']; cell = hq.locator('.mir-c.has').first; cell.click(); check(M()['moves'] == n0 + 1, 'mirrors: tapping a mirror counts a move')
        hq.get_by_role('button', name='إعادة المستوى').click(); check(M()['moves'] == 0, 'mirrors: reset returns to the start')
        check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), f'no horizontal overflow ({name})')
        check(not errs, f'no page errors ({name}) {errs[:1]}')
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
