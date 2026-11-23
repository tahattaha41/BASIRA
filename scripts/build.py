#!/usr/bin/env python3
"""يبني dist/ من src/ و content/. لا أسرار هنا. المخرجات: theme.xml وpages وarticles، ومعاينة محلية في preview/."""
import html, json, os, re
from urllib.parse import quote
from xml.dom import minidom

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST, PREV = (os.path.join(ROOT, d) for d in ('src', 'dist', 'preview'))
e = html.escape
PAGE_TITLES = {'about': 'من نحن', 'how-we-verify': 'كيف نتحقق', 'editorial-policy': 'سياسة التحرير', 'contact': 'اتصل بنا', 'privacy-policy': 'سياسة الخصوصية', 'terms': 'شروط الاستخدام'}


def read(p, base=SRC):
    with open(os.path.join(base, p), encoding='utf-8') as f:
        return f.read()


def write(path, txt):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt)


def i18n():
    return {l: json.loads(read(f'i18n/{l}.json')) for l in ('ar', 'en')}


def fill_ar(text, ar):
    import re as _re
    return _re.sub(r'\{\{ar:([^}]+)\}\}', lambda m: e(ar[m.group(1)]), text)


def logo():
    svg = read('brand/basira-symbol.svg', ROOT)
    return re.sub(r'<\?xml[^>]*\?>\s*', '', svg).strip()


GAME_ART = {
 'mcq': "<svg viewBox='0 0 120 84' aria-hidden='true'><rect x='10' y='8' width='100' height='16' rx='8' class='a0'/><rect x='10' y='30' width='100' height='16' rx='8' class='a1 pulse'/><path d='M22 38.5l5 5 9-10' class='ck'/><rect x='10' y='52' width='100' height='16' rx='8' class='a0'/><rect x='10' y='74' width='60' height='6' rx='3' class='a2'/></svg>",
 'truefalse': "<svg viewBox='0 0 120 84' aria-hidden='true'><rect x='8' y='10' width='50' height='64' rx='14' class='a1'/><rect x='62' y='10' width='50' height='64' rx='14' class='a0'/><path d='M22 42l9 9 15-18' class='ck'/><path d='M78 32l20 20M98 32L78 52' class='cx'/></svg>",
 'order': "<svg viewBox='0 0 120 84' aria-hidden='true'><g class='stk'><rect x='14' y='8' width='92' height='20' rx='8' class='a0'/><rect x='14' y='32' width='92' height='20' rx='8' class='a1'/><rect x='14' y='56' width='92' height='20' rx='8' class='a0'/></g><circle cx='30' cy='18' r='7' class='a2'/><circle cx='30' cy='42' r='7' class='a2'/><circle cx='30' cy='66' r='7' class='a2'/><path d='M62 18h30M62 42h22M62 66h36' class='ln'/></svg>",
 'memory': "<svg viewBox='0 0 120 84' aria-hidden='true'><rect x='8' y='8' width='32' height='32' rx='9' class='a1 flip1'/><rect x='44' y='8' width='32' height='32' rx='9' class='a0'/><rect x='80' y='8' width='32' height='32' rx='9' class='a0'/><rect x='8' y='44' width='32' height='32' rx='9' class='a0'/><rect x='44' y='44' width='32' height='32' rx='9' class='a0'/><rect x='80' y='44' width='32' height='32' rx='9' class='a1 flip2'/><path d='M24 15l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z' class='st'/><path d='M96 51l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z' class='st'/></svg>",
 'word': "<svg viewBox='0 0 120 84' aria-hidden='true'><rect x='6' y='22' width='24' height='32' rx='8' class='a0'/><rect x='34' y='22' width='24' height='32' rx='8' class='a1 pulse'/><rect x='62' y='22' width='24' height='32' rx='8' class='a0'/><rect x='90' y='22' width='24' height='32' rx='8' class='a0'/><text x='46' y='46' text-anchor='middle' class='tx'>ب</text><path d='M10 66h16M66 66h16M94 66h16' class='ln'/><circle cx='98' cy='12' r='5' class='a2 pulse'/></svg>",
}
HERO_ART = ("<svg class='hero-art' viewBox='0 0 380 340' aria-hidden='true' focusable='false'>"
 "<circle cx='190' cy='170' r='150' class='ring r1'/><circle cx='190' cy='170' r='112' class='ring r2'/>"
 "<g class='orbit'><circle cx='190' cy='20' r='7' class='dot'/><circle cx='340' cy='170' r='5' class='dot d2'/><circle cx='60' cy='260' r='6' class='dot'/></g>"
 "<path d='M70 170c34-52 82-78 120-78s86 26 120 78c-34 52-82 78-120 78S104 222 70 170z' class='eye'/>"
 "<circle cx='190' cy='170' r='50' class='iris'/><circle cx='190' cy='170' r='22' class='pupil'/><circle cx='202' cy='158' r='8' class='glint'/>"
 "<g class='tile t1'><rect x='28' y='54' width='58' height='58' rx='16'/><text x='57' y='96' text-anchor='middle'>؟</text></g>"
 "<g class='tile t2'><rect x='294' y='38' width='58' height='58' rx='16'/><path d='M310 68l11 11 20-24' class='ck'/></g>"
 "<g class='tile t3'><rect x='300' y='234' width='58' height='58' rx='16'/><text x='329' y='275' text-anchor='middle'>٣</text></g>"
 "<g class='tile t4'><rect x='22' y='226' width='58' height='58' rx='16'/><path d='M51 240l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z' class='st'/></g>"
 "</svg>")


