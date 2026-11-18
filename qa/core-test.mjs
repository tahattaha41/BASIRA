import { createRequire } from 'node:module'; const C = createRequire(import.meta.url)('../src/core.js');
let fail = 0; const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.log('FAIL', m, '\n  got ', JSON.stringify(a), '\n  want', JSON.stringify(b)); } };
const W = (n, o) => C.intWords(n, o);
eq(W(0), 'صفر', '0'); eq(W(11), 'أحد عشر', '11'); eq(W(12), 'اثنا عشر', '12'); eq(W(12, { acc: 1 }), 'اثني عشر', '12 acc');
eq(W(21), 'واحد وعشرون', '21'); eq(W(35), 'خمسة وثلاثون', '35'); eq(W(100), 'مائة', '100'); eq(W(200), 'مائتان', '200'); eq(W(200, { acc: 1 }), 'مائتين', '200acc');
eq(W(1250), 'ألف ومائتان وخمسون', '1250'); eq(W(2025), 'ألفان وخمسة وعشرون', '2025'); eq(W(3000), 'ثلاثة آلاف', '3000'); eq(W(11000), 'أحد عشر ألف', '11000');
eq(W(100000), 'مائة ألف', '100000'); eq(W(1000000), 'مليون', '1e6'); eq(W(3500000), 'ثلاثة ملايين وخمسمائة ألف', '3.5e6'); eq(W(2000000000), 'ملياران', '2e9');
eq(W(5, { fem: 1 }), 'خمس', 'fem5'); eq(W(13, { fem: 1 }), 'ثلاث عشرة', 'fem13');
eq(C.moneyWords(1, 'EGP'), 'جنيه واحد فقط لا غير', 'm1'); eq(C.moneyWords(2, 'EGP'), 'جنيهان فقط لا غير', 'm2'); eq(C.moneyWords(5, 'EGP'), 'خمسة جنيهات فقط لا غير', 'm5');
eq(C.moneyWords(1250.5, 'EGP'), 'ألف ومائتان وخمسون جنيهاً وخمسون قرشاً فقط لا غير', 'm1250.5'); eq(C.moneyWords(100, 'EGP'), 'مائة جنيه فقط لا غير', 'm100');
eq(C.moneyWords(0.75, 'EGP'), 'خمسة وسبعون قرشاً فقط لا غير', 'm.75');
// تواريخ
const d = C.parseISO('2026-11-18'); eq(C.toHijri(d), { y: 1448, m: 6, d: 8 }, 'hijri today');
const g = C.fromHijri(1447, 9, 1); eq(C.iso(g), '2026-02-18', 'ramadan 1447'); // أم القرى
eq(C.iso(C.fromHijri(1445, 10, 1)), '2024-04-10', 'eid 1445');
eq(C.ymd(C.parseISO('1990-03-15'), C.parseISO('2026-11-18')), { y: 36, m: 8, d: 3 }, 'age');
eq(C.ymd(C.parseISO('2024-01-31'), C.parseISO('2024-03-01')), { y: 0, m: 1, d: 1 }, 'ymd borrow');
eq(C.diffDays(C.parseISO('2026-01-01'), C.parseISO('2026-12-31')), 364, 'diff');
eq(C.businessDays(C.parseISO('2026-11-15'), C.parseISO('2026-11-22'), [5, 6], []), 5, 'bd egypt'); // 15 Sun..21 Sat
eq(C.iso(C.addBusinessDays(C.parseISO('2026-11-18'), 5, [5, 6], [])), '2026-11-25', 'add bd');
eq(C.validHijri(1447, 12, 30), C.validHijri(1447, 12, 30), 'valid');
// وحدات
eq(+C.convert('area', 'fd', 'm2', 1).toFixed(2), 4200.83, 'feddan'); eq(+C.convert('area', 'fd', 'qr', 1).toFixed(6), 24, 'feddan qirat'); eq(+C.convert('area', 'qr', 'sh', 1).toFixed(3), 24, 'qirat sahm');
eq(+C.convert('temp', 'c', 'f', 100).toFixed(1), 212, 'temp'); eq(+C.convert('length', 'mi', 'km', 1).toFixed(3), 1.609, 'mile');
eq(+C.convert('mass', 'qn', 'kg', 1).toFixed(3), 44.928, 'qantar');
// نسب
eq(C.pct('of', 15, 200), 30, 'pct of'); eq(C.pct('is', 30, 200), 15, 'pct is'); eq(C.pct('chg', 80, 100), 25, 'chg'); eq(+C.pct('add', 14, 100).toFixed(6), 114, 'vat'); eq(+C.pct('rev', 14, 114).toFixed(2), 100, 'rev');
eq(C.minutesBetween('09:00', '17:30', 30), 480, 'time'); eq(C.minutesBetween('22:00', '06:00', 0), 480, 'overnight');
const ts = C.textStats('هذا نص تجريبي. هذا نص ثانٍ؟\n\nفقرة جديدة'); eq([ts.words, ts.sentences, ts.paragraphs], [8, 3, 2], 'text');
console.log(fail ? 'FAILED ' + fail : 'CORE OK'); process.exit(fail ? 1 : 0);
