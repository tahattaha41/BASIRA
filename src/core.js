/* دقّة — منطق الحساب (بلا واجهة). يعمل في المتصفح وفي Node للاختبار. */
var DaqqaCore = (function () {
  'use strict';
  var MS = 86400000;

  /* ---------- التواريخ ---------- */
  function utc(y, m, d) { var t = new Date(0); t.setUTCFullYear(y, m - 1, d); t.setUTCHours(12, 0, 0, 0); return t; } // ظهراً لتفادي مشاكل التوقيت
  function parseISO(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); if (!m) return null; var d = utc(+m[1], +m[2], +m[3]); return d.getUTCMonth() === +m[2] - 1 ? d : null; }
  function iso(d) { return d.getUTCFullYear().toString().padStart(4, '0') + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); }
  function diffDays(a, b) { return Math.round((b - a) / MS); }
  function addDays(d, n) { return new Date(d.getTime() + n * MS); }
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function monthLen(y, m) { return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; }

  /* فرق بالسنين والأشهر والأيام (ميلادي) */
  function addMonths(d, n) { var t = d.getUTCFullYear() * 12 + d.getUTCMonth() + n, y = Math.floor(t / 12), m = t % 12; return utc(y, m + 1, Math.min(d.getUTCDate(), monthLen(y, m + 1))); }
  function ymd(a, b) { // أكبر عدد أشهر كاملة (مع قصّ نهاية الشهر) ثم الأيام المتبقية
    var total = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth();
    while (total > 0 && addMonths(a, total) > b) total--;
    return { y: Math.floor(total / 12), m: total % 12, d: diffDays(addMonths(a, total), b) };
  }

  /* ---------- الهجري (أم القرى عبر Intl) ---------- */
  var HF = null;
  function hfmt() { if (!HF) HF = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }); return HF; }
  function toHijri(d) {
    var o = {}; hfmt().formatToParts(d).forEach(function (p) { if (p.type !== 'literal' && p.type !== 'era') o[p.type] = parseInt(p.value, 10); });
    return { y: o.year, m: o.month, d: o.day };
  }
  function hcmp(a, b) { return a.y !== b.y ? a.y - b.y : a.m !== b.m ? a.m - b.m : a.d - b.d; }
  function fromHijri(y, m, d) {
    var g = new Date(Date.UTC(622, 6, 16, 12) + ((y - 1) * 354.367 + (m - 1) * 29.5306 + (d - 1)) * MS);
    for (var i = 0; i < 80; i++) {
      var h = toHijri(g), c = hcmp(h, { y: y, m: m, d: d });
      if (c === 0) return g;
      g = addDays(g, c > 0 ? -1 : 1);
      if (i > 60) { /* تاريخ غير موجود (مثلاً يوم 30 في شهر من 29) */ }
    }
    return null;
  }
  function hijriMonthLen(y, m) { var a = fromHijri(y, m, 1), ny = m === 12 ? y + 1 : y, nm = m === 12 ? 1 : m + 1, b = fromHijri(ny, nm, 1); return diffDays(a, b); }
  function validHijri(y, m, d) { if (m < 1 || m > 12 || d < 1) return false; var g = fromHijri(y, m, d); if (!g) return false; var h = toHijri(g); return h.y === y && h.m === m && h.d === d; }
  function ymdHijri(a, b) { // a, b: تواريخ ميلادية؛ الفرق بحساب الهجري
    var ha = toHijri(a), hb = toHijri(b), y = hb.y - ha.y, m = hb.m - ha.m, d = hb.d - ha.d;
    if (d < 0) { m--; var pm = hb.m === 1 ? 12 : hb.m - 1, py = hb.m === 1 ? hb.y - 1 : hb.y; d += hijriMonthLen(py, pm); }
    if (m < 0) { y--; m += 12; }
    return { y: y, m: m, d: d };
  }
  var HM = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
  var GM = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var DN = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  /* أقرب تاريخ هجري قادم (شهر/يوم) بدءاً من تاريخ معيّن */
  function nextHijriOccurrence(from, hm, hd) {
    var h = toHijri(from), y = h.y;
    var g = fromHijri(y, hm, hd);
    if (!g || g < from) g = fromHijri(y + 1, hm, hd);
    return g;
  }

  /* ---------- أيام العمل ---------- */
  function businessDays(a, b, weekend, holidays) { // يشمل a ويستبعد b (عدد الأيام التي تمرّ)، weekend مصفوفة أرقام JS (0=أحد)
    var n = 0, hs = {}; (holidays || []).forEach(function (h) { hs[h] = 1; });
    var s = a <= b ? a : b, e = a <= b ? b : a;
    for (var d = s; d < e; d = addDays(d, 1)) { if (weekend.indexOf(d.getUTCDay()) < 0 && !hs[iso(d)]) n++; }
    return a <= b ? n : -n;
  }
  function addBusinessDays(a, n, weekend, holidays) {
    var hs = {}; (holidays || []).forEach(function (h) { hs[h] = 1; });
    var d = a, step = n >= 0 ? 1 : -1, left = Math.abs(n);
    while (left > 0) { d = addDays(d, step); if (weekend.indexOf(d.getUTCDay()) < 0 && !hs[iso(d)]) left--; }
    return d;
  }

  /* ---------- الأرقام بالحروف ---------- */
  var M1 = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  var F1 = ['', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع', 'عشر'];
  var TEEN_M = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  var TEEN_F = ['عشر', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'];
  var TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  var HUND = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function acc(s) { // تحويل المرفوع إلى منصوب/مجرور
    return s.replace(/اثنان/g, 'اثنين').replace(/اثنتان/g, 'اثنتين').replace(/اثنا /g, 'اثني ').replace(/اثنتا /g, 'اثنتي ')
      .replace(/(عشر|ثلاث|أربع|خمس|ست|سبع|ثمان|تسع)ون/g, '$1ين').replace(/مائتان/g, 'مائتين').replace(/مائتا /g, 'مائتي ').replace(/(ألف|مليون|مليار)ان/g, '$1ين');
  }
  function words3(n, fem) { // 1..999
    var parts = [], h = Math.floor(n / 100), r = n % 100;
    if (h) parts.push(HUND[h]);
    if (r) {
      if (r <= 10) parts.push((fem ? F1 : M1)[r]);
      else if (r < 20) parts.push((fem ? TEEN_F : TEEN_M)[r - 10]);
      else { var u = r % 10, t = Math.floor(r / 10); parts.push(u ? ((fem ? F1 : M1)[u] + ' و' + TENS[t]) : TENS[t]); }
    }
    return parts.join(' و');
  }
  var SCALES = [
    { one: 'ألف', two: 'ألفان', pl: 'آلاف', sg: 'ألف' },
    { one: 'مليون', two: 'مليونان', pl: 'ملايين', sg: 'مليون' },
    { one: 'مليار', two: 'ملياران', pl: 'مليارات', sg: 'مليار' }
  ];
  function intWords(n, opts) {
    opts = opts || {};
    if (n === 0) return 'صفر';
    if (n >= 1e12 || n < 0 || Math.floor(n) !== n) return null;
    var groups = [], x = n; while (x > 0) { groups.push(x % 1000); x = Math.floor(x / 1000); }
    var out = [];
    for (var i = groups.length - 1; i >= 0; i--) {
      var g = groups[i]; if (!g) continue;
      if (i === 0) { out.push(words3(g, opts.fem)); continue; }
      var sc = SCALES[i - 1], r = g % 100, w;
      if (g === 1) w = sc.one; else if (g === 2) w = sc.two;
      else if (r >= 3 && r <= 10) w = words3(g, false) + ' ' + sc.pl; else if (g === 200) w = 'مائتا ' + sc.sg; else w = words3(g, false) + ' ' + sc.sg;
      out.push(w);
    }
    var s = out.join(' و');
    return opts.acc ? acc(s) : s;
  }
  var CUR = {
    EGP: { one: 'جنيه واحد', two: ['جنيهان', 'جنيهين'], pl: 'جنيهات', sg: ['جنيهاً', 'جنيه'], fem: false, sub: { one: 'قرش واحد', two: ['قرشان', 'قرشين'], pl: 'قروش', sg: ['قرشاً', 'قرش'], fem: false } },
    SAR: { one: 'ريال واحد', two: ['ريالان', 'ريالين'], pl: 'ريالات', sg: ['ريالاً', 'ريال'], fem: false, sub: { one: 'هللة واحدة', two: ['هللتان', 'هللتين'], pl: 'هللات', sg: ['هللة', 'هللة'], fem: true } },
    USD: { one: 'دولار واحد', two: ['دولاران', 'دولارين'], pl: 'دولارات', sg: ['دولاراً', 'دولار'], fem: false, sub: { one: 'سنت واحد', two: ['سنتان', 'سنتين'], pl: 'سنتات', sg: ['سنتاً', 'سنت'], fem: false } },
    AED: { one: 'درهم واحد', two: ['درهمان', 'درهمين'], pl: 'دراهم', sg: ['درهماً', 'درهم'], fem: false, sub: { one: 'فلس واحد', two: ['فلسان', 'فلسين'], pl: 'فلوس', sg: ['فلساً', 'فلس'], fem: false } }
  };
  function counted(n, c, accCase) { // عبارة: العدد + المعدود
    var ai = accCase ? 1 : 0;
    if (n === 1) return c.one;
    if (n === 2) return c.two[ai];
    var r = n % 100, w = intWords(n, { fem: c.fem, acc: accCase });
    // المثنى المضاف إلى المعدود يفقد نونه: ألفا جنيه، مائتا جنيه، مليونا جنيه
    var dual = accCase ? [[/(^| )ألفين$/, '$1ألفي'], [/(^| )مائتين$/, '$1مائتي'], [/(^| )مليونين$/, '$1مليوني'], [/(^| )مليارين$/, '$1ملياري']] : [[/(^| )ألفان$/, '$1ألفا'], [/(^| )مائتان$/, '$1مائتا'], [/(^| )مليونان$/, '$1مليونا'], [/(^| )ملياران$/, '$1مليارا']];
    dual.forEach(function (d) { w = w.replace(d[0], d[1]); });
    if (r >= 3 && r <= 10) return w + ' ' + c.pl;
    return w + ' ' + (r === 0 ? c.sg[1] : c.sg[0]);
  }
  function moneyWords(amount, code, accCase) {
    var c = CUR[code]; if (!c) return null;
    var cents = Math.round(amount * 100), whole = Math.floor(cents / 100), sub = cents % 100;
    if (whole >= 1e12) return null;
    var parts = [];
    if (whole > 0 || sub === 0) parts.push(whole === 0 ? 'صفر ' + c.sg[1] : counted(whole, c, accCase));
    if (sub > 0) parts.push(counted(sub, c.sub, accCase));
    return parts.join(' و') + ' فقط لا غير';
  }

  /* ---------- الوحدات ---------- */
  var UNITS = {
    length: { name: 'الطول', base: 'م', u: [['mm', 'مليمتر', 0.001], ['cm', 'سنتيمتر', 0.01], ['m', 'متر', 1], ['km', 'كيلومتر', 1000], ['in', 'بوصة', 0.0254], ['ft', 'قدم', 0.3048], ['yd', 'ياردة', 0.9144], ['mi', 'ميل', 1609.344], ['dhb', 'ذراع بلدي', 0.58], ['dhm', 'ذراع معماري', 0.75], ['qs', 'قصبة', 3.55]] },
    area: { name: 'المساحة', base: 'م²', u: [['m2', 'متر مربع', 1], ['km2', 'كيلومتر مربع', 1e6], ['ha', 'هكتار', 10000], ['ac', 'إيكر (أكر)', 4046.8564224], ['ft2', 'قدم مربع', 0.09290304], ['qs2', 'قصبة مربعة', 12.6025], ['fd', 'فدان', 4200.8333333], ['qr', 'قيراط', 175.0347222], ['sh', 'سهم', 7.2931134]] },
    mass: { name: 'الوزن', base: 'كجم', u: [['g', 'جرام', 0.001], ['kg', 'كيلوجرام', 1], ['t', 'طن', 1000], ['oz', 'أونصة', 0.028349523125], ['lb', 'رطل إنجليزي (باوند)', 0.45359237], ['ratl', 'رطل مصري', 0.44928], ['qn', 'قنطار مصري', 44.928]] },
    volume: { name: 'الحجم', base: 'لتر', u: [['ml', 'مليلتر', 0.001], ['l', 'لتر', 1], ['m3', 'متر مكعب', 1000], ['cup', 'كوب أمريكي', 0.2365882365], ['floz', 'أونصة سائلة أمريكية', 0.0295735296], ['gal', 'جالون أمريكي', 3.785411784], ['galuk', 'جالون بريطاني', 4.54609]] },
    speed: { name: 'السرعة', base: 'كم/س', u: [['kmh', 'كيلومتر/ساعة', 1], ['ms', 'متر/ثانية', 3.6], ['mph', 'ميل/ساعة', 1.609344], ['kn', 'عقدة بحرية', 1.852]] },
    temp: { name: 'درجة الحرارة', base: '', u: [['c', 'سلزيوس °م', 0], ['f', 'فهرنهايت °ف', 0], ['k', 'كلفن', 0]] }
  };
  function convert(cat, from, to, v) {
    if (cat === 'temp') {
      var c = from === 'c' ? v : from === 'f' ? (v - 32) * 5 / 9 : v - 273.15;
      return to === 'c' ? c : to === 'f' ? c * 9 / 5 + 32 : c + 273.15;
    }
    var g = UNITS[cat].u, fa = null, ta = null;
    g.forEach(function (x) { if (x[0] === from) fa = x[2]; if (x[0] === to) ta = x[2]; });
    return v * fa / ta;
  }

  /* ---------- النسب ---------- */
  function pct(mode, a, b) {
    switch (mode) {
      case 'of': return a / 100 * b;                // a% من b
      case 'is': return b === 0 ? NaN : a / b * 100; // a كم % من b
      case 'chg': return a === 0 ? NaN : (b - a) / Math.abs(a) * 100; // التغير من a إلى b
      case 'add': return b * (1 + a / 100);
      case 'sub': return b * (1 - a / 100);
      case 'rev': return 1 + a / 100 === 0 ? NaN : b / (1 + a / 100); // السعر قبل زيادة a%
    }
  }

  /* ---------- الوقت ---------- */
  function minutesBetween(s, e, brk) { // "HH:MM"
    var p = function (x) { var m = /^(\d{1,2}):(\d{2})$/.exec(x || ''); return m ? +m[1] * 60 + +m[2] : null; };
    var a = p(s), b = p(e); if (a === null || b === null) return null;
    var t = b - a; if (t <= 0) t += 1440; t -= (brk || 0); return t < 0 ? null : t;
  }

  /* ---------- النص ---------- */
  function textStats(t) {
    var words = (t.match(/[ء-ي٠-٩A-Za-z0-9]+/g) || []);
    var noDia = t.replace(/[ً-ٰٟ]/g, '');
    var freq = {}; words.forEach(function (w) { var k = w.replace(/[ً-ٰٟ]/g, ''); if (k.length >= 3) freq[k] = (freq[k] || 0) + 1; });
    var top = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a] || a.localeCompare(b); }).filter(function (k) { return freq[k] > 1; }).slice(0, 8).map(function (k) { return [k, freq[k]]; });
    return {
      words: words.length, chars: noDia.length, charsNoSpace: noDia.replace(/\s/g, '').length,
      sentences: (t.match(/[^.!؟?!۔\n]+[.!؟?!۔]?/g) || []).filter(function (s) { return /\S/.test(s); }).length,
      paragraphs: t.split(/\n\s*\n/).filter(function (p) { return /\S/.test(p); }).length,
      diacritics: (t.match(/[ً-ٰٟ]/g) || []).length,
      readMin: words.length / 180, speakMin: words.length / 130, top: top
    };
  }

  return {
    utc: utc, parseISO: parseISO, iso: iso, diffDays: diffDays, addDays: addDays, isLeap: isLeap, monthLen: monthLen, ymd: ymd,
    toHijri: toHijri, fromHijri: fromHijri, hijriMonthLen: hijriMonthLen, validHijri: validHijri, ymdHijri: ymdHijri, nextHijriOccurrence: nextHijriOccurrence,
    HM: HM, GM: GM, DN: DN, businessDays: businessDays, addBusinessDays: addBusinessDays,
    intWords: intWords, moneyWords: moneyWords, CUR: CUR, UNITS: UNITS, convert: convert, pct: pct, minutesBetween: minutesBetween, textStats: textStats
  };
})();
if (typeof module !== 'undefined') module.exports = DaqqaCore;
