import sys, pathlib
from playwright.sync_api import sync_playwright
URL = pathlib.Path(__file__).resolve().parent.parent.joinpath('preview/index.html').as_uri()
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    E = lambda js: pg.evaluate(js)
    s = lambda days, now: E("BSR.engine.streakInfo({days:%s},'%s')" % (days, now))
    check(s('{}', '2026-11-20')['streak'] == 0, 'no days => streak 0')
    check(s("{'2026-11-18':1,'2026-11-19':2,'2026-11-20':1}", '2026-11-20')['streak'] == 3, 'three consecutive days => 3')
    check(s("{'2026-11-18':1,'2026-11-19':2}", '2026-11-20')['streak'] == 2, 'streak survives until the end of today')
    check(s("{'2026-11-17':1,'2026-11-19':2}", '2026-11-20')['streak'] == 1, 'a gap breaks the streak')
    check(s("{'2026-11-30':1,'2026-12-01':1}", '2026-12-01')['streak'] == 2, 'month boundary counts')
    h = E("(()=>{var s={};var a=BSR.engine.habit(s,'2026-11-20'),b=BSR.engine.habit(s,'2026-11-20'),c=BSR.engine.habit(s,'2026-11-20'),d=BSR.engine.habit(s,'2026-11-20');return [a.chest,b.chest,c.chest,d.chest]})()")
    check(h == [0, 0, 15, 0], 'chest only on the 3rd round of the day, once ' + str(h))
    m = E("(()=>{var s={days:{'2026-11-18':1,'2026-11-19':1}};return BSR.engine.habit(s,'2026-11-20')})()")
    check(m['mile'] == 20 and m['streak'] == 3, 'day-3 milestone gives 20 XP once')
    m2 = E("(()=>{var s={days:{'2026-11-18':1,'2026-11-19':1}};BSR.engine.habit(s,'2026-11-20');return BSR.engine.habit(s,'2026-11-20').mile})()")
    check(m2 == 0, 'milestone not repeated on the same day')
    # حفظ ثم استيراد رمز
    pg.evaluate("localStorage.setItem('basira.v2', JSON.stringify({xp:77,days:{'2026-11-20':1}}))")
    code = E('BSR.engine.exportCode()')
    pg.evaluate("localStorage.clear()")
    check(E("BSR.engine.importCode('%s')" % code) is True and E("JSON.parse(localStorage.getItem('basira.v2')).xp") == 77, 'export code round-trips')
    check(E("BSR.engine.importCode('not-a-code')") is False and E("BSR.engine.importCode('%s')" % __import__('base64').b64encode(b'[1]').decode()) is False, 'bad codes are rejected, state untouched')
    check(E("JSON.parse(localStorage.getItem('basira.v2')).xp") == 77, 'rejected import keeps progress')
    # لعب جولة فعلية ثم ظهور السلسلة في اللوحة
    pg.evaluate('localStorage.clear()'); pg.goto(URL); pg.wait_for_timeout(300)
    pg.locator('#picker button[data-g=truefalse]').click(); h = pg.locator('#play-host'); h.get_by_role('button', name='ابدأ').click()
    for i in range(10):
        h.locator('.g-opt').first.click(); h.locator('.g-act .btn').last.click()
    pg.go_back(); pg.wait_for_timeout(300)
    st = E("JSON.parse(localStorage.getItem('basira.v2')).days")
    check(sum(st.values()) == 1, 'a played round is counted in today ' + str(st))
    check(pg.locator('#habit-panel .hb-n').inner_text() == '1', 'panel shows 1-day streak')
    check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    check(not errs, 'no JS errors ' + str(errs))
    b.close()
sys.exit(1 if fails else 0)
