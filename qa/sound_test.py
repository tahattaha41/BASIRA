#!/usr/bin/env python3
"""اختبار نظام الصوت: صامت افتراضياً، لا صوت قبل تفاعل، زر تشغيل/إيقاف، حفظ الاختيار، توليد نغمات عند الإجابة. AudioContext مُراقَب."""
import json, re, sys
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
SPY = """(function(){window.__ctx=0;window.__osc=0;var A=window.AudioContext;
function Fake(){window.__ctx++;this.currentTime=0;this.state='running';this.destination={};}
Fake.prototype.resume=function(){};
Fake.prototype.createOscillator=function(){window.__osc++;return {frequency:{},connect:function(){},start:function(){},stop:function(){}};};
Fake.prototype.createGain=function(){return {gain:{setValueAtTime:function(){},exponentialRampToValueAtTime:function(){}},connect:function(){}};};
window.AudioContext=Fake;window.webkitAudioContext=Fake;})();"""
def answer_one(pg):
    pg.locator('#picker button[data-g=mcq]').click()
    host = pg.locator('#play-host'); host.locator('.g-chip', has_text=ex('سهل')).click()
    host.get_by_role('button', name='ابدأ').click()
    q = host.locator('.g-q').inner_text()
    host.locator('.g-opt', has_text=ex(MC[q])).first.click()
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 390, 'height': 900}); pg.add_init_script(SPY)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    btn = pg.locator('.js-sound').first
    check(btn.get_attribute('aria-pressed') == 'false' and 'مغلق' in btn.inner_text(), 'sound is off by default with a clear Arabic label')
    check(pg.evaluate('window.__ctx') == 0, 'no AudioContext created on page load (no autoplay)')
    answer_one(pg)
    check(pg.evaluate('window.__osc') == 0 and pg.evaluate('window.__ctx') == 0, 'muted: answering produces no sound')
    btn.click()
    check(btn.get_attribute('aria-pressed') == 'true' and pg.evaluate("localStorage.getItem('basira.sound')") == 'on', 'toggle turns sound on and saves it')
    pg.locator('#play-host .g-act .btn').last.click()
    o0 = pg.evaluate('window.__osc')
    q = pg.locator('#play-host .g-q').inner_text()
    pg.locator('#play-host .g-opt', has_text=ex(MC[q])).first.click()
    check(pg.evaluate('window.__osc') > o0, 'sound on: a correct answer plays tones (Web Audio)')
    pg.reload(); pg.wait_for_timeout(300)
    check(pg.locator('.js-sound').first.get_attribute('aria-pressed') == 'true', 'sound choice persists after reload')
    check(pg.evaluate('window.__ctx') == 0, 'after reload still no audio until user interaction')
    pg.locator('.js-lang').first.click()
    check('Sound: On' in pg.locator('.js-sound').first.inner_text(), 'sound label follows language')
    pg.locator('.js-sound').first.click()
    check(pg.evaluate("localStorage.getItem('basira.sound')") == 'off', 'toggle turns sound off')
    check(errs == [], 'no JS errors ' + str(errs))
    b.close()
print('FAILED' if fails else 'ALL PASS'); sys.exit(1 if fails else 0)
