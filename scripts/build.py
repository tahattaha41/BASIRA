#!/usr/bin/env python3
"""يبني dist/theme.xml (قالب بلوجر) من src/. الأسرار غير مسموحة هنا."""
import html, json, os, sys
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
    games = ''.join(f"<li><div><b>{e(n)}</b><span>{e(d)}</span></div></li>" for n, d in site['games'])
    foot = ''.join(f"<li><a href='/search/label/{quote(n)}'>{e(n)}</a></li>" for n, d in site['topics'])
    css, js = read('style.css'), read('js/site.js')
    for name, txt in (('css', css), ('js', js)):
        assert ']]>' not in txt, name + ' contains CDATA terminator'
    t = read('theme.tpl.xml')
    rep = {'{{CSS}}': css, '{{JS}}': js,
           '{{HOME}}': read('sections/home.xml').replace('{{TOPICS}}', topics).replace('{{GAMES}}', games),
           '{{ITEM}}': read('sections/item.xml'), '{{STATIC}}': read('sections/static.xml'),
           '{{LISTING}}': read('sections/listing.xml'), '{{ERROR}}': read('sections/error.xml'),
           '{{FOOT_TOPICS}}': foot, '{{SITE}}': e(site['name'])}
    for k, v in rep.items():
        t = t.replace(k, v)
    assert '{{' not in t, 'placeholder left'
    minidom.parseString(t.encode('utf-8'))  # يفشل إن لم يكن XML سليماً
    out = os.path.join(DIST, 'theme.xml')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(t)
    return out, len(t.encode())


if __name__ == '__main__':
    p, n = build()
    print(f'built {p} ({n} bytes)')
