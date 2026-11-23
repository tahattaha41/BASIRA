#!/usr/bin/env python3
"""يبني dist/ من src/ و content/. لا أسرار هنا. المخرجات: theme.xml وpages وarticles، ومعاينة محلية في preview/."""
import html, json, os, re
from urllib.parse import quote
from xml.dom import minidom

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST, PREV = (os.path.join(ROOT, d) for d in ('src', 'dist', 'preview'))
e = html.escape
PAGE_TITLES = {'about': 'من نحن', 'how-we-verify': 'كيف نتحقق', 'how-we-verify-en': 'How we verify', 'editorial-policy': 'سياسة التحرير', 'contact': 'اتصل بنا',
               'privacy-policy': 'سياسة الخصوصية', 'terms': 'شروط الاستخدام'}


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


def home(site, ar):
    pills = ''.join(f"<button aria-pressed='false' data-g='{g[0]}' data-i='g.{g[0]}.name' type='button'>{e(ar[f'g.{g[0]}.name'])}</button>" for g in site['games'])
    icon_ids = ['science', 'history', 'geography', 'technology', 'culture', 'logic', 'language', 'space']
    topics = ''.join(f"<li><a href='/search/label/{quote(n)}'><svg class='topic-icon' aria-hidden='true' viewBox='0 0 48 48'><use href='#topic-{icon_ids[i]}'></use></svg><b data-i='t.{e(n)}'>{e(ar['t.' + n])}</b><span>{e(d)}</span></a></li>" for i, (n, d) in enumerate(site['topics']))
    icons = read('brand/topic-icons.svg', ROOT)
    verify_url = site.get('published_urls', {}).get('how-we-verify', '')
    verify = ("<section class='sec'><div class='wrap'><div class='verify'><div><h2 data-i='verify.title'>%s</h2><p data-i='verify.text'>%s</p></div>"
              "<a class='btn alt' data-i='verify.link' href='%s'>%s</a></div></div></section>"
              % (e(ar['verify.title']), e(ar['verify.text']), e(verify_url), e(ar['verify.link']))) if verify_url else ''
    return f"""{icons}
<section class='hero'><div class='wrap'>
<p class='eyebrow' data-i='hero.eyebrow'>{e(ar['hero.eyebrow'])}</p>
<h1 data-i='hero.title'>{e(ar['hero.title'])}</h1>
<p class='lede' data-i='hero.lede'>{e(ar['hero.lede'])}</p>
<div class='cta'><a class='btn' data-i='hero.cta' href='#play'>{e(ar['hero.cta'])}</a><a class='btn alt' data-i='hero.cta2' href='#topics'>{e(ar['hero.cta2'])}</a></div>
</div></section>
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
    foot_a = ''.join(f"<li><a href='{e(page_urls[k])}'>{e(label)}</a></li>" for k, label in page_keys if page_urls.get(k)) or f"<li data-i='foot.pending'>{e(ar['foot.pending'])}</li>"
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
        write(os.path.join(DIST, 'pages', slug + '.html'), read(source).replace('{{EMAIL}}', mail))
    idx = json.loads(read('content/articles/index.json', ROOT))
    for a in idx['articles']:
        body = read('content/articles/' + a['file'], ROOT)
        srcs = ''.join(f"<li><a href='{e(x['url'])}' rel='noopener'>{e(x['title'])}</a></li>" for x in a['sources'])
        write(os.path.join(DIST, 'articles', a['file']), body + f"<h2>المصادر</h2><ul>{srcs}</ul><p class='note'>آخر مراجعة للمصادر: {e(a['checked'])}.</p>")
    pv = t
    # Keep the local Playwright preview self-contained; Blogger uses the remote main-branch assets.
    pv = pv.replace('https://raw.githubusercontent.com/tahattaha41/BASIRA/main/dist/basira.css', '../dist/basira.css')
    pv = pv.replace('https://raw.githubusercontent.com/tahattaha41/BASIRA/main/dist/basira.js', '../dist/basira.js')
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
