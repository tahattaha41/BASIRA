"""انحدار: وضعا تحدّي الدقيقة والبقاء كانا ينهاران عند ظهور سؤال صح/خطأ (متغير محلي يحجب دالة tf)."""
import sys, pathlib
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri(); fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    b = p.chromium.launch()
    for slug in ('blitz', 'survival'):
        pg = b.new_page(viewport={'width': 360, 'height': 740}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(200); pg.locator('#picker button[data-g=%s]' % slug).click(); h = pg.locator('#play-host'); h.locator('.g-chip', has_text='سهل').click(); h.get_by_role('button', name='ابدأ').click()
        seen = set(); n = 0
        for i in range(120):
            pg.wait_for_timeout(120)
            if h.locator('.g-end').count(): break
            if h.locator('.g-two').count(): seen.add('tf')
            elif h.locator('.g-opt').count(): seen.add('mcq')
            o = h.locator('.g-opt')
            if o.count():
                try: o.first.click(timeout=600); n += 1
                except Exception: pass
            nx = h.locator('.g-act .btn')
            if nx.count():
                try: nx.last.click(timeout=600)
                except Exception: pass
        check(not errs, f'{slug}: no JS errors across {n} answers (kinds {sorted(seen)}) {errs[:1]}')
        check(n >= 8, f'{slug}: the round actually progresses ({n} answers)')
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
