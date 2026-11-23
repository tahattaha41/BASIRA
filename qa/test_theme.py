#!/usr/bin/env python3
"""اختبار بنية القالب (بدون Blogger الحقيقي): XML سليم، العناصر الإلزامية، لا مراجع قديمة."""
import re, sys
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT = Path(__file__).resolve().parents[1]
t = (ROOT / 'dist/theme.xml').read_text(encoding='utf-8')
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
ET.fromstring(t.split('\n', 1)[1].replace('<!DOCTYPE html>', ''))
check(True, 'XML well-formed')
check("b:version='2'" in t, "b:version='2'")
check(len(re.findall(r"<b:section\b", t)) == 1, 'exactly one section (main)')
check(len(re.findall(r"type='Blog'", t)) == 1, 'exactly one Blog widget')
check("id='Blog1'" in t and "visible='true'" in t, 'Blog1 visible')
check("<b:includable id='main'" in t, 'Blog widget has main includable')
check("<b:include data='blog' name='all-head-content'/>" in t, 'all-head-content included')
check('<b:skin>' in t and '</b:skin>' in t, 'b:skin present')
check(t.count('<b:if') == t.count('</b:if>'), 'b:if balanced')
check(t.count('<b:loop') == t.count('</b:loop>'), 'b:loop balanced')
check('<data:post.body/>' in t and '<data:post.title/>' in t, 'post title/body rendered')
check("data:view.isHomepage" in t and "== data:blog.homepageUrl" not in t, 'homepage detection uses data:view.isHomepage (not url equality)')
check('<data:post.date/>' in t and 'data:view.isSingleItem' in t, 'post date and single-item switch present')
check("name='q'" in t and "action='/search'" in t, 'header search form posts to /search')
check('js-lang' in t, 'language switcher present')
check('Created by Taha Omar' in t and 'إنشاء وتطوير: طه عمر' in t, 'owner credit present in footer')
check('https://www.blogger.com/' in t and 'admin-entry' in t, 'secure Blogger administration entry is linked')
home = t.index('data:view.isHomepage\'>\n'); widget = t.index("<b:widget")
check(home < widget and 'id=\'play-host\'' in t.split('<b:widget')[0], 'home (games) is static, not inside the Blog widget')
for bad in ('ads'+'bygoogle', 'ca-'+'pub-', 'page'+'ad2', 'BA'+'YAN'):
    check(bad not in t, f'no {bad}')
check(not re.search(r'(?<![\u0600-\u06FF])بيان(?![\u0600-\u06FF])', t), 'no old project name')
check(len(t.encode()) < 500_000, 'theme under 500KB')
check("property='og:title'" in t and "property='og:description'" in t and "property='og:url'" in t, 'Open Graph title/description/url present')
check('twitter:card' in t and "name='theme-color'" in t, 'Twitter card and theme color present')
check('"@type":"Article"' in t and 'data:blog.canonicalUrl' in t, 'Article JSON-LD uses Blogger page data')
check("rel='manifest'" in t and 'application/manifest+json' in t, 'lightweight web manifest present')
check('id="topic-science"' in t and 'topic-icon' in t, 'original topic SVG icons embedded')
check("https://cdn.jsdelivr.net/gh/tahattaha41/BASIRA@main/dist/basira.css" in t, 'theme loads CSS from jsDelivr with CSS MIME type')
check("https://cdn.jsdelivr.net/gh/tahattaha41/BASIRA@main/dist/basira.js" in t, 'theme loads game engine from jsDelivr')
check((ROOT / 'dist/basira.css').is_file() and (ROOT / 'dist/basira.js').is_file(), 'remote CSS and JS assets are built')
sys.exit(1 if fails else 0)
