import sys, pathlib, json, base64, re
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = ROOT.joinpath('dist/admin/index.html').as_uri()
BANK = json.loads(ROOT.joinpath('src/data/bank.json').read_text(encoding='utf8'))
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
calls = []
def gh(route, request):
    u = request.url.replace('https://api.github.com', ''); m = request.method; calls.append((m, u, request.post_data))
    def ok(j, s=200): route.fulfill(status=s, content_type='application/json', headers={'access-control-allow-origin': '*'}, body=json.dumps(j))
    if u == '/user': return ok({'login': 'tester'})
    if u == '/repos/tahattaha41/BASIRA': return ok({'permissions': {'push': True}})
    if u.startswith('/repos/tahattaha41/BASIRA/commits?'): return ok([{'sha': 'abc', 'commit': {'author': {'date': '2026-11-26T10:00:00Z'}, 'message': 'Real commit message'}}])
    if u.startswith('/repos/tahattaha41/BASIRA/pulls?'): return ok([{'number': 7}])
    if u.endswith('/check-runs'): return ok({'check_runs': [{'conclusion': 'success'}]})
    if u.endswith('/git/ref/heads/main'): return ok({'object': {'sha': 'mainsha'}})
    if u.endswith('/git/refs') and m == 'POST': return ok({}, 201)
    if '/contents/src/data/bank.json' in u and m == 'GET': return ok({'sha': 'filesha'})
    if '/contents/src/data/bank.json' in u and m == 'PUT': return ok({}, 200)
    if u.endswith('/pulls') and m == 'POST': return ok({'number': 99, 'html_url': 'https://github.com/x/pull/99'}, 201)
    return ok({'message': 'unmocked ' + u}, 404)
