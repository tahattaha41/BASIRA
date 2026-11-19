#!/usr/bin/env python3
"""اختبار المتصفح الفعلي (Chromium): لقطات + عدم تجاوز العرض + حجم أهداف اللمس + أخطاء الكونسول."""
import os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(__file__))
from blogger_sim import Sim
from fixtures import PAGES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dist', 'preview'); os.makedirs(OUT, exist_ok=True)
sim = Sim(open(os.path.join(ROOT, 'dist/theme.xml'), encoding='utf-8').read())
fails = []
def check(n, ok, d=''):
    print(('PASS ' if ok else 'FAIL ') + n + (' — ' + str(d) if not ok else ''))
    if not ok: fails.append(n)

VIEWS = [('phone', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)),
         ('small', dict(viewport={'width': 360, 'height': 740}, device_scale_factor=1, is_mobile=True, has_touch=True)),
         ('desktop', dict(viewport={'width': 1280, 'height': 800}, device_scale_factor=1))]
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for key, fn in PAGES.items():
        path = os.path.join(OUT, key + '.html')
        open(path, 'w', encoding='utf-8').write(sim.html(fn()))
        for vname, opts in VIEWS:
            for theme in ('light', 'dark'):
                if vname == 'small' and theme == 'dark': continue
                ctx = br.new_context(**opts); pg = ctx.new_page(); errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
                pg.goto('file://' + path)
                if theme == 'dark':
                    pg.evaluate("document.getElementById('theme-toggle').click()")
                tag = f'{key}/{vname}/{theme}'
                sw = pg.evaluate('document.documentElement.scrollWidth'); cw = pg.evaluate('document.documentElement.clientWidth')
                check(f'[{tag}] لا تمرير أفقي', sw <= cw, f'{sw}>{cw}')
                check(f'[{tag}] لا أخطاء JS', not errs, errs)
                if vname != 'desktop':
                    small = pg.evaluate("""()=>[...document.querySelectorAll('button,input:not([type=checkbox]),.nav a,.btn,.btn-quiet')].filter(e=>e.offsetParent!==null).map(e=>[e.className||e.tagName,e.getBoundingClientRect().height]).filter(x=>x[1]<44)""")
                    check(f'[{tag}] أهداف اللمس ≥ 44px', not small, small)
                    fs = pg.evaluate("()=>[...document.querySelectorAll('input[type=search]')].map(e=>parseFloat(getComputedStyle(e).fontSize)).filter(x=>x<16)")
                    check(f'[{tag}] خط حقل البحث ≥ 16px (لا تكبير تلقائي في iOS)', not fs, fs)
                if key == 'home' or (key == 'item' and vname == 'phone' and theme == 'light'):
                    pg.screenshot(path=os.path.join(OUT, f'{key}-{vname}-{theme}.png'), full_page=True)
                ctx.close()
    # قائمة الجوال تفتح
    ctx = br.new_context(**VIEWS[0][1]); pg = ctx.new_page(); pg.goto('file://' + os.path.join(OUT, 'home.html'))
    before = pg.evaluate("getComputedStyle(document.querySelector('.nav')).display")
    pg.click('label.menu-btn'); after = pg.evaluate("getComputedStyle(document.querySelector('.nav')).display")
    check('قائمة الجوال تُفتح بالنقر', before == 'none' and after == 'flex', (before, after))
    pg.screenshot(path=os.path.join(OUT, 'home-phone-menu.png'))
    # البحث الفارغ لا يُرسل
    pg.click('label.menu-btn'); pg.click('form.find button'); check('بحث فارغ لا يغادر الصفحة', pg.url.startswith('file://'))
    br.close()
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
