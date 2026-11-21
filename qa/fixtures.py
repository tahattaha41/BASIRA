"""بيانات معاينة للمحاكي فقط. ليست محتوى منشوراً ولا معلومات للاعتماد عليها."""
POSTS = [
    dict(title='لماذا يبدو القمر أكبر قرب الأفق؟', url='/2026/11/moon-illusion.html', labels=['العلوم'], ts='12 نوفمبر 2026', iso='2026-11-12T09:00:00+02:00', snippet='نموذج معاينة لمقال علمي: تفسير الوهم البصري وكيف يمكن اختباره بنفسك.', author='فريق التحرير', body='<p>نص المعاينة.</p><h2>عنوان فرعي</h2><p>فقرة أخرى.</p>'),
    dict(title='كيف نُقلت الأبجدية عبر الحضارات القديمة', url='/2026/11/alphabet.html', labels=['التاريخ والحضارات', 'اللغة والأدب'], ts='10 نوفمبر 2026', iso='2026-11-10T09:00:00+02:00', snippet='نموذج معاينة: رحلة الحروف من النقوش الأولى إلى الخط العربي.', author='فريق التحرير', body='<p>نص المعاينة.</p>'),
    dict(title='أطول الأنهار في العالم وكيف يُقاس الطول', url='/2026/11/rivers.html', labels=['الجغرافيا والدول'], ts='8 نوفمبر 2026', iso='2026-11-08T09:00:00+02:00', snippet='نموذج معاينة: لماذا تختلف الأرقام بين المصادر.', author='فريق التحرير', body='<p>نص المعاينة.</p>'),
    dict(title='لغز الجسور السبعة: لماذا لا حل له؟', url='/2026/11/bridges.html', labels=['الرياضيات والمنطق'], ts='5 نوفمبر 2026', iso='2026-11-05T09:00:00+02:00', snippet='نموذج معاينة لمقال في المنطق وخطوات البرهان.', author='فريق التحرير', body='<p>نص المعاينة.</p>'),
]
BASE = ''  # فارغ ليعمل التنقل بالمراسي محلياً
def ctx(page_type, posts=POSTS, **kw):
    blog = dict(pageType=page_type, homepageUrl=BASE, url=BASE if page_type == 'index' and not kw.get('searchQuery') and not kw.get('searchLabel') else BASE + 'x',
                pageTitle='معاينة', metaDescription='معاينة', languageDirection='rtl', searchQuery=kw.get('searchQuery', ''), searchLabel=kw.get('searchLabel', ''))
    ps = []
    for p in posts:
        ps.append(dict(title=p['title'], url=p['url'], snippet=p['snippet'], body=p['body'], timestamp=p['ts'], timestampISO8601=p['iso'],
                       author=dict(name=p['author']), labels=[dict(name=l, url='/search/label/' + l) for l in p['labels']]))
    return dict(blog=blog, posts=ps, newerPageUrl=kw.get('newer', ''), olderPageUrl=kw.get('older', '/search?updated-max=x'))
PAGES = {
    'home': lambda: ctx('index'),
    'item': lambda: ctx('item', POSTS[:1], newer='', older='/2026/11/alphabet.html'),
    'static': lambda: ctx('static_page', [dict(POSTS[0], title='من نحن', url='/p/about.html', labels=[])]),
    'label': lambda: ctx('index', searchLabel='العلوم'),
    'search': lambda: ctx('index', POSTS[:2], searchQuery='القمر'),
    'error': lambda: ctx('error_page', []),
}

import os, json
_pg = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist', 'pages')
_site = json.load(open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'site.json'), encoding='utf-8'))
for _g in _site['games']:
    _f = os.path.join(_pg, f'game-{_g[0]}.html')
    if os.path.exists(_f):
        PAGES['game-' + _g[0]] = (lambda f=_f, g=_g: ctx('static_page', [dict(POSTS[0], title=g[1], url=f'/p/game-{g[0]}.html', labels=[], body=open(f, encoding='utf-8').read())]))
