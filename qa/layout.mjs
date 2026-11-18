// القالب الحقيقي (عبر المحاكي): تجاوز أفقي + أهداف لمس صغيرة، فاتح وداكن × 4 عروض × صفحات القالب
import { createRequire } from 'node:module'; import fs from 'node:fs';
import { full } from './lib.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R = '/home/claude/smart-choice';
const js = fs.readFileSync(R + '/assets/js/smart-choice.js', 'utf8');
const body = f => fs.readFileSync(R + '/pages/' + f, 'utf8').split('---').slice(2).join('---');
const now = Math.floor(Date.now() / 1000);
const rates = { updated: now - 60, fetched: now - 60, egp: { USD: 53.45, EUR: 59.16, GBP: 70.78, SAR: 14.25, AED: 14.55, KWD: 174.2, QAR: 14.68 }, gold: { source: 'xaus.com', updated: now, fetched: now, usd_oz: 4150, egp_gram: { 24: 7131, 21: 6240, 18: 5348 } }, silver: { source: 'xaus.com', updated: now, fetched: now, usd_oz: 48, egp_gram: { 999: 82, 925: 76 } } };
const pages = [['home', full('home')], ['item', full('item')], ['label', full('label')], ['error', full('error')], ['tools', full('static', body('tools.md'))], ['tool-loan', full('static', body('tool-loan.md'))], ['rates', full('static', body('rates.md'))]];
const b = await chromium.launch(); let bad = 0;
for (const theme of ['light', 'dark']) for (const w of [390, 820, 1024, 1280]) for (const [n, html] of pages) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://t.test')) return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }); if (u.includes('raw.githubusercontent')) return r.fulfill({ json: u.includes('rates') ? rates : {}, headers: { 'access-control-allow-origin': '*' } }); return r.abort(); });
  await p.goto('http://t.test/'); await p.addScriptTag({ content: js }); await p.evaluate(t => { if (t === 'dark') document.documentElement.setAttribute('data-sc-theme', 'dark'); }, theme); await p.waitForTimeout(350);
  const r = await p.evaluate(() => { const over = document.documentElement.scrollWidth > innerWidth + 2; const small = [...document.querySelectorAll('a,button,input,select,summary')].filter(e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && e.closest('[hidden]') == null && (b.height < 24 || b.width < 24) && !e.matches('.sc-skip,.nav-t,.chip,.sc-totop:not(.show),a.sc-skip') && !e.closest('p,li,td,.prose,.foot li,.sc-guide'); }).map(e => e.tagName + '.' + e.className + ':' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)).slice(0, 6); return { over, small }; });
  if (r.over || r.small.length) { bad++; console.log('PROBLEM', theme, w, n, JSON.stringify(r)); }
  await p.close();
}
console.log(bad ? 'LAYOUT PROBLEMS ' + bad : 'LAYOUT OK (theme real: light+dark × 390/820/1024/1280 × 7 pages)'); await b.close(); process.exit(bad ? 1 : 0);
