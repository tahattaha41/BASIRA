import sys, pathlib, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent; fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(R)); H.log_message = lambda *a: None
srv = socketserver.TCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{port}/preview/index.html'
with sync_playwright() as p:
    b = p.chromium.launch()
    for vp, name in (({'width': 1280, 'height': 800}, 'desktop'), ({'width': 390, 'height': 844}, 'mobile')):
        pg = b.new_page(viewport=vp); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const d=document.createElement('div');d.id='basira-admin';document.body.prepend(d)})")
        pg.goto(URL); pg.wait_for_selector('iframe.admin-frame', timeout=8000)
        fr = pg.frame_locator('iframe.admin-frame')
        fr.locator('input[type=password]').wait_for()
        check(fr.locator('.kpi').count() == 0, f'embedded admin asks for the password first ({name})')
        fr.locator('input[type=password]').fill('Taha'); pg.keyboard.press('Enter'); fr.locator('.kpi').first.wait_for(timeout=5000)
        check(True, f'embedded admin opens after the password ({name})')
        box = pg.evaluate("(()=>{const r=document.querySelector('iframe.admin-frame').getBoundingClientRect();return [r.width,r.height,innerWidth,innerHeight]})()")
        check(box[0] >= box[2] - 1 and box[1] >= box[3] - 1, f'admin fills the viewport ({name}) {box}')
        check(pg.evaluate("localStorage.getItem('basira.internal')") == '1', 'visiting admin marks the device internal (no analytics)')
        check(pg.evaluate("document.querySelector('meta[name=robots]').content") == 'noindex,nofollow', 'admin page is noindex')
        check(not errs, f'no page errors ({name}) {errs[:1]}')
    pn = b.new_page(); pn.goto(URL); pn.wait_for_timeout(400)
    check(pn.locator('iframe.admin-frame').count() == 0 and pn.evaluate("localStorage.getItem('basira.internal')") is None, 'normal pages are untouched (no admin frame, device not marked internal)')
srv.shutdown()
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
