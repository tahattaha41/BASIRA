#!/usr/bin/env python3
"""اختبارات القالب. تُشغَّل بعد scripts/build.py. كل فحص يطبع PASS/FAIL فعلياً."""
import json, os, re, sys
from html.parser import HTMLParser
sys.path.insert(0, os.path.dirname(__file__))
from blogger_sim import Sim
from fixtures import PAGES, POSTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THEME = open(os.path.join(ROOT, 'dist/theme.xml'), encoding='utf-8').read()
SITE = json.load(open(os.path.join(ROOT, 'src/site.json'), encoding='utf-8'))
fails = []


def check(name, ok, detail=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' — ' + detail if detail and not ok else ''))
    if not ok:
        fails.append(name)


# 1) بنية بلوجر
for needle, name in [("b:version='2'", 'b:version=2'), ("<b:skin>", 'b:skin'), ("type='Blog'", 'ودجة Blog'), ("<b:includable id='main'", 'includable main'),
                     ("expr:dir='data:blog.languageDirection'", 'اتجاه RTL من بلوجر'), ("name='viewport'", 'viewport'), ("name='all-head-content'", 'all-head-content'),
                     ("id='main' maxwidgets='1'", 'section main'), ("class='skip'", 'رابط تجاوز المحتوى')]:
    check('بنية: ' + name, needle in THEME)
check('بلا سكربتات خارجية', not re.search(r"<script[^>]+src=", THEME))
check('بلا أسرار/مفاتيح', not re.search(r'(AIza|sk-[A-Za-z0-9]{20}|ca-pub-|api[_-]?key\s*[=:])', THEME, re.I))
check('الحجم < 300KB (حدّ داخلي تحفظي، غير رسمي)', len(THEME.encode()) < 300000, str(len(THEME.encode())))

# 2) التصيير لكل نوع صفحة
sim = Sim(THEME)
rendered = {}
for key, fn in PAGES.items():
    h = sim.html(fn())
    rendered[key] = h
    check(f'[{key}] لا بقايا وسوم بلوجر', not re.search(r'<(b|data):|data:[a-z]|expr:|\{\{', h))
    check(f'[{key}] lang=ar dir=rtl', 'lang="ar" dir="rtl"' in h)
    check(f'[{key}] h1 واحد بالضبط', h.count('<h1') == 1, str(h.count('<h1')))
    check(f'[{key}] نموذج بحث', ('action="/search"' in h and 'name="q"' in h) or key in ('item', 'static'))
h = rendered['home']
check('الرئيسية: كل أقسام المعرفة الثمانية', all(n in h for n, _ in SITE['topics']))
check('الرئيسية: الألعاب الخمس لها حاوية لعب حقيقية', all(f"data-game=\"{g[0]}\"" in h for g in SITE['games']) and 'قيد التنفيذ' not in h)
games_html = h.split('id="games"')[1].split('id="topics"')[0]
check('الألعاب: لا زر/رابط لصفحة غير منشورة', all(f'/p/game-{g[0]}.html' in SITE.get('published', []) or f'/p/game-{g[0]}.html' not in games_html for g in SITE['games']))
check('الألعاب: لكل لعبة مستوى صعوبة وأيقونة', games_html.count('class="tab"') == 5 and games_html.count('class="pane p-') == 5 and all(l in games_html for l in ('سهل', 'متوسط', 'صعب')))
check('الرئيسية: الأقسام بالترتيب المطلوب', [h.find(x) for x in ('class="hero"', 'id="games"', 'id="topics"', 'id="latest"', 'id="progress"')] == sorted(h.find(x) for x in ('class="hero"', 'id="games"', 'id="topics"', 'id="latest"', 'id="progress"')))
check('الرئيسية: مقال مميز واحد وبقية المقالات في القائمة', h.count('class="feat"') == 1 and h.count('class="rl"') == len(POSTS) - 1 and 'مقال مميز' in h)
check('الرأس: بحث وحساب وقائمة جانبية', 'class="sdrop"' in h and 'aria-label="الحساب والتقدم"' in h and 'class="drawer"' in h)
check('الهيرو: زرّان (استكشف + ابدأ اللعب) وعنصر بصري', 'href="#topics"' in h and 'href="#games"' in h and 'id="live"' in h and h.count("class=\"lo\"") == 4)
check('الرئيسية: المقالات الأربعة', all(p['title'] in h for p in POSTS))
check('البحث: noindex', 'noindex' in rendered['search'] and 'noindex' in rendered['error'] and 'noindex' not in rendered['home'])
check('الاسم: عنصر نائب غير نهائي من site.json', SITE['name'] in h)