def home(site, ar):
    pills = ''.join(f"<button aria-pressed='false' class='gcard' data-g='{g[0]}' type='button'><span class='gart'>{GAME_ART[g[0]]}</span><b data-i='g.{g[0]}.name'>{e(ar[f'g.{g[0]}.name'])}</b><small data-i='g.{g[0]}.desc'>{e(ar[f'g.{g[0]}.desc'])}</small><span class='gplay' data-i='card.play'>{e(ar['card.play'])}</span></button>" for g in site['games'])
    icon_ids = ['science', 'history', 'geography', 'technology', 'culture', 'logic', 'language', 'space']
    topics = ''.join(f"<li><a href='/search/label/{quote(n)}'><svg class='topic-icon' aria-hidden='true' viewBox='0 0 48 48'><use href='#topic-{icon_ids[i]}'></use></svg><b data-i='t.{e(n)}'>{e(ar['t.' + n])}</b><span>{e(d)}</span></a></li>" for i, (n, d) in enumerate(site['topics']))
    icons = read('brand/topic-icons.svg', ROOT)
    verify_url = site.get('published_urls', {}).get('how-we-verify', '')
    verify = ("<section class='sec'><div class='wrap'><div class='verify'><div><h2 data-i='verify.title'>%s</h2><p data-i='verify.text'>%s</p></div>"
              "<a class='btn alt' data-i='verify.link' href='%s'>%s</a></div></div></section>"
              % (e(ar['verify.title']), e(ar['verify.text']), e(verify_url), e(ar['verify.link']))) if verify_url else ''
    return f"""{icons}
<section class='hero'><div class='wrap hero-grid'><div class='hero-txt'>
<p class='eyebrow' data-i='hero.eyebrow'>{e(ar['hero.eyebrow'])}</p>
<h1 data-i='hero.title'>{e(ar['hero.title'])}</h1>
<p class='lede' data-i='hero.lede'>{e(ar['hero.lede'])}</p>
<div class='cta'><a class='btn' data-i='hero.cta' href='#play'>{e(ar['hero.cta'])}</a><a class='btn alt' data-i='hero.cta2' href='#topics'>{e(ar['hero.cta2'])}</a></div>
<div class='pstrip' id='pstrip' aria-live='polite'></div>
</div><div class='hero-vis'>{HERO_ART}</div></div></section>
<section class='sec' id='daily'><div class='wrap'><div class='daily' id='daily-panel'><noscript>{e(ar['noscript'])}</noscript></div></div></section>
<section class='sec' id='play'><div class='wrap'><h2 data-i='games.title'>{e(ar['games.title'])}</h2>
<p class='note' data-i='lang.note' hidden='hidden' id='lang-note'>{e(ar['lang.note'])}</p>
<div class='picker' id='picker'>{pills}</div>
<div class='bsr-game' id='play-host'><noscript>{e(ar['noscript'])}</noscript></div>
</div></section>
<section class='sec' id='progress'><div class='wrap'><div class='profile' id='profile-panel'></div></div></section>
<section class='sec' id='topics'><div class='wrap'><h2 data-i='topics.title'>{e(ar['topics.title'])}</h2><ul class='topics'>{topics}</ul></div></section>
{verify}"""


