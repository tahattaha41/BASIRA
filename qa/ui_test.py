#!/usr/bin/env python3
"""اختبار الواجهة في Chromium على preview/index.html (نفس ترميز القالب): اللغتان، الاتجاه، البحث، الأحجام، الوضع الداكن."""
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT / 'preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
attr = lambda pg, a: pg.evaluate(f"document.documentElement.getAttribute('{a}')")
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (360, 390, 768, 1280):
        pg = b.new_page(viewport={'width': w, 'height': 900}); pg.goto(URL)
        check(pg.evaluate('document.documentElement.scrollWidth') <= w, f'no horizontal scroll at {w}px')
        tiny = pg.evaluate("[...document.querySelectorAll('button,.btn,a.btn')].filter(e=>e.offsetParent&&e.getBoundingClientRect().height<40).map(e=>e.className+e.textContent.slice(0,10))")
        check(not tiny, f'touch targets >= 40px at {w}px ' + str(tiny[:3]))
        pg.close()
    pg = b.new_page(viewport={'width': 390, 'height': 900}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL)
    check(attr(pg, 'lang') == 'ar' and attr(pg, 'dir') == 'rtl', 'default is Arabic RTL')
    check(pg.locator('h1').first.inner_text() == 'اعرف أكثر، ثم تحدَّ نفسك', 'Arabic hero title')
    # لعبة قيد التشغيل ثم تبديل اللغة: لا تضيع
    pg.locator('#play-host').get_by_role('button', name='ابدأ').click()
    qtxt = pg.locator('#play-host .g-q').inner_text()
    pg.locator('.js-lang').first.click()
    check(attr(pg, 'lang') == 'en' and attr(pg, 'dir') == 'ltr', 'switch to English sets lang=en dir=ltr')
    check(pg.locator('h1').first.inner_text() == 'Learn something, then challenge yourself', 'English hero title')
    check(pg.locator('.js-lang').first.inner_text() == 'العربية', 'switcher label flips')
    check(pg.locator('#play-host .g-q').inner_text() == qtxt, 'running game is not lost on language switch')
    check(pg.locator('#lang-note').is_visible(), 'English note about Arabic-only questions is shown')
    check(pg.locator('.find input').get_attribute('placeholder') == 'Search articles', 'search placeholder translated')
    check(pg.locator('.topics b').first.inner_text() == 'Science', 'topic names translated')
    check(pg.evaluate("localStorage.getItem('basira.lang')") == 'en', 'language choice saved')
    check(pg.evaluate('document.documentElement.scrollWidth') <= 390, 'no horizontal scroll in English')
    pg.reload()
    check(attr(pg, 'lang') == 'en' and attr(pg, 'dir') == 'ltr', 'language persists after reload')
    pg.locator('.js-theme').first.click()
    check(pg.locator('.js-theme').first.inner_text() == 'Light mode', 'theme toggle label in English')
    pg.locator('.js-lang').first.click()
    check(attr(pg, 'lang') == 'ar' and pg.locator('.js-theme').first.inner_text() == 'الوضع الفاتح', 'back to Arabic keeps dark theme and label')
    # ?lang=en
    pg2 = b.new_page(); pg2.goto(URL + '?lang=en')
    check(attr(pg2, 'lang') == 'en', '?lang=en URL parameter selects English')
    # الروابط الداخلية للأقسام
    hrefs = pg.evaluate("[...document.querySelectorAll('.topics a')].map(a=>a.getAttribute('href'))")
    check(len(hrefs) == 8 and all(h.startswith('/search/label/') for h in hrefs), '8 topic cards link to Blogger label pages')
    # البحث
    nav = []; pg.on('request', lambda r: nav.append(r.url))
    pg.locator('.find input').fill('الضوء'); pg.locator('.find button').click(); pg.wait_for_timeout(300)
    check(any('/search?q=' in u for u in nav), 'search form submits to /search?q=')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
