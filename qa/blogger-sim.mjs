// محاكي Blogger مبسّط: يعرض قالب XML ببيانات تجريبية (b:if / b:elseif / b:else / b:loop / data: / expr:) لاختبار التصميم محلياً.
import fs from 'node:fs';
export function render(xml, S) {
  // 1) الهيكل: أبقِ <head> و<body> بعد إزالة وسوم b: الحاوية
  let t = xml.replace(/<\?xml[^>]*\?>/, '').replace(/<!DOCTYPE html>/, '<!DOCTYPE html>');
  t = t.replace(/<b:include[^>]*\/>/g, '');
  t = t.replace(/<b:skin><!\[CDATA\[([\s\S]*?)\]\]><\/b:skin>/, '<style>$1</style>');
  t = t.replace(/<b:widget-settings>[\s\S]*?<\/b:widget-settings>/g, '');
  t = t.replace(/<\/?b:(section|widget|includable)[^>]*>/g, '');
  t = t.replace(/<html[^>]*>/, `<html lang="ar" dir="rtl" class="v2">`);
  const toks = t.split(/(<\/?b:(?:if|loop)[^>]*>|<b:else\/>|<b:elseif[^>]*\/>)/);
  let i = 0;
  const ev = (expr, sc) => { const e = expr.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/data:([A-Za-z_][\w.]*)/g, (m, p) => `$.${p}`).replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!'); try { return new Function('$', `return (${e})`)(sc); } catch (er) { return undefined; } };
  function interp(s, sc) {
    s = s.replace(/<data:([A-Za-z_][\w.]*)\/>/g, (m, p) => { const v = ev('data:' + p, sc); return v == null ? '' : v; });
    s = s.replace(/expr:([\w-]+)='([^']*)'/g, (m, a, e) => { const v = ev(e, sc); return v == null || v === false ? '' : `${a}="${String(v).replace(/"/g, '&quot;')}"`; });
    return s;
  }
  function block(sc, stop) {
    let out = '';
    while (i < toks.length) {
      const tk = toks[i];
      if (/^<\/b:(if|loop)/.test(tk) || /^<b:else/.test(tk)) { if (stop) return out; }
      if (/^<b:if /.test(tk)) {
        i++; const conds = [ev(tk.match(/cond='([^']*)'/)[1], sc)]; const bodies = [];
        let cur = '';
        for (;;) {
          cur = block(sc, true); bodies.push(cur);
          const x = toks[i];
          if (/^<b:elseif/.test(x)) { conds.push(ev(x.match(/cond='([^']*)'/)[1], sc)); i++; continue; }
          if (/^<b:else\/>/.test(x)) { conds.push(true); i++; continue; }
          i++; break;
        }
        // نعيد تقييم الجسم المناسب فقط: لذلك نعيد بناء الفروع بصيغة مؤجّلة
        out += '\u0000IF' + JSON.stringify({ conds, bodies }) + '\u0000';
        continue;
      }
      if (/^<b:loop /.test(tk)) { i++; const vals = tk.match(/values='([^']*)'/)[1]; const v = tk.match(/var='([^']*)'/)[1]; const body = block(sc, true); i++; out += '\u0000LOOP' + JSON.stringify({ vals, v, body }) + '\u0000'; continue; }
      out += tk; i++;
    }
    return out;
  }
  const tree = block(S, false);
  function expand(s, sc) {
    // يعالج IF/LOOP المؤجلة بعمق
    return s.replace(/\u0000(IF|LOOP)(\{[\s\S]*?\})\u0000(?=[^\u0000]*|$)/g, (m) => m); // placeholder (لا يُستخدم)
  }
  // تنفيذ حقيقي: نحوّل التمثيل إلى دوال بشكل تكراري
  function run(str, sc) {
    let res = '', pos = 0;
    while (pos < str.length) {
      const a = str.indexOf('\u0000', pos);
      if (a < 0) { res += interp(str.slice(pos), sc); break; }
      res += interp(str.slice(pos, a), sc);
      const kind = str.startsWith('IF', a + 1) ? 'IF' : 'LOOP';
      // اعثر على النهاية المطابقة بعدّ الأقواس
      let depth = 0, j = a + 1 + kind.length, inStr = false, esc = false, end = -1;
      for (; j < str.length; j++) {
        const c = str[j];
        if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
        if (c === '"') inStr = true; else if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { end = j; break; } }
      }
      const obj = JSON.parse(str.slice(a + 1 + kind.length, end + 1));
      pos = end + 2; // تخطّى \u0000
      if (kind === 'IF') { const k = obj.conds.findIndex(Boolean); if (k >= 0) res += run(obj.bodies[k], sc); }
      else { const arr = ev('data:' + obj.vals.replace(/^data:/, ''), sc) || []; for (const it of arr) res += run(obj.body, { ...sc, [obj.v]: it }); }
    }
    return res;
  }
  return run(tree, S);
}
export function fixtures() {
  const mk = (n, labels) => ({ title: 'عنوان مقال تجريبي رقم ' + n + ' عن حساب القرض', url: '/2026/11/p' + n + '.html', snippet: 'مقتطف تجريبي يشرح فكرة المقال في سطرين تقريباً ليظهر شكل البطاقة بالنص الحقيقي وطوله المعتاد في الموقع.', body: '<p>فقرة افتتاحية للمقال تشرح الفكرة.</p><h2>الخطوة الأولى</h2><p>نص تجريبي طويل نسبياً لعرض شكل الفقرات والتباعد في صفحة المقال ' + 'كلمة '.repeat(60) + '</p><table><thead><tr><th>المدة</th><th>القسط</th><th>الفوائد</th></tr></thead><tbody><tr><td>12</td><td>8,884</td><td>6,618</td></tr><tr><td>24</td><td>4,707</td><td>12,976</td></tr></tbody></table><h2>الخطوة الثانية</h2><ul><li>بند أول</li><li>بند ثانٍ</li></ul><div class="sc-bars"><div class="sc-bar"><span>12 شهراً</span><i style="width:25%;background:#0f766e"></i><b>6,619</b></div><div class="sc-bar"><span>24 شهراً</span><i style="width:50%;background:#b7791f"></i><b>12,976</b></div></div><h2>خلاصة</h2><p>' + 'كلمة '.repeat(40) + '</p>', labels: labels.map(l => ({ name: l, url: '/search/label/' + encodeURIComponent(l) })), timestamp: '12 نوفمبر 2026', timestampISO8601: '2026-11-12T10:00:00+02:00', author: { name: 'Taha' } });
  const posts = [mk(1, ['القروض والتقسيط']), mk(2, ['التسوق والخصومات']), mk(3, ['الرواتب والميزانية']), mk(4, ['الادخار والتضخم']), mk(5, ['مشروعك الصغير']), mk(6, ['التسوق والخصومات'])];
  const blog = (o) => ({ homepageUrl: 'http://t.test/', url: 'http://t.test/', pageType: 'index', pageTitle: 'BASIRA | بصيرة', metaDescription: 'وصف', languageDirection: 'rtl', searchQuery: '', searchLabel: '', ...o });
  return {
    home: { blog: blog({}), posts, newerPageUrl: '', olderPageUrl: '' },
    item: { blog: blog({ url: 'http://t.test/2026/11/p1.html', pageType: 'item' }), posts: [posts[0]], newerPageUrl: '/n', olderPageUrl: '/o' },
    label: { blog: blog({ url: 'http://t.test/search/label/x', searchLabel: 'القروض والتقسيط' }), posts, newerPageUrl: '', olderPageUrl: '/o' },
    search: { blog: blog({ url: 'http://t.test/search?q=قرض', searchQuery: 'قرض' }), posts: posts.slice(0, 2), newerPageUrl: '', olderPageUrl: '' },
    error: { blog: blog({ url: 'http://t.test/x', pageType: 'error_page' }), posts: [], newerPageUrl: '', olderPageUrl: '' },
  };
}