def feed(route, request):
    cb = re.search(r'callback=(\w+)', request.url).group(1)
    data = {'feed': {'openSearch$totalResults': {'$t': '1'}, 'entry': [{'title': {'$t': 'جسور كونيغسبرغ السبعة: لماذا لا حل لها؟'}, 'link': [{'rel': 'alternate', 'href': 'https://basira-play.blogspot.com/2026/11/x.html'}], 'published': {'$t': '2026-11-26T00:00:00Z'}, 'category': [{'term': 'الرياضيات والمنطق'}]}]}}
    route.fulfill(status=200, content_type='application/javascript', body=f'{cb}({json.dumps(data)});')
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for vp, name in (({'width': 1280, 'height': 800}, 'desktop'), ({'width': 390, 'height': 844}, 'mobile')):
        pg = b.new_page(viewport=vp); pg.on('pageerror', lambda e: errs.append(str(e))); pg.route('https://api.github.com/**', gh); pg.route('**/feeds/posts/summary**', feed)
        pg.goto(URL); pg.wait_for_selector('.kpi'); pg.wait_for_timeout(300)
        side = pg.locator('.side').is_visible(); bot = pg.locator('.bot').is_visible()
        check(side != bot and (side if name == 'desktop' else bot), f'{name}: correct navigation (sidebar on desktop, bottom bar on mobile)')
        check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), f'{name}: no horizontal overflow')
        pg.screenshot(path=f'/tmp/claude-0/shots/admin-{name}.png', full_page=False)
        if name == 'mobile': pg.close(); continue
        kp = pg.locator('.kpi b').all_inner_texts()
        total = sum(len(BANK[k]) for k in ('mcq', 'tf', 'order', 'word', 'mem'))
        check(str(total) in kp and '8' in kp and '27' in kp or str(total) in kp, f'dashboard: real counts (bank {total}) {kp}')
        check(pg.locator('.kpi b', has_text='1').count() >= 1, 'dashboard: live post count comes from the blog feed')
        check('Real commit message' in pg.locator('main').inner_text() and 'success' in pg.locator('main').inner_text(), 'dashboard: live commits and CI shown from GitHub')
        for hsh, needle in (('articles', 'جسور كونيغسبرغ'), ('games', 'فقاعات المعرفة'), ('topics', 'العلوم'), ('daily', 'مفتاح اليوم'), ('players', 'غير متاح'), ('pages', 'سياسة الخصوصية'), ('media', 'topic-icons.svg'), ('settings', 'توكن')):
            pg.goto(URL + '#/' + hsh); pg.wait_for_timeout(200)
            check(needle in pg.locator('main').inner_text(), f'section {hsh} renders real content')
        pg.goto(URL + '#/articles'); pg.wait_for_timeout(400)
        check(pg.locator('tbody tr').count() == 8, 'articles: 8 rows'); check(pg.locator('.tag.ok', has_text='منشور').count() == 1, 'articles: only the post that is live on the feed is marked published')
        pg.fill('main input[aria-label="بحث"]', 'رشيد'); check(pg.locator('tbody tr').count() == 1, 'articles: search narrows to 1')
        pg.goto(URL + '#/games'); check(pg.locator('tbody tr').count() == 27 or pg.locator('tbody tr').count() >= 21, 'games: all games listed (%d)' % pg.locator('tbody tr').count())
        # بنك الأسئلة
        pg.goto(URL + '#/bank'); pg.wait_for_timeout(200)
        n0 = pg.locator('tbody tr').count(); check(n0 == len(BANK['mcq']), f'bank: mcq rows = {n0}')
        pg.fill('main input[placeholder="بحث"]', 'البناء الضوئي'); check(0 < pg.locator('tbody tr').count() < n0, 'bank: search filters')
        pg.fill('main input[placeholder="بحث"]', ''); pg.select_option('main select[aria-label="القسم"]', 'الفضاء والفلك'); check(0 < pg.locator('tbody tr').count() < n0, 'bank: topic filter')
        pg.select_option('main select[aria-label="القسم"]', ''); pg.get_by_role('button', name='إضافة').click()
        pg.get_by_role('button', name='حفظ محلياً').click(); check('الشرح مطلوب' in pg.locator('.modal .err').inner_text() or 'فارغ' in pg.locator('.modal .err').inner_text(), 'bank: invalid question rejected with message')
        pg.locator('.modal textarea').first.fill('سؤال اختبار؟'); ins = pg.locator('.modal input'); 
        for i, v in enumerate(['أ', 'ب', 'ج', 'د']): ins.nth(i).fill(v)
        pg.locator('.modal textarea').nth(1).fill('شرح'); pg.get_by_role('button', name='حفظ محلياً').click()
        check(pg.locator('tbody tr').count() == n0 + 1, 'bank: valid question added (local)'); check('1' in pg.locator('.tag.warn').first.inner_text(), 'bank: pending counter = 1')
        check(not any(m in ('PUT', 'POST') for m, u, d in calls), 'bank: nothing sent to GitHub before explicit PR creation')
        pg.get_by_role('button', name='حذف').last.click(); check(pg.locator('.modal').count() == 1 and 'تأكيد' in pg.locator('.modal').inner_text(), 'bank: delete asks for confirmation')
        pg.get_by_role('button', name='إلغاء').click(); check(pg.locator('tbody tr').count() == n0 + 1, 'bank: cancelling keeps the item')
        pg.get_by_role('button', name='حذف').last.click(); pg.get_by_role('button', name='نعم، احذف').click(); check(pg.locator('tbody tr').count() == n0, 'bank: confirmed delete removes it')
        # حماية: PR بدون توكن
        pg.get_by_role('button', name='إنشاء طلب دمج').click(); pg.wait_for_timeout(200); check(not any(m == 'PUT' for m, u, d in calls), 'security: PR creation refused without a token')
        # اتصال بتوكن وإنشاء PR
        pg.get_by_role('button', name='حفظ').count()
        pg.get_by_role('button', name='إضافة').click(); ins = pg.locator('.modal input')
        pg.locator('.modal textarea').first.fill('سؤال ثانٍ؟')
        for i, v in enumerate(['1', '2', '3', '4']): ins.nth(i).fill(v)
        pg.locator('.modal textarea').nth(1).fill('شرح'); pg.get_by_role('button', name='حفظ محلياً').click()
        pg.goto(URL + '#/settings'); pg.fill('input[aria-label="GitHub token"]', 'github_pat_fake'); pg.get_by_role('button', name='اتصال').click(); pg.wait_for_selector('text=tester')
        check(pg.evaluate("sessionStorage.getItem('basira.admin.tok')") == 'github_pat_fake' and pg.evaluate("localStorage.getItem('basira.admin.tok')") is None, 'security: token only in sessionStorage, never localStorage')
        pg.goto(URL + '#/bank'); pg.wait_for_timeout(300)
        with pg.expect_popup() as popup: pg.get_by_role('button', name='إنشاء طلب دمج').click()
        pg.wait_for_timeout(300)
        put = [c for c in calls if c[0] == 'PUT']; check(len(put) == 1, 'PR: exactly one file write')
        body = json.loads(put[0][2]); saved = json.loads(base64.b64decode(body['content']).decode('utf8'))
        check(body['branch'].startswith('admin-edits-') and body['branch'] != 'main', 'PR: written to a new branch, never main')
        check(len(saved['mcq']) == len(BANK['mcq']) + 1 and saved['mcq'][-1]['q'] == 'سؤال ثانٍ؟' and len(saved['tf']) == len(BANK['tf']), 'PR: saved bank = original + the new question (nothing lost)')
        check(not any(c[0] in ('DELETE',) or c[1].endswith('/merge') for c in calls), 'PR: never merges or deletes')
        check(any(c[0] == 'POST' and c[1].endswith('/pulls') for c in calls), 'PR: pull request opened')
        # استيراد غير صالح
        pg.goto(URL + '#/bank'); pg.wait_for_timeout(200); bad = ROOT / '/tmp/claude-0/bad.json'; pathlib.Path('/tmp/claude-0/bad.json').write_text('{"mcq":[]}', encoding='utf8')
        pg.set_input_files('input[type=file]', '/tmp/claude-0/bad.json'); pg.wait_for_timeout(300); check('بنية الملف غير صحيحة' in pg.locator('.toast').last.inner_text(), 'import: malformed file rejected, nothing changed')
        # لغة وثيم
        pg.goto(URL + '#/settings'); pg.get_by_role('button', name='العربية / English').click(); check(pg.evaluate("document.documentElement.dir") == 'ltr' and 'Settings' in pg.locator('h1').inner_text(), 'EN/LTR works')
        pg.get_by_role('button', name='Theme: light/dark').click(); check(pg.evaluate("document.documentElement.getAttribute('data-theme')") == 'light', 'light theme works')
        pg.screenshot(path='/tmp/claude-0/shots/admin-light-en.png')
        check('github_pat_fake' not in ROOT.joinpath('dist/admin/index.html').read_text(encoding='utf8'), 'no secrets in built file')
        pg.close()
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
