// يختبر واجهة كل أداة داخل الصفحة المعروضة بالقالب: يدخل مدخلات ويتحقق من النتائج المعروفة.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { render } from './blogger-sim.mjs';
const { chromium } = createRequire('/opt/npm-tools/')('playwright');
const root = path.resolve(import.meta.dirname, '..'), xml = fs.readFileSync(root + '/dist/daqqa-theme.xml', 'utf8'), fx = JSON.parse(fs.readFileSync(root + '/dist/fixtures.json', 'utf8'));
const blog = { homepageUrl: 'http://t.test/', url: 'http://t.test/p/x.html', pageType: 'static_page', pageTitle: 't', metaDescription: '', languageDirection: 'rtl', searchQuery: '', searchLabel: '' };
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 900 } }); const page = await ctx.newPage(); let fail = 0;
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.route('**/*', r => r.request().url().startsWith('data:') || r.request().url().startsWith('about:') ? r.continue() : r.abort());
const open = async (slug) => { const t = fx.tools.find(x => x.slug === slug); await page.setContent(render(xml, { blog, posts: [{ title: t.title, body: t.body }] }), { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(100); };
const out = async () => (await page.locator('.tool .out').first().innerText());
const chk = (name, ok, got) => { if (!ok) { fail++; console.log('FAIL', name, '\n   got:', String(got).slice(0, 300)); } else console.log('ok  ', name); };
const fillAll = async (vals) => { const ins = page.locator('.tool input:not([type=checkbox]), .tool select, .tool textarea'); for (const [i, v] of Object.entries(vals)) await ins.nth(+i).fill(String(v)); };

await open('age-calculator'); await fillAll({ 0: '1990-03-15', 1: '2026-11-18' }); let o = await out();
chk('age', /36 سنة و8 أشهر و3 أيام/.test(o.replace(/\s+/g, ' ')) || /36 سنة/.test(o) && /8 أشهر/.test(o), o);
await open('date-difference'); await fillAll({ 0: '2026-01-01', 1: '2026-12-31' }); o = await out(); chk('datediff 364', /364/.test(o), o);
await open('hijri-converter'); const outs = page.locator('.tool .out'); await page.locator('.tool input[type=date]').fill('2026-02-18'); o = await outs.first().innerText(); chk('hijri 1 رمضان 1447', /1 رمضان 1447/.test(o), o);
await open('business-days'); await page.locator('.tool select').first().selectOption('add'); await fillAll({ 1: '2026-11-18', 3: '5' }); o = await out(); chk('bizdays add 5', /25 نوفمبر 2026/.test(o), o);
await open('countdown'); o = await out(); chk('countdown renders', /باقي \d+ يوماً/.test(o), o);
await open('numbers-to-words'); await fillAll({ 0: '1250.50' }); o = await out(); chk('words money', /ألف ومائتين وخمسين جنيهاً وخمسين قرشاً فقط لا غير/.test(o), o);
await page.locator('.tool select').nth(1).selectOption('0'); o = await out(); chk('words nominative', /ألف ومائتان وخمسون/.test(o), o);
await fillAll({ 0: '٣٠٠٠' }); await page.locator('.tool select').first().selectOption(''); o = await out(); chk('arabic digits → ثلاثة آلاف', /ثلاثة آلاف/.test(o), o);
await open('percentage-calculator'); o = await out(); chk('percent default 30', /30/.test(o), o);
await page.locator('.tool select').first().selectOption('rev'); await fillAll({ 1: '14', 2: '114' }); o = await out(); chk('percent reverse VAT = 100', /100/.test(o), o);
await open('word-counter'); await page.locator('.tool textarea').fill('هذا نص تجريبي. هذا نص ثانٍ؟\n\nفقرة جديدة'); o = await out(); chk('wordcount 8', /8\s*\n?كلمة/.test(o) || /8/.test(o), o);
await open('unit-converter'); await fillAll({ 1: '3' }); o = await out(); chk('feddan→m2 ×3', /12,602\.5/.test(o), o);
await open('time-calculator'); o = await out(); chk('time 8:00', /8 ساعة و 0 دقيقة/.test(o), o);
chk('no page errors', errs.length === 0, errs.join('|'));
await b.close(); console.log(fail ? 'FAILED ' + fail : 'TOOLS UI OK'); process.exit(fail ? 1 : 0);
