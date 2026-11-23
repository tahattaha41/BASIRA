#!/usr/bin/env python3
"""يبني dist/ من src/ و content/. لا أسرار هنا. المخرجات: theme.xml وpages وarticles، ومعاينة محلية في preview/."""
import html, json, os, re
from urllib.parse import quote
from xml.dom import minidom

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST, PREV = (os.path.join(ROOT, d) for d in ('src', 'dist', 'preview'))
e = html.escape
PAGE_TITLES = {'about': 'من نحن', 'editorial-policy': 'سياسة التحرير', 'contact': 'اتصل بنا',
               'privacy-policy': 'سياسة الخصوصية', 'terms': 'شروط الاستخدام'}


def read(p, base=SRC):
    with open(os.path.join(base, p), encoding='utf-8') as f:
        return f.read()


def write(path, txt):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt)


def logo():
    svg = read('brand/basira-symbol.svg', ROOT)
    return re.sub(r'<\?xml[^>]*\?>\s*', '', svg).strip()


def home(site):
    pills = ''.join(f"<button aria-pressed='false' data-g='{g[0]}' type='button'>{e(g[1])}</button>" for g in site['games'])
    topics = ''.join(f"<li><a href='/search/label/{quote(n)}'><b>{e(n)}</b><span>{e(d)}</span></a></li>" for n, d in site['topics'])
    return f"""<section class='hero'><div class='wrap'>
<p class='eyebrow'>Think. Discover. Play. · فكّر. اكتشف. العب.</p>
<h1>اعرف أكثر، ثم تحدَّ نفسك</h1>
<p class='lede'>معلومات موثّقة بالمصادر وألعاب أسئلة بالعربية. تلعب فوراً بلا تسجيل، وتُحفظ نتائجك على جهازك فقط.</p>
<div class='cta'><a class='btn' href='#play'>{e(site['play_label'])}</a><a class='btn alt' href='#topics'>تصفّح المعرفة</a></div>
</div></section>
<section class='sec' id='play'><div class='wrap'><h2>الألعاب</h2>
<div class='picker' id='picker'>{pills}</div>
<div class='bsr-game' id='play-host'><noscript>تحتاج الألعاب إلى تفعيل JavaScript.</noscript></div>
</div></section>
<section class='sec' id='topics'><div class='wrap'><h2>أقسام المعرفة</h2><ul class='topics'>{topics}</ul></div></section>"""


def game_page(site, slug):
    g = next(x for x in site['games'] if x[0] == slug)
    return (f"<p>{e(g[2])}. تعمل اللعبة على جهازك بلا تسجيل، وأسئلتها مراجَعة ومخزّنة مسبقاً.</p>\n"
            f"<div class='bsr-game' data-game='{slug}'><noscript>تحتاج اللعبة إلى تفعيل JavaScript.</noscript></div>\n")


def build():
    site = json.loads(read('site.json'))
    pub = site.get('published', [])
    css, lg = read('app.css'), logo()
    bank = json.dumps(json.loads(read('data/bank.json')), ensure_ascii=False, separators=(',', ':'))
    meta = json.dumps([g[:4] for g in site['games']], ensure_ascii=False, separators=(',', ':'))
    js = read('app.js').replace('{{BANK_JSON}}', bank).replace('{{GAMES_META}}', meta)
    for n, t in (('css', css), ('js', js)):
        assert ']]>' not in t, n + ' contains CDATA terminator'
    foot_t = ''.join(f"<li><a href='/search/label/{quote(n)}'>{e(n)}</a></li>" for n, _ in site['topics'])
    about = [('/p/about.html', 'من نحن'), ('/p/editorial-policy.html', 'سياسة التحرير'), ('/p/contact.html', 'اتصل بنا'),
             ('/p/privacy-policy.html', 'سياسة الخصوصية'), ('/p/terms.html', 'شروط الاستخدام')]
    foot_a = ''.join(f"<li><a href='{p}'>{e(t)}</a></li>" for p, t in about if p in pub) or '<li>الصفحات التعريفية قيد الإعداد</li>'
    t = read('theme.tpl.xml')
    for k, v in {'{{CSS}}': css, '{{JS}}': js, '{{LOGO}}': lg, '{{HOME}}': home(site),
                 '{{FOOT_TOPICS}}': foot_t, '{{FOOT_ABOUT}}': foot_a}.items():
        t = t.replace(k, v)
    assert '{{' not in t, 'placeholder left'
    minidom.parseString(t.encode('utf-8'))
    write(os.path.join(DIST, 'theme.xml'), t)
    mail = site.get('contact_email') or '[يُضاف البريد قبل النشر]'
    for g in site['games']:
        write(os.path.join(DIST, 'pages', f'game-{g[0]}.html'), game_page(site, g[0]))
    for slug in PAGE_TITLES:
        write(os.path.join(DIST, 'pages', slug + '.html'), read(f'pages/{slug}.html').replace('{{EMAIL}}', mail))
    idx = json.loads(read('content/articles/index.json', ROOT))
    for a in idx['articles']:
        body = read('content/articles/' + a['file'], ROOT)
        srcs = ''.join(f"<li><a href='{e(x['url'])}' rel='noopener'>{e(x['title'])}</a></li>" for x in a['sources'])
        write(os.path.join(DIST, 'articles', a['file']),
              body + f"<h2>المصادر</h2><ul>{srcs}</ul><p class='note'>آخر مراجعة للمصادر: {e(a['checked'])}.</p>")
    # معاينة محلية للاختبار فقط (ليست قالب بلوجر): نفس CSS وJS ونفس HTML للصفحة الرئيسية
    shell = (f"<!doctype html><html lang='ar' dir='rtl'><head><meta charset='utf-8'><title>preview</title><style>{css}</style></head><body>"
             f"<header class='top'><div class='wrap bar'><a class='brand'>{lg}<span>BASIRA | بصيرة</span></a></div></header>{home(site)}"
             f"<div class='wrap'><h2>صفحات الألعاب</h2>" +
             ''.join(f"<div data-slug='{g[0]}'>{game_page(site, g[0])}</div>" for g in site['games']) +
             f"<button class='js-theme' type='button'></button></div><script>{js}</script></body></html>")
    write(os.path.join(PREV, 'index.html'), shell)
    return os.path.join(DIST, 'theme.xml'), len(t.encode())


if __name__ == '__main__':
    p, n = build()
    print(f'built {p} ({n} bytes)')
