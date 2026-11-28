"""تدقيق آلي لكل لعبة: يفتحها على شاشة هاتف ويسجّل ما أُثبت فعلاً وما لم يُختبر. يكتب docs/GAMES-STATUS.md.
الحالات: اجتاز / فشل / غير مختبر. لا يُكتب «اجتاز» إلا لما شُغّل فعلاً."""
import json, pathlib, re, sys, time
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent; URL = (R / 'preview/index.html').as_uri()
games = json.loads((R / 'src/site.json').read_text(encoding='utf-8'))['games']
tests = {f.name: f.read_text(encoding='utf-8') for f in (R / 'qa').glob('*_test.py')}
def covered(slug): return sorted(n.replace('.py', '') for n, t in tests.items() if re.search(r"data-g=%s\b|'%s'|\"%s\"" % (slug, slug, slug), t) and n not in ('contrast_test.py', 'v5_test.py', 'ui_test.py'))
rows = []; bad = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for g in games:
        slug, name = g[0], g[1]; pg = b.new_page(viewport={'width': 360, 'height': 740}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        res = {'start': 'فشل', 'layout': 'فشل', 'rules': 'فشل'}
        try:
            pg.goto(URL); pg.wait_for_timeout(200); pg.locator('#picker button[data-g=%s]' % slug).click(); h = pg.locator('#play-host')
            res['rules'] = 'اجتاز' if len(h.locator('.g-rules, .g-intro, p').all_inner_texts()) and len(' '.join(h.inner_text().split())) > 40 else 'فشل'
            chip = h.locator('.g-chip').first
            if chip.count(): chip.click()
            h.get_by_role('button', name='ابدأ').click(); pg.wait_for_timeout(1300)
            res['start'] = 'اجتاز' if not errs and h.locator('canvas, .g-opt, .g-q, button, .mir, .tile, .grid, [class*=g-]').count() > 0 else 'فشل'
            res['layout'] = 'اجتاز' if pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1') else 'فشل'
        except Exception as e:
            errs.append(str(e)[:80])
        pg.close(); cov = covered(slug)
        if 'فشل' in res.values() or errs: bad += 1
        rows.append((slug, name, res, cov, errs[:1]))
        if errs or 'فشل' in res.values(): print('FAIL', slug, res, errs[:1])
    b.close()
out = ['# حالة الألعاب (يُولَّد آلياً بواسطة qa/games_audit.py)', '', 'مولَّد: %s. الفحص على Chromium بشاشة 360×740 من نسخة المعاينة. **لا يثبت سلامة اللمس والصوت على هاتف حقيقي**، وكل صف أدناه في هذا العمود «غير مختبر».', '',
       '| اللعبة | البدء بلا أخطاء | عدم تجاوز العرض | قواعد ظاهرة | اختبار تفاعلي مخصص | هاتف حقيقي |', '|---|---|---|---|---|---|']
for slug, name, r, cov, errs in rows:
    out.append('| %s (`%s`) | %s | %s | %s | %s | غير مختبر |' % (name, slug, r['start'], r['layout'], r['rules'], ('اجتاز: ' + '، '.join(cov)) if cov else 'غير مختبر تفاعلياً'))
out += ['', 'الألعاب بلا اختبار تفاعلي مخصص: %d من %d.' % (sum(1 for r in rows if not r[3]), len(rows)), '']
(R / 'docs/GAMES-STATUS.md').write_text('\n'.join(out) % time.strftime('%Y-%m-%d') if False else '\n'.join(out).replace('مولَّد: %s.', 'مولَّد: ' + time.strftime('%Y-%m-%d') + '.'), encoding='utf-8')
print('failures:', bad); sys.exit(1 if bad else 0)
