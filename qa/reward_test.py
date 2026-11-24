#!/usr/bin/env python3
"""اختبار مكافآت اللعب: علامة صح متحركة، +XP، ترقّي المستوى، كأس الفوز، وتقليل الحركة. على preview/index.html."""
import json, re, sys, datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
BANK = json.loads((ROOT / 'src/data/bank.json').read_text(encoding='utf-8'))
URL = (ROOT / 'preview/index.html').as_uri()
MC = {q['q']: q['o'][q['a']] for q in BANK['mcq']}
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def ex(t): return re.compile('^' + re.escape(t) + '$')

def play_round(pg):
    pg.locator('#picker button[data-g=mcq]').click()
    host = pg.locator('#play-host')
    host.locator('.g-chip', has_text=ex('سهل')).click()
    host.get_by_role('button', name='ابدأ').click()
    ticks = None
    for i in range(10):
        q = host.locator('.g-q').inner_text()
        host.locator('.g-opt', has_text=ex(MC[q])).first.click()
        if i == 0: ticks = host.locator('.tick').count()
        host.locator('.g-act .btn').last.click()
    return host, ticks

with sync_playwright() as p:
    b = p.chromium.launch()
    # تقدم قريب من ترقية المستوى (المستوى 1 يحتاج 50 خبرة)
    pg = b.new_page(viewport={'width': 390, 'height': 900})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script("if(!localStorage.getItem('basira.v2'))localStorage.setItem('basira.v2',JSON.stringify({xp:45,stats:{},seen:{},hist:[],ach:{}}))")
    pg.goto(URL); pg.wait_for_timeout(300)
    host, ticks = play_round(pg)
    check(ticks == 1, 'correct answer shows an animated check mark')
    check(host.locator('.g-end.win').count() == 1, 'win screen shown on pass')
    check(host.locator('.win-ico svg use').count() == 1, 'win screen shows the 3D trophy')
    check(host.locator('.g-gain').count() == 1 and '+' in host.locator('.g-gain').inner_text(), '+XP reward chip shown')
    check(host.locator('.lvlup').count() == 1, 'level-up overlay appears when XP crosses a level')
    lv = pg.evaluate("BSR.engine.levelInfo(JSON.parse(localStorage.getItem('basira.v2')).xp).level")
    check(str(lv) in host.locator('.lvlup-t').inner_text() and lv >= 2, 'level-up overlay names the actual new level (%s)' % lv)
    check(host.locator('.confetti').count() >= 1, 'celebration particles spawn on win')
    host.locator('.lvlup').click()
    check(host.locator('.lvlup').count() == 0, 'level-up overlay can be dismissed')
    check(pg.evaluate("JSON.parse(localStorage.getItem('basira.v2')).xp") >= 50, 'XP saved')
    # جولة ثانية: لا ترقّي جديد ولا تكرار للنافذة
    host.get_by_role('button', name='جولة جديدة').click()
    check(host.locator('.lvlup').count() == 0, 'no level-up overlay without a new level')
    check(errs == [], 'no JS errors ' + str(errs))
    # تقليل الحركة
    pg2 = b.new_page(viewport={'width': 390, 'height': 900}, reduced_motion='reduce')
    pg2.goto(URL); pg2.wait_for_timeout(200)
    check(pg2.evaluate("getComputedStyle(document.querySelector('.gcard svg')).animationName") == 'none', 'reduced motion disables icon animation')
    b.close()
print('FAILED' if fails else 'ALL PASS'); sys.exit(1 if fails else 0)