# 3) الروابط الداخلية
class L(HTMLParser):
    def __init__(s): super().__init__(); s.hrefs = []
    def handle_starttag(s, t, a):
        d = dict(a)
        if t == 'a' and d.get('href'): s.hrefs.append(d['href'])
        if t == 'form' and d.get('action'): s.hrefs.append(d['action'])
known = {'/search', '/search?max-results=24', '/search?updated-max=x'} | {p['url'] for p in POSTS} | set(SITE.get('published', []))
bad, pend = set(), set()
from urllib.parse import unquote
for key, hh in rendered.items():
    p = L(); p.feed(hh)
    for href in p.hrefs:
        if href.startswith('#') or href.startswith('/#') or href.startswith('http'): continue
        u = unquote(href)
        if u.startswith('/search/label/') and u.split('/search/label/')[1] in [t for t, _ in SITE['topics']] + ['اللغة والأدب']: continue
        if u in SITE.get('published', []): continue
        if u.startswith('/p/'): bad.add(u); continue
        if u not in known and href not in ('', '/'): bad.add(href)
check('الروابط الداخلية كلها معروفة', not bad, str(bad))

# المراسي
home_ids = set(re.findall(r'id="([^"]+)"', h))
p = L(); p.feed(h)
check('المراسي كلها لها أهداف', all(a in home_ids for a in re.findall(r'href="#([^"]+)"', h)) and all(a in home_ids for a in re.findall(r'href="/?#([a-z]+)"', h)), str(set(re.findall(r'href="#([^"]+)"', h)) - home_ids))

# 4) تباين الألوان (WCAG)
def lum(hexc):
    r, g, b = [int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    f = lambda c: c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)
def ratio(a, b):
    x, y = sorted((lum(a), lum(b)), reverse=True); return (x + .05) / (y + .05)
css = open(os.path.join(ROOT, 'src/style.css'), encoding='utf-8').read()
light = dict(re.findall(r'--([\w-]+):(#[0-9a-f]{6})', css.split('html[data-theme=dark]')[0]))
dark = dict(re.findall(r'--([\w-]+):(#[0-9a-f]{6})', css.split('html[data-theme=dark]')[1].split('}')[0]))
for mode, t in (('فاتح', light), ('داكن', dark)):
    for fg, bg in (('ink', 'paper'), ('soft', 'paper'), ('faint', 'paper'), ('accent', 'paper'), ('accent-ink', 'accent'), ('soft', 'card'), ('warn', 'paper'), ('play', 'paper'), ('play-ink', 'play'), ('ok', 'ok-bg'), ('bad', 'bad-bg'), ('accent', 'accent-bg'), ('play', 'play-bg'), ('ink', 'play-bg'), ('soft', 'play-bg'), ('faint', 'card'), ('deep-ink', 'deep'), ('deep-soft', 'deep'), ('deep-ink', 'deep-rule'), ('play-on-deep', 'deep')):
        r = ratio(t[fg], t[bg]); check(f'تباين {mode} {fg}/{bg} ≥ 4.5', r >= 4.5, f'{r:.2f}')

print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS')
sys.exit(1 if fails else 0)
