import sys, pathlib, re
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def play(pg, slug, n):
    h = pg.locator('#play-host'); seq = []
    for i in range(n):
        seq.append(h.locator('.g-q').inner_text() + '|' + '/'.join(h.locator('.g-opt').all_inner_texts()))
        pg.evaluate("document.querySelector('.g-opt').click()"); h.locator('.g-act .btn').last.click()
    return seq
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    pg = b.new_page(viewport={'width': 390, 'height': 844}); pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto(URL); pg.wait_for_timeout(300)
    for slug, n, lvl in (('mcq', 10, 'سهل'), ('math', 10, 'سهل'), ('stroop', 10, 'سهل')):
        pg.locator('#picker button[data-g=%s]' % slug).click(); h = pg.locator('#play-host')
        h.locator('.g-chip', has_text=re.compile('^' + lvl + '$')).click(); h.get_by_role('button', name='ابدأ').click()
        seq = play(pg, slug, n)
        link = pg.evaluate("""(()=>{var u=null;window.prompt=function(m,v){u=v};navigator.share=undefined;try{navigator.clipboard.writeText=function(v){u=v;return Promise.reject()}}catch(e){}
          [...document.querySelectorAll('#play-host .g-act .btn')].find(b=>b.textContent.includes('تحدَّ')).click();return u})()""")
        pg.wait_for_timeout(100)
        link = link or pg.evaluate("window.__u")
        check(bool(link) and 'gc=' in link and 'game=' + slug in link, f'{slug}: share link created ({link})')
        if not link: continue
        q = b.new_context(viewport={'width': 390, 'height': 844}).new_page(); q.on('pageerror', lambda e: errs.append(str(e))); q.goto(link); q.wait_for_timeout(300)
        check(q.locator('.g-invite').count() == 1, f'{slug}: friend sees the challenge invite')
        q.get_by_role('button', name='اقبل التحدي').click()
        seq2 = play(q, slug, n)
        check(seq == seq2, f'{slug}: same questions in the same order for both players')
        check('نتيجة صديقك' in q.locator('#play-host').inner_text(), f'{slug}: result compares with the friend score')
        q.close(); pg.go_back(); pg.wait_for_timeout(200)
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
