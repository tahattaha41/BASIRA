#!/usr/bin/env python3
"""اختبار مسار النشر بدون شبكة: لا اتصال حقيقياً ببلوجر."""
import os, sys, io, contextlib
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'scripts'))
import blogger_pages as bp
fails = []
def check(n, ok, d=''):
    print(('PASS ' if ok else 'FAIL ') + n + (' — ' + str(d) if not ok else ''))
    if not ok: fails.append(n)
calls = []
def fake(method, url, token=None, body=None, form=None):
    calls.append((method, url, body))
    if 'token' in url: return {'access_token': 'T'}
    if method == 'GET': return {'items': [{'id': '9', 'title': 'من نحن', 'url': 'https://x/p/about.html'}]}
    return {'url': 'https://x/p/new.html'}
def quiet(**kw):
    with contextlib.redirect_stdout(io.StringIO()) as o: rc = bp.run(_http=fake, **kw)
    return rc, o.getvalue()
for k in ('BLOGGER_BLOG_ID', 'BLOGGER_CLIENT_ID', 'BLOGGER_CLIENT_SECRET', 'BLOGGER_REFRESH_TOKEN', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'): os.environ.pop(k, None)
rc, _ = quiet(mode='plan'); check('plan: لا اتصال', rc == 0 and not calls)
rc, _ = quiet(mode='apply'); check('apply بلا --confirm مرفوض', rc == 2 and not calls)
rc, _ = quiet(mode='apply', confirm=True); check('apply بلا أسرار مرفوض', rc == 2 and not calls)
os.environ.update(BLOGGER_BLOG_ID='1', BLOGGER_CLIENT_ID='a', BLOGGER_CLIENT_SECRET='b', BLOGGER_REFRESH_TOKEN='c')
rc, out = quiet(mode='apply', confirm=True)
posts = [c for c in calls if c[0] == 'POST' and 'pages' in c[1]]
check('apply: ينشئ المفقود فقط (5: مع اتصل بنا لأن البريد موجود، بلا ألعاب) ويتخطى الموجود', rc == 0 and len(posts) == 5 and '[skip] about' in out and '[created] contact' in out, (len(posts), out[:300]))
check('apply: لا PATCH ولا DELETE بدون --update', not any(c[0] in ('PATCH', 'DELETE') for c in calls))
check('لا يستدعي أي مسار للقوالب', not any('theme' in c[1].lower() or 'template' in c[1].lower() for c in calls))
calls.clear(); quiet(mode='apply', confirm=True, update=True)
check('--update يستعمل PATCH للموجود', sum(1 for c in calls if c[0] == 'PATCH') == 1 and not any(c[0] == 'DELETE' for c in calls))

import blogger_posts as bq
calls2 = []
def fake2(method, url, token=None, body=None, form=None):
    calls2.append((method, url, body))
    if 'oauth2' in url: return {'access_token': 't'}
    if method == 'GET': return {'items': [{'id': '9', 'title': 'جسور كونيغسبرغ السبعة: لماذا لا حل لها؟'}]}
    return {'url': 'https://x/p.html'}
with contextlib.redirect_stdout(io.StringIO()) as o2: rc2 = bq.run('apply', True, False, _http=fake2, _sleep=lambda d: None)
pp = [c for c in calls2 if c[0] == 'POST' and 'posts' in c[1]]
check('posts: ينشئ 7 ويتخطى الموجود (8 مقالات، واحد موجود)', rc2 == 0 and len(pp) == 7, len(pp))
check('posts: كل منشور له تصنيف ومحتوى طويل', all(c[2]['labels'] and len(c[2]['content']) > 3000 for c in pp))
check('posts: لا PATCH ولا DELETE بدون --update', not any(c[0] in ('PATCH', 'DELETE') for c in calls2))

import urllib.error
n429 = [0]
def fake3(method, url, token=None, body=None, form=None):
    if 'oauth2' in url and n429[0] < 2:
        n429[0] += 1; raise urllib.error.HTTPError(url, 429, 'Too Many', {}, None)
    return fake2(method, url, token, body, form)
waits = []
with contextlib.redirect_stdout(io.StringIO()): rc3 = bq.run('apply', True, False, _http=fake3, _sleep=waits.append)
check('posts: يعيد المحاولة عند 429 ثم ينجح', rc3 == 0 and n429[0] == 2 and len(waits) == 2 and waits[1] > waits[0], (rc3, waits))
def fake4(method, url, token=None, body=None, form=None): raise urllib.error.HTTPError(url, 403, 'No', {}, None)
try: bq.run('apply', True, False, _http=fake4, _sleep=lambda d: None); ok4 = False
except urllib.error.HTTPError: ok4 = True
check('posts: لا يعيد المحاولة عند 403', ok4)

print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
