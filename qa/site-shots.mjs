// يعرض القالب الحقيقي عبر المحاكي ببيانات الموقع الفعلية، ويصوّر الصفحات ويفحص التخطيط والأدوات.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; const { chromium } = createRequire('/opt/npm-tools/')('playwright'); import { render } from './blogger-sim.mjs';
const root = path.resolve(import.meta.dirname, '..'), xml = fs.readFileSync(root + '/dist/basira-theme.xml', 'utf8'), fx = JSON.parse(fs.readFileSync(root + '/dist/fixtures.json', 'utf8'));
const outDir = process.argv[2] || '/tmp/claude-0/shots'; fs.mkdirSync(outDir, { recursive: true });
const blog = (o) => ({ homepageUrl: 'http://t.test/', url: 'http://t.test/', pageType: 'index', pageTitle: 'BASIRA | بصيرة', metaDescription: 'وصف', languageDirection: 'rtl', searchQuery: '', searchLabel: '', ...o });
const post = (p) => ({ title: p.title, url: `/2026/${p.date.slice(5, 7)}/${p.slug}.html`, snippet: p.summary, body: p.body, timestamp: p.date, timestampISO8601: p.date, labels: p.labels.map(n => ({ name: n, url: '/search/label/' + n })), author: { name: 'طه' } });
const posts = fx.posts.map(post);
const S = {
  home: { blog: blog({}), posts, newerPageUrl: '', olderPageUrl: '' },
  item: { blog: blog({ url: 'http://t.test/2026/11/x.html', pageType: 'item' }), posts: [posts[0]], newerPageUrl: '/n', olderPageUrl: '/o' },
  item2: { blog: blog({ url: 'http://t.test/2026/11/y.html', pageType: 'item' }), posts: [posts[6]], newerPageUrl: '', olderPageUrl: '/o' },
  tool: { blog: blog({ url: 'http://t.test/p/age.html', pageType: 'static_page' }), posts: [{ title: fx.tools[0].title, body: fx.tools[0].body }] },
  units: { blog: blog({ url: 'http://t.test/p/u.html', pageType: 'static_page' }), posts: [{ title: fx.tools[8].title, body: fx.tools[8].body }] },
  hub: { blog: blog({ url: 'http://t.test/p/tools.html', pageType: 'static_page' }), posts: [{ title: 'كل الأدوات', body: fx.hub }] },
  about: { blog: blog({ url: 'http://t.test/p/about.html', pageType: 'static_page' }), posts: [{ title: fx.pages[0].title, body: fx.pages[0].body }] },
  label: { blog: blog({ url: 'http://t.test/search/label/x', searchLabel: 'التقويم والتواريخ' }), posts: posts.slice(0, 4), newerPageUrl: '', olderPageUrl: '/o' },
  error: { blog: blog({ url: 'http://t.test/x', pageType: 'error_page' }), posts: [] },
};
const b = await chromium.launch(); let problems = 0;
const only = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(S);
for (const [w, h, dark] of [[390, 844, false], [1280, 900, false], [390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }); const page = await ctx.newPage();
  await page.route('**/*', r => r.request().url().startsWith('data:') || r.request().url().startsWith('about:') ? r.continue() : r.abort());
  for (const k of only) {
    await page.setContent(render(xml, S[k]), { waitUntil: 'domcontentloaded' });
    if (dark) await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(150);
    const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.body.scrollHeight, errs: [...document.querySelectorAll('.tool')].filter(t => !t.children.length).length }));
    if (r.sw > r.cw + 1) { problems++; console.log('OVERFLOW', k, w, r.sw, r.cw); }
    if (r.errs) { problems++; console.log('EMPTY TOOL', k); }
    await page.screenshot({ path: `${outDir}/${k}-${w}${dark ? 'd' : ''}.png`, fullPage: true });
  }
  await ctx.close();
}
await b.close(); console.log(problems ? 'PROBLEMS ' + problems : 'SHOTS OK'); process.exit(problems ? 1 : 0);
