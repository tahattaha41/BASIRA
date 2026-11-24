#!/usr/bin/env python3
"""اختبار سحب اللمس الفعلي في لعبة الترتيب: أحداث لمس حقيقية عبر CDP (Input.dispatchTouchEvent) على سياق جوال has_touch."""
import re, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
URL = (Path(__file__).resolve().parents[1] / 'preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def ex(t): return re.compile('^' + re.escape(t) + '$')

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    cdp = ctx.new_cdp_session(pg)
    def touch(kind, x, y):
        cdp.send('Input.dispatchTouchEvent', {'type': kind, 'touchPoints': [] if kind == 'touchEnd' else [{'x': x, 'y': y}]})
    pg.locator('#picker button[data-g=order]').tap()
    host = pg.locator('#play-host'); host.locator('.g-chip', has_text=ex('سهل')).tap()
    host.get_by_role('button', name='ابدأ').tap(); pg.wait_for_timeout(200)
    items = host.locator('.g-item'); n = items.count()
    items.first.scroll_into_view_if_needed()
    texts = lambda: [t.split('\n')[1].strip() for t in host.locator('.g-item').all_inner_texts()]  # اسم العنصر دون الرقم والأسهم
    def center(loc):
        bb = loc.bounding_box(); return bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2
    # 2) لمس المقبض (الرقم) يسحب العنصر الأول إلى آخر القائمة
    before = texts()
    pg.evaluate("document.querySelector('#play-host .g-item').scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-120,behavior:'instant'})"); pg.wait_for_timeout(500)
    hx, hy = center(host.locator('.g-item .g-n').first)
    ly = center(host.locator('.g-item').last)[1] + 18  # أسفل منتصف آخر عنصر
    touch('touchStart', hx, hy)
    for i in range(1, 13): touch('touchMove', hx, hy + (ly - hy) * i / 12); pg.wait_for_timeout(15)
    touch('touchEnd', 0, 0); pg.wait_for_timeout(200)
    after = texts()
    check(after != before and sorted(after) == sorted(before), 'touch drag on the number handle reorders items')
    check(after[-1] == before[0], 'first item dropped at the end of the list')
    nums = [x.strip() for x in host.locator('.g-item .g-n').all_inner_texts()]
    check(nums == [str(i + 1) for i in range(n)], 'position numbers renumbered after drag')
    # 2b) لمس خارج المقبض لا يسحب (يترك التمرير للمتصفح)
    before = texts(); items = host.locator('.g-item'); box = items.first.bounding_box()
    sx, sy = box['x'] + box['width'] * .5, box['y'] + box['height'] / 2
    ly = center(items.last)[1]
    touch('touchStart', sx, sy)
    for i in range(1, 9): touch('touchMove', sx, sy + (ly - sy) * i / 8)
    touch('touchEnd', 0, 0); pg.wait_for_timeout(150)
    check(texts() == before, 'touch on the item body does not drag (page can scroll)')
    # 3) بديل اللمس: أزرار الأسهم
    host.locator('.g-item').nth(n - 1).locator('.g-arrow').first.tap(); pg.wait_for_timeout(100)
    check(texts()[n - 2] == after[-1], 'arrow buttons still reorder by tap (non-drag alternative)')
    check(errs == [], 'no JS errors ' + str(errs))
    b.close()
print('FAILED' if fails else 'ALL PASS'); sys.exit(1 if fails else 0)
