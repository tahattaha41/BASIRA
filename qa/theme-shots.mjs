// يعرض القالب الجديد بالمحاكي ويصوّره: node theme-shots.mjs <outdir> [tag]
import fs from 'node:fs'; import { createRequire } from 'node:module';
import { render, fixtures } from './blogger-sim.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] || '/tmp/claude-0/shots', tag = process.argv[3] || 't';
fs.mkdirSync(out, { recursive: true });
const xml = fs.readFileSync('../theme/smart-choice-blogger.xml', 'utf8'); const F = fixtures();
const toolPage = fs.readFileSync('../pages/tool-loan.md', 'utf8').split('---').slice(2).join('---');
F.page = { blog: { ...F.item.blog, pageType: 'static_page', url: 'http://t.test/p/loan.html' }, posts: [{ ...F.item.posts[0], body: toolPage }], newerPageUrl: '', olderPageUrl: '' };
F.rates = { blog: { ...F.item.blog, pageType: 'static_page', url: 'http://t.test/p/rates.html' }, posts: [{ ...F.item.posts[0], body: fs.readFileSync('../pages/rates.md', 'utf8').split('---').slice(2).join('---') }], newerPageUrl: '', olderPageUrl: '' };
const hub = fs.readFileSync('../pages/tools.md', 'utf8').split('---').slice(2).join('---');
F.hub = { blog: { ...F.item.blog, pageType: 'static_page', url: 'http://t.test/p/tools.html' }, posts: [{ ...F.item.posts[0], body: hub }], newerPageUrl: '', olderPageUrl: '' };
const b = await chromium.launch(); const only = (process.env.ONLY || '').split(',').filter(Boolean);
for (const [name, S] of Object.entries(F)) {
  if (only.length && !only.includes(name)) continue;
  const html = render(xml, S); fs.writeFileSync(`${out}/${tag}-${name}.html`, html);
  for (const [w, h, sc] of [[1280, 900, 1], [390, 800, 1]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://t.test')) return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }); return r.abort(); });
    await p.goto('http://t.test/'); 
    if (process.env.DARK) await p.evaluate(() => document.documentElement.setAttribute('data-sc-theme', 'dark'));
    if (process.env.JS) await p.addScriptTag({ path: '../assets/js/smart-choice.js' });
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/${tag}-${name}-${w}.png`, fullPage: true }); await p.close();
  }
  console.log(name, 'ok', html.length);
}
await b.close();