def game_page(site, slug, ar):
    return (f"<p>{e(ar[f'g.{slug}.desc'])}. تعمل اللعبة على جهازك بلا تسجيل، وأسئلتها مراجَعة ومخزّنة مسبقاً.</p>\n"
            f"<div class='bsr-game' data-game='{slug}'><noscript>تحتاج اللعبة إلى تفعيل JavaScript.</noscript></div>\n")


def build():
    site = json.loads(read('site.json'))
    dic = i18n(); ar = dic['ar']
    pub = site.get('published', [])
    css, lg = read('app.css'), logo()
    bank = json.dumps(json.loads(read('data/bank.json')), ensure_ascii=False, separators=(',', ':'))
    meta = json.dumps([g[:4] for g in site['games']], ensure_ascii=False, separators=(',', ':'))
    js = read('i18n.js').replace('{{I18N_JSON}}', json.dumps(dic, ensure_ascii=False, separators=(',', ':'))) + '\n' + read('app.js').replace('{{BANK_JSON}}', bank).replace('{{GAMES_META}}', meta)
    for n, t in (('css', css), ('js', js)):
        assert ']]>' not in t, n + ' contains CDATA terminator'
    # Public main-branch assets allow an installed Blogger theme to receive CSS/game updates without re-uploading XML.
    write(os.path.join(DIST, 'basira.css'), css)
    write(os.path.join(DIST, 'basira.js'), js)
    foot_t = ''.join(f"<li><a data-i='t.{e(n)}' href='/search/label/{quote(n)}'>{e(ar['t.' + n])}</a></li>" for n, _ in site['topics'])
    about = [('/p/about.html', 'من نحن'), ('/p/how-we-verify.html', 'كيف نتحقق'), ('/p/editorial-policy.html', 'سياسة التحرير'), ('/p/contact.html', 'اتصل بنا'),
             ('/p/privacy-policy.html', 'سياسة الخصوصية'), ('/p/terms.html', 'شروط الاستخدام')]
    page_urls = site.get('published_urls', {})
    page_keys = [('about', 'من نحن'), ('how-we-verify', 'كيف نتحقق'), ('editorial-policy', 'سياسة التحرير'), ('contact', 'اتصل بنا'),
                 ('privacy-policy', 'سياسة الخصوصية'), ('terms', 'شروط الاستخدام')]
    foot_keys = {'about': 'page.about', 'how-we-verify': 'page.verify', 'editorial-policy': 'page.editorial', 'contact': 'page.contact', 'privacy-policy': 'page.privacy', 'terms': 'page.terms'}
    foot_a = ''.join(f"<li><a data-i='{foot_keys[k]}' href='{e(page_urls[k])}'>{e(ar[foot_keys[k]])}</a></li>" for k, label in page_keys if page_urls.get(k)) or f"<li data-i='foot.pending'>{e(ar['foot.pending'])}</li>"
    t = read('theme.tpl.xml')
    for k, v in {'{{CSS}}': css, '{{JS}}': js, '{{LOGO}}': lg, '{{HOME}}': home(site, ar), '{{NAV_VERIFY}}': (f"<a data-i='nav.verify' href='{e(site.get('published_urls', {}).get('how-we-verify', ''))}'>{e(ar['nav.verify'])}</a>" if site.get('published_urls', {}).get('how-we-verify') else ''),
                 '{{FOOT_TOPICS}}': foot_t, '{{FOOT_ABOUT}}': foot_a}.items():
        t = t.replace(k, v)
    t = fill_ar(t, ar)
    assert '{{' not in t, 'placeholder left'
    minidom.parseString(t.encode('utf-8'))
    write(os.path.join(DIST, 'theme.xml'), t)
    mail = site.get('contact_email') or '[يُضاف البريد قبل النشر]'
    for g in site['games']:
        write(os.path.join(DIST, 'pages', f'game-{g[0]}.html'), game_page(site, g[0], ar))
    for slug in PAGE_TITLES:
        source = f'pages/{slug}.html'
        ar_page = read(source).replace('{{EMAIL}}', mail)
        en_page = read(f'pages/en/{slug}.html').replace('{{EMAIL}}', mail)
        combined = f"<div class='lang-ar' lang='ar' dir='rtl'>{ar_page}</div><div class='lang-en' lang='en' dir='ltr'>{en_page}</div>"
        write(os.path.join(DIST, 'pages', slug + '.html'), combined)
    idx = json.loads(read('content/articles/index.json', ROOT))
    for a in idx['articles']:
        body = read('content/articles/' + a['file'], ROOT)
        srcs = ''.join(f"<li><a href='{e(x['url'])}' rel='noopener'>{e(x['title'])}</a></li>" for x in a['sources'])
        write(os.path.join(DIST, 'articles', a['file']), body + f"<h2>المصادر</h2><ul>{srcs}</ul><p class='note'>آخر مراجعة للمصادر: {e(a['checked'])}.</p>")
    pv = t
    # Keep the local Playwright preview self-contained; Blogger uses the remote main-branch assets.
    pv = re.sub(r"https://(?:raw\.githubusercontent\.com|cdn\.jsdelivr\.net/gh)/tahattaha41/BASIRA(?:/|@)main/dist/basira\.(css|js)", r"../dist/basira.\1", pv)
    pv = re.sub(r"<\?xml[^>]*\?>\s*<!DOCTYPE html>", "<!doctype html>", pv)
    pv = re.sub(r"<b:section.*?</b:section>", "<div class='wrap content'><article class='post'><h2>sample</h2></article></div>", pv, flags=re.S)
    pv = re.sub(r"</?b:if[^>]*>", "", pv)
    pv = re.sub(r"<b:include[^>]*/>", "", pv)
    pv = pv.replace("<b:skin><![CDATA[", "<style>").replace("]]></b:skin>", "</style>")
    pv = re.sub(r"\sexpr:\w+='[^']*'", "", pv)
    pv = re.sub(r"<data:[^>]*/>", "", pv)
    pv = re.sub(r"\sxmlns[:\w]*='[^']*'", "", pv).replace(" b:version='2'", "")
    pv = pv.replace("<head>", "<head><meta charset='utf-8'>", 1)
    games_div = "<div class='wrap'><h2>game pages</h2>" + ''.join(f"<div data-slug='{g[0]}'>{game_page(site, g[0], ar)}</div>" for g in site['games']) + "</div>"
    pv = pv.replace("<footer", games_div + "<footer", 1)
    write(os.path.join(PREV, 'index.html'), pv)
    return os.path.join(DIST, 'theme.xml'), len(t.encode())


if __name__ == '__main__':
    p, n = build()
    print(f'built {p} ({n} bytes)')
