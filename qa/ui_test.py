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
    check(attr(pg, 'data-theme') == 'dark' and pg.locator('.js-theme').first.inner_text() == 'Theme: Dark', 'dark is the default theme (label in English)')
    pg.locator('.js-lang').first.click()
    check(attr(pg, 'lang') == 'ar' and pg.locator('.js-theme').first.inner_text() == 'المظهر: داكن', 'back to Arabic keeps theme label')
    # theme modes: dark -> light -> auto, saved and restored
    tb = pg.locator('.js-theme').first
    tb.click()
    check(attr(pg, 'data-theme') == 'light' and pg.evaluate("localStorage.getItem('site-theme')") == 'light', 'light mode available and saved')
    pg.reload()
    check(attr(pg, 'data-theme') == 'light', 'light choice persists after reload')
    pg.locator('.js-theme').first.click()
    check(attr(pg, 'data-pref') == 'auto' and pg.evaluate("localStorage.getItem('site-theme')") == 'auto', 'auto mode saved')
    pg.emulate_media(color_scheme='light')
    pg.reload()
    check(attr(pg, 'data-theme') == 'light', 'auto follows device (light)')
    pg.emulate_media(color_scheme='dark')
    pg.wait_for_timeout(200)
    check(attr(pg, 'data-theme') == 'dark', 'auto follows device change live (dark)')
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
    # --- إمكانية الوصول وأحجام اللمس (390px)
    pa = b.new_page(viewport={'width': 390, 'height': 844}); pa.goto(URL); pa.wait_for_timeout(400)
    small = pa.evaluate("""()=>[...document.querySelectorAll('button,a.btn,.gcard,.g-chip,input')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.height<44}).map(e=>e.className)""")
    check(small == [], 'touch targets are at least 44px tall ' + str(small))
    noname = pa.evaluate("""()=>[...document.querySelectorAll('button,a,input')].filter(e=>!(e.textContent.trim()||e.getAttribute('aria-label')||e.getAttribute('placeholder')||e.getAttribute('title'))).length""")
    check(noname == 0, 'every button, link and input has an accessible name')
    check(pa.evaluate("[...document.querySelectorAll('svg.i3,.hero-art')].every(s=>s.getAttribute('aria-hidden')==='true')"), 'decorative SVG icons are hidden from screen readers')
    check(pa.locator('h1').count() == 1, 'exactly one h1 on the home page')
    # --- حالة فارغة/خطأ: تُعرض عند غياب المنصة والمقالات
    pa.evaluate("document.getElementById('play').remove();document.querySelectorAll('.content .post').forEach(e=>e.remove())")
    check(pa.evaluate('BSR.emptyState()') is True and pa.locator('.empty-state .btn').count() == 2, 'empty/404 state renders with home and play links')
    check(pa.evaluate('BSR.emptyState()') is True and pa.locator('.empty-state').count() == 1, 'empty state is not duplicated')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
