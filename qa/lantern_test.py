import sys, pathlib
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def S(pg): return pg.evaluate("document.querySelector('canvas.ltn').__lantern()")
def chase(pg, want_ok, maxms=14000):
    """يحرّك الماوس نحو اليراعة المطلوبة حتى يتغير السؤال."""
    s0 = S(pg); box = pg.locator('canvas.ltn').bounding_box(); waited = 0
    while waited < maxms:
        s = S(pg)
        if s['over'] or s['qi'] != s0['qi'] or any(f['state'] for f in s['ff']): return s
        tgt = [f for f in s['ff'] if f['ok'] == want_ok and not f['state']]
        if tgt: pg.mouse.move(box['x'] + tgt[0]['x'], box['y'] + tgt[0]['y'])
        pg.wait_for_timeout(60); waited += 60
    return S(pg)
with sync_playwright() as p:
    b = p.chromium.launch()
    for vp, name in (({'width': 390, 'height': 844}, 'phone'), ({'width': 1280, 'height': 800}, 'desktop')):
        pg = b.new_page(viewport=vp); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(250)
        pg.locator('#picker button[data-g=lantern]').click(); h = pg.locator('#play-host'); h.locator('.g-chip', has_text='سهل').click(); h.get_by_role('button', name='ابدأ').click()
        h.locator('canvas.ltn').wait_for(); s = S(pg)
        check(len(s['ff']) == 4 and sum(f['ok'] for f in s['ff']) == 1 and s['bats'] >= 1, f'lantern ({name}): four fireflies, one correct, bats present')
        check(all(len(f['t']) <= 18 for f in s['ff']), 'answers short enough to read inside the light')
        e0 = s['energy']; pg.wait_for_timeout(1500); check(S(pg)['energy'] < e0, 'lantern fuel drains over time')
        box = pg.locator('canvas.ltn').bounding_box(); pg.mouse.move(box['x'] + 40, box['y'] + 40); pg.wait_for_timeout(900); o = S(pg)['owl']
        check(o['x'] < s['owl']['x'] - 40 and o['y'] < s['owl']['y'] - 40, f'owl flies toward the pointer {o}')
        # wrong answer first
        s1 = chase(pg, False); pg.wait_for_timeout(200); note = h.locator('.ltn-note').inner_text()
        check('خاطئة' in note and len(note) > 20, f'wrong answer shows the explanation ({note[:30]}...)')
        pg.wait_for_timeout(1800)
        for i in range(9):
            chase(pg, True); pg.wait_for_timeout(1800)
            if h.locator('.g-end').count(): break
        h.locator('.g-end').wait_for(timeout=15000)
        txt = h.locator('.g-score').inner_text()
        check('/ 10' in txt, f'round ends with a score ({txt.strip()[:20]})')
        check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), f'no horizontal overflow ({name})')
        check(not errs, f'no page errors ({name}) {errs[:1]}')
    # keyboard
    pk = b.new_page(viewport={'width': 390, 'height': 844}); pk.goto(URL); pk.wait_for_timeout(250)
    pk.locator('#picker button[data-g=lantern]').click(); hk = pk.locator('#play-host'); hk.locator('.g-chip', has_text='سهل').click(); hk.get_by_role('button', name='ابدأ').click(); hk.locator('canvas.ltn').wait_for()
    x0 = S(pk)['owl']['x']; pk.keyboard.down('ArrowLeft'); pk.wait_for_timeout(700); pk.keyboard.up('ArrowLeft'); pk.wait_for_timeout(300)
    check(S(pk)['owl']['x'] != x0, 'arrow keys move the owl')
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
