import fs from 'node:fs'; import { render, fixtures } from './blogger-sim.mjs';
const R = '/home/claude/smart-choice';
export const xml = fs.readFileSync(R + '/theme/smart-choice-blogger.xml', 'utf8');
export const skin = xml.match(/<b:skin><!\[CDATA\[([\s\S]*?)\]\]><\/b:skin>/)[1];
export const F = fixtures();
/** صفحة كاملة بالقالب الحقيقي: kind = home|item|label|search|error|static (مع body لصفحات static) */
export function full(kind, body) {
  if (kind === 'static') { const S = { ...F.item, blog: { ...F.item.blog, pageType: 'static_page', url: 'http://t.test/p/x.html' }, posts: [{ ...F.item.posts[0], body }] }; return render(xml, S); }
  return render(xml, F[kind]);
}
