#!/usr/bin/env python3
"""يبني dist/theme.xml (قالب بلوجر) من src/. الأسرار غير مسموحة هنا."""
import html, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui
from urllib.parse import quote
from xml.dom import minidom

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST = os.path.join(ROOT, 'src'), os.path.join(ROOT, 'dist')


def read(p):
    with open(os.path.join(SRC, p), encoding='utf-8') as f:
        return f.read()


def build():
    os.makedirs(DIST, exist_ok=True)
    site = json.loads(read('site.json'))
    e = html.escape
    topics = ''.join(f"<li><a href='/search/label/{quote(n)}'><b>{e(n)}</b><span>{e(d)}</span></a></li>" for n, d in site['topics'])
    games = ui.game_cards(site)
    foot = ''.join(f"<li><a href='/search/label/{quote(n)}'>{e(n)}</a></li>" for n, d in site['topics'])
    pub = site.get('published', [])
    def plink(path, text):
        return f"<a href='{path}'>{e(text)}</a>" if path in pub else ''
    about = [('/p/about.html', 'من نحن'), ('/p/editorial-policy.html', 'سياسة التحرير'), ('/p/contact.html', 'اتصل بنا'), ('/p/privacy-policy.html', 'سياسة الخصوصية'), ('/p/terms.html', 'شروط الاستخدام')]
    foot_about = ''.join(f"<li>{plink(p_, t)}</li>" for p_, t in about if p_ in pub) or "<li>الصفحات التعريفية قيد الإعداد</li>"
    dr_about = plink('/p/about.html', 'من نحن')
    daily_btn = (f"<a class='btn play' href='/p/game-mcq.html'>{e(site['play_label'])}</a>" if '/p/game-mcq.html' in pub else "<span class='soon'>يُفعَّل مع الألعاب</span>")
    css = read('style.css') + ui.stage_css(site)
    js = read('js/site.js').replace('{{QUIZ_JSON}}', json.dumps(site['quiz'], ensure_ascii=False))
    for name, txt in (('css', css), ('js', js)):
        assert ']]>' not in txt, name + ' contains CDATA terminator'
    t = read('theme.tpl.xml')
    rep = {'{{CSS}}': css, '{{JS}}': js,
           '{{HOME}}': read('sections/home.xml').replace('{{TOPICS}}', topics).replace('{{STAGE}}', ui.stage(site)).replace('{{FAHRAS}}', ui.fahras(site)).replace('{{QUIZ_FALLBACK}}', ui.quiz_fallback(site)).replace('{{METHOD}}', ui.method_block()).replace('{{PROGRESS}}', ui.progress_block()).replace('{{THUMB}}', ui.svg('0 0 48 48', "<path d='M8 10h14a4 4 0 014 4v24a3 3 0 00-3-3H8z M40 10H26v25h12a2 2 0 002-2z' class='g-l'/>", 'glyph')),
           '{{FOOT_ABOUT}}': foot_about, '{{DR_ABOUT}}': dr_about, '{{DAILY_BTN}}': daily_btn,
           '{{I_MENU}}': ui.icon('menu'), '{{I_SEARCH}}': ui.icon('search'), '{{I_USER}}': ui.icon('user'), '{{I_CLOSE}}': ui.icon('close'),
           '{{ITEM}}': read('sections/item.xml'), '{{STATIC}}': read('sections/static.xml'),
           '{{LISTING}}': read('sections/listing.xml'), '{{ERROR}}': read('sections/error.xml'),
           '{{FOOT_TOPICS}}': foot, '{{SITE}}': e(site['name'])}
    for k, v in rep.items():
        t = t.replace(k, v)
    assert '{{' not in t, 'placeholder left'
    minidom.parseString(t.encode('utf-8'))  # يفشل إن لم يكن XML سليماً
    pg = os.path.join(DIST, 'pages'); os.makedirs(pg, exist_ok=True)
    for g in site['games']:
        with open(os.path.join(pg, f'game-{g[0]}.html'), 'w', encoding='utf-8') as f:
            f.write(ui.model_page(site, g[0]))
    titles = {'about': 'من نحن', 'editorial-policy': 'سياسة التحرير', 'contact': 'اتصل بنا', 'privacy-policy': 'سياسة الخصوصية', 'terms': 'شروط الاستخدام'}
    mail = site.get('contact_email') or '[يُضاف البريد قبل النشر]'
    for slug in titles:
        with open(os.path.join(pg, slug + '.html'), 'w', encoding='utf-8') as f:
            f.write(read(f'pages/{slug}.html').replace('{{EMAIL}}', mail))
    if not site.get('contact_email'):
        print('تحذير: contact_email فارغ في src/site.json. أضفه قبل نشر صفحة اتصل بنا.')
    out = os.path.join(DIST, 'theme.xml')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(t)
    return out, len(t.encode())


if __name__ == '__main__':
    p, n = build()
    print(f'built {p} ({n} bytes)')
