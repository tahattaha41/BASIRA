/* BASIRA | بصيرة — واجهة الأدوات. تعتمد على BasiraCore. */
(function () {
  'use strict';
  var C = window.BasiraCore; if (!C) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var fmtN = function (n, d) { return Number(n).toLocaleString('en-US', { maximumFractionDigits: d === undefined ? 2 : d }); };
  var AR = '٠١٢٣٤٥٦٧٨٩';
  function num(s) { return parseFloat(String(s).replace(/[٠-٩]/g, function (c) { return AR.indexOf(c); }).replace(/[٫]/g, '.').replace(/[,،٬\s]/g, '')); }
  function h(tag, props) {
    var e = document.createElement(tag), i, k, a = Array.prototype.slice.call(arguments, 2);
    for (k in (props || {})) { if (k === 'class') e.className = props[k]; else if (k === 'text') e.textContent = props[k]; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), props[k]); else e.setAttribute(k, props[k]); }
    a.forEach(function f(c) { if (c == null) return; if (Array.isArray(c)) c.forEach(f); else e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var uid = 0;
  function field(label, input, hint) { var id = 'f' + (++uid); input.id = id; return h('div', { class: 'fld' }, h('label', { for: id, text: label }), input, hint ? h('small', { text: hint }) : null); }
  function inp(type, val, extra) { var e = h('input', Object.assign({ type: type, autocomplete: 'off' }, extra || {})); if (val !== undefined) e.value = val; return e; }
  function sel(opts, val) { var e = h('select'); opts.forEach(function (o) { e.appendChild(h('option', { value: o[0], text: o[1] })); }); if (val !== undefined) e.value = val; return e; }
  function out() { return h('div', { class: 'out', 'aria-live': 'polite' }); }
  function row(k, v) { return h('div', { class: 'r' }, h('span', { class: 'k', text: k }), h('b', { class: 'v', text: v })); }
  function note(t) { return h('p', { class: 'note', text: t }); }
  function today() { var n = new Date(); return C.utc(n.getFullYear(), n.getMonth() + 1, n.getDate()); }
  function gname(d) { return C.DN[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + C.GM[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ' م'; }
  function hname(d) { var x = C.toHijri(d); return x.d + ' ' + C.HM[x.m - 1] + ' ' + x.y + ' هـ'; }
  function bind(box, els, fn) { els.forEach(function (e) { e.addEventListener('input', fn); e.addEventListener('change', fn); }); fn(); }
  function ymdTxt(r) { var p = []; if (r.y) p.push(r.y + (r.y > 10 ? ' سنة' : r.y === 1 ? ' سنة' : r.y === 2 ? ' سنتان' : ' سنوات')); if (r.m) p.push(r.m + (r.m > 10 ? ' شهراً' : r.m === 1 ? ' شهر' : r.m === 2 ? ' شهران' : ' أشهر')); if (r.d || !p.length) p.push(r.d + (r.d > 10 ? ' يوماً' : r.d === 1 ? ' يوم' : r.d === 2 ? ' يومان' : r.d === 0 ? ' يوم' : ' أيام')); return p.join(' و'); }

  var T = {};

  T.age = function (root) {
    var b = inp('date'), t = inp('date', C.iso(today()));
    var o = out();
    root.append(h('div', { class: 'grid2' }, field('تاريخ الميلاد (ميلادي)', b), field('احسب العمر حتى تاريخ', t)), o);
    bind(root, [b, t], function () {
      o.textContent = ''; var a = C.parseISO(b.value), z = C.parseISO(t.value);
      if (!a || !z) { o.append(note('اختر تاريخ الميلاد ليظهر العمر.')); return; }
      if (a > z) { o.append(note('تاريخ الميلاد بعد تاريخ الحساب. راجع التواريخ.')); return; }
      var r = C.ymd(a, z), days = C.diffDays(a, z);
      var nb = C.utc(z.getUTCFullYear(), a.getUTCMonth() + 1, Math.min(a.getUTCDate(), C.monthLen(z.getUTCFullYear(), a.getUTCMonth() + 1)));
      if (nb <= z && C.iso(nb) !== C.iso(z)) nb = C.utc(z.getUTCFullYear() + 1, a.getUTCMonth() + 1, Math.min(a.getUTCDate(), C.monthLen(z.getUTCFullYear() + 1, a.getUTCMonth() + 1)));
      var hr = C.ymdHijri(a, z);
      o.append(h('div', { class: 'big', text: ymdTxt(r) }),
        row('بالتقويم الهجري', ymdTxt(hr)), row('إجمالي الأيام', fmtN(days, 0)), row('بالأسابيع', fmtN(Math.floor(days / 7), 0) + ' أسبوعاً و ' + (days % 7) + ' أيام'),
        row('بالأشهر الميلادية الكاملة', fmtN(r.y * 12 + r.m, 0)), row('بالساعات تقريباً', fmtN(days * 24, 0)),
        row('عيد الميلاد القادم', C.iso(nb) === C.iso(z) ? 'اليوم' : 'بعد ' + C.diffDays(z, nb) + ' يوماً — ' + gname(nb)),
        row('يوم الميلاد كان', C.DN[a.getUTCDay()]), row('تاريخ الميلاد هجرياً', hname(a)));
    });
  };

  T.datediff = function (root) {
    var a = inp('date'), b = inp('date', C.iso(today())), inc = h('input', { type: 'checkbox' }), o = out();
    root.append(h('div', { class: 'grid2' }, field('من تاريخ', a), field('إلى تاريخ', b)), h('label', { class: 'chk' }, inc, ' احسب يوم النهاية أيضاً (+1 يوم)'), o);
    bind(root, [a, b, inc], function () {
      o.textContent = ''; var x = C.parseISO(a.value), y = C.parseISO(b.value);
      if (!x || !y) { o.append(note('أدخل التاريخين.')); return; }
      var s = x <= y ? x : y, e = x <= y ? y : x, days = C.diffDays(s, e) + (inc.checked ? 1 : 0), r = C.ymd(s, inc.checked ? C.addDays(e, 1) : e);
      o.append(h('div', { class: 'big', text: fmtN(days, 0) + ' يوم' }), row('بالسنين والأشهر والأيام', ymdTxt(r)), row('بالأسابيع', Math.floor(days / 7) + ' أسبوعاً و ' + (days % 7) + ' أيام'), row('بالساعات', fmtN(days * 24, 0)),
        row('الفرق بالأشهر الهجرية تقريباً', fmtN(days / 29.5306, 1) + ' شهراً'), x > y ? note('التاريخ الأول لاحق للثاني؛ حُسب الفرق بينهما بغضّ النظر عن الترتيب.') : null);
    });
  };

  T.hijri = function (root) {
    var g = inp('date', C.iso(today())), og = out();
    var hy = inp('number', C.toHijri(today()).y, { min: 1300, max: 1600 }), hm = sel(C.HM.map(function (m, i) { return [i + 1, m]; }), C.toHijri(today()).m), hd = inp('number', C.toHijri(today()).d, { min: 1, max: 30 }), oh = out();
    root.append(h('h3', { text: 'من ميلادي إلى هجري' }), field('التاريخ الميلادي', g), og, h('h3', { text: 'من هجري إلى ميلادي' }), h('div', { class: 'grid3' }, field('السنة الهجرية', hy), field('الشهر', hm), field('اليوم', hd)), oh,
      note('الحساب بتقويم أم القرى (المعتمد في السعودية). قد يختلف يوم بداية الشهر في مصر يوماً واحداً لأن دار الإفتاء تعتمد رؤية الهلال فعلياً.'));
    bind(root, [g], function () { og.textContent = ''; var d = C.parseISO(g.value); if (!d) { og.append(note('أدخل تاريخاً صحيحاً.')); return; } og.append(h('div', { class: 'big', text: hname(d) }), row('اليوم', C.DN[d.getUTCDay()]), row('الميلادي', gname(d))); });
    bind(root, [hy, hm, hd], function () {
      oh.textContent = ''; var y = parseInt(hy.value, 10), m = parseInt(hm.value, 10), d = parseInt(hd.value, 10);
      if (!(y >= 1300 && y <= 1600) || !(d >= 1)) { oh.append(note('أدخل سنة بين 1300 و1600 ويوماً صحيحاً.')); return; }
      if (!C.validHijri(y, m, d)) { oh.append(note('هذا اليوم غير موجود في ذلك الشهر (الشهر الهجري 29 أو 30 يوماً).')); return; }
      var r = C.fromHijri(y, m, d); oh.append(h('div', { class: 'big', text: gname(r) }), row('هجرياً', d + ' ' + C.HM[m - 1] + ' ' + y + ' هـ'));
    });
  };

  T.words = function (root) {
    var v = inp('text', '1250.50', { inputmode: 'decimal' }), cur = sel([['EGP', 'جنيه مصري'], ['SAR', 'ريال سعودي'], ['USD', 'دولار أمريكي'], ['AED', 'درهم إماراتي'], ['', 'رقم فقط (بدون عملة)']], 'EGP');
    var cs = sel([['0', 'مرفوع (جاء ... / فقط)'], ['1', 'منصوب أو مجرور (دفعتُ ... / بمبلغ ...)']], '1'), gd = sel([['m', 'مذكر'], ['f', 'مؤنث']], 'm'), o = out();
    var cp = h('button', { type: 'button', class: 'btn', text: 'نسخ النص' });
    root.append(h('div', { class: 'grid2' }, field('الرقم', v), field('العملة', cur)), h('div', { class: 'grid2' }, field('إعراب العدد', cs), field('جنس المعدود (عند اختيار بدون عملة)', gd)), o, cp);
    var last = '';
    cp.addEventListener('click', function () { if (last && navigator.clipboard) navigator.clipboard.writeText(last).then(function () { cp.textContent = 'تم النسخ'; setTimeout(function () { cp.textContent = 'نسخ النص'; }, 1400); }); });
    bind(root, [v, cur, cs, gd], function () {
      o.textContent = ''; last = ''; var n = num(v.value);
      if (isNaN(n) || n < 0) { o.append(note('أدخل رقماً موجباً.')); return; }
      var acc = cs.value === '1', t;
      if (cur.value) t = C.moneyWords(n, cur.value, acc);
      else { if (Math.floor(n) !== n) { o.append(note('بدون عملة يُقبل عدد صحيح فقط. اختر عملة لكتابة الكسور.')); return; } t = C.intWords(n, { fem: gd.value === 'f', acc: acc }); }
      if (!t) { o.append(note('الحد الأقصى أقل من تريليون (999,999,999,999).')); return; }
      last = t; o.append(h('div', { class: 'big words', text: t }), row('الرقم', fmtN(n, 2)));
    });
  };

  T.units = function (root) {
    var cat = sel(Object.keys(C.UNITS).map(function (k) { return [k, C.UNITS[k].name]; }), 'area'), v = inp('text', '1', { inputmode: 'decimal' }), f = sel([]), t = sel([]), o = out();
    function fill() { [f, t].forEach(function (s) { s.textContent = ''; C.UNITS[cat.value].u.forEach(function (u) { s.appendChild(h('option', { value: u[0], text: u[1] })); }); }); var u = C.UNITS[cat.value].u; f.value = u[cat.value === 'area' ? 6 : 0][0]; t.value = u[cat.value === 'area' ? 0 : 1][0]; }
    fill(); cat.addEventListener('change', function () { fill(); calc(); });
    root.append(field('نوع القياس', cat), h('div', { class: 'grid3' }, field('القيمة', v), field('من', f), field('إلى', t)), o);
    function calc() {
      o.textContent = ''; var x = num(v.value); if (isNaN(x)) { o.append(note('أدخل رقماً.')); return; }
      var r = C.convert(cat.value, f.value, t.value, x), nm = function (s) { return s.options[s.selectedIndex].text; };
      o.append(h('div', { class: 'big', text: fmtN(r, 6) + ' ' + nm(t) }), h('p', { class: 'sub', text: fmtN(x, 6) + ' ' + nm(f) + ' تساوي' }));
      var tb = h('table', { class: 'mini' }); C.UNITS[cat.value].u.forEach(function (u) { if (u[0] === f.value) return; tb.appendChild(h('tr', null, h('td', { text: u[1] }), h('td', { text: fmtN(C.convert(cat.value, f.value, u[0], x), 6) }))); });
      o.append(h('p', { class: 'sub', text: 'كل التحويلات من ' + nm(f) + ':' }), tb);
      if (cat.value === 'area' || cat.value === 'length' || cat.value === 'mass') o.append(note('الوحدات المصرية التقليدية (الفدان والقيراط والسهم والقصبة والذراع والرطل والقنطار) قيم معتمدة عرفياً وقد تختلف قليلاً بين المناطق. للتعاملات الرسمية اعتمد المساحة المسجّلة في العقد أو المساحة الرسمية.'));
    }
    bind(root, [v, f, t], calc);
  };

  T.percent = function (root) {
    var M = {
      of: ['كم يساوي X% من Y؟', 'النسبة X (%)', 'الرقم Y', function (a, b) { return fmtN(C.pct('of', a, b), 4); }],
      is: ['X تمثّل كم % من Y؟', 'الرقم X', 'الرقم Y', function (a, b) { return fmtN(C.pct('is', a, b), 4) + '%'; }],
      chg: ['نسبة التغيّر من X إلى Y', 'القيمة القديمة X', 'القيمة الجديدة Y', function (a, b) { return fmtN(C.pct('chg', a, b), 4) + '%'; }],
      add: ['إضافة X% إلى Y (مثل الضريبة)', 'النسبة X (%)', 'القيمة Y', function (a, b) { return fmtN(C.pct('add', a, b), 4); }],
      sub: ['خصم X% من Y', 'النسبة X (%)', 'القيمة Y', function (a, b) { return fmtN(C.pct('sub', a, b), 4); }],
      rev: ['القيمة قبل إضافة X% (الاستخراج العكسي)', 'النسبة X (%)', 'القيمة بعد الإضافة Y', function (a, b) { return fmtN(C.pct('rev', a, b), 4); }]
    };
    var mo = sel(Object.keys(M).map(function (k) { return [k, M[k][0]]; }), 'of'), a = inp('text', '15', { inputmode: 'decimal' }), b = inp('text', '200', { inputmode: 'decimal' }), o = out();
    var la = h('label'), lb = h('label'), fa = h('div', { class: 'fld' }, la, a), fb = h('div', { class: 'fld' }, lb, b); a.id = 'pa'; b.id = 'pb'; la.setAttribute('for', 'pa'); lb.setAttribute('for', 'pb');
    root.append(field('نوع الحساب', mo), h('div', { class: 'grid2' }, fa, fb), o);
    bind(root, [mo, a, b], function () {
      var m = M[mo.value]; la.textContent = m[1]; lb.textContent = m[2]; o.textContent = '';
      var x = num(a.value), y = num(b.value); if (isNaN(x) || isNaN(y)) { o.append(note('أدخل الرقمين.')); return; }
      var r = m[3](x, y); if (/NaN/.test(r)) { o.append(note('لا يمكن الحساب بهذه القيم (قسمة على صفر).')); return; }
      o.append(h('div', { class: 'big', text: r }));
      if (mo.value === 'add' || mo.value === 'sub' || mo.value === 'rev') o.append(row('مقدار التغيّر', fmtN(Math.abs(mo.value === 'rev' ? y - C.pct('rev', x, y) : C.pct(mo.value, x, y) - y), 4)));
    });
  };

  T.bizdays = function (root) {
    var mode = sel([['between', 'عدد أيام العمل بين تاريخين'], ['add', 'إضافة عدد من أيام العمل لتاريخ']], 'between'), a = inp('date', C.iso(today())), b = inp('date'), n = inp('number', '10'), wk = sel([['5,6', 'الجمعة والسبت (مصر)'], ['6,0', 'السبت والأحد'], ['5', 'الجمعة فقط']], '5,6'),
      hol = h('textarea', { rows: 2, placeholder: '2026-12-25, 2027-01-07' }), o = out();
    var fb = field('إلى تاريخ', b), fn = field('عدد أيام العمل (سالب للرجوع)', n);
    root.append(field('نوع الحساب', mode), h('div', { class: 'grid2' }, field('من تاريخ', a), fb, fn), field('عطلة نهاية الأسبوع', wk), field('إجازات رسمية إضافية (اختياري، بصيغة سنة-شهر-يوم وتفصل بينها فاصلة)', hol), o);
    bind(root, [mode, a, b, n, wk, hol], function () {
      fb.style.display = mode.value === 'between' ? '' : 'none'; fn.style.display = mode.value === 'add' ? '' : 'none'; o.textContent = '';
      var x = C.parseISO(a.value), w = wk.value.split(',').map(Number), hs = hol.value.split(/[,\n،\s]+/).filter(function (s) { return C.parseISO(s); });
      if (!x) { o.append(note('أدخل تاريخ البداية.')); return; }
      if (mode.value === 'between') { var y = C.parseISO(b.value); if (!y) { o.append(note('أدخل تاريخ النهاية.')); return; } var r = C.businessDays(x, y, w, hs); o.append(h('div', { class: 'big', text: fmtN(Math.abs(r), 0) + ' يوم عمل' }), row('إجمالي الأيام التقويمية', fmtN(Math.abs(C.diffDays(x, y)), 0)), note('يُحسب يوم البداية ولا يُحسب يوم النهاية.')); }
      else { var k = parseInt(n.value, 10); if (isNaN(k) || Math.abs(k) > 5000) { o.append(note('أدخل عدداً صحيحاً.')); return; } var z = C.addBusinessDays(x, k, w, hs); o.append(h('div', { class: 'big', text: gname(z) }), row('هجرياً', hname(z))); }
    });
  };

  T.timecalc = function (root) {
    var s = inp('time', '09:00'), e = inp('time', '17:30'), br = inp('number', '30', { min: 0 }), rate = inp('text', '', { inputmode: 'decimal', placeholder: 'اختياري' }), o = out();
    root.append(h('div', { class: 'grid2' }, field('وقت البدء', s), field('وقت الانتهاء', e)), h('div', { class: 'grid2' }, field('استراحة (دقيقة)', br), field('سعر الساعة', rate)), o);
    bind(root, [s, e, br, rate], function () {
      o.textContent = ''; var m = C.minutesBetween(s.value, e.value, parseInt(br.value, 10) || 0);
      if (m === null) { o.append(note('أدخل وقتين صحيحين (والاستراحة أقل من المدة).')); return; }
      var hh = Math.floor(m / 60), mm = m % 60, dec = m / 60, rt = num(rate.value);
      o.append(h('div', { class: 'big', text: hh + ' ساعة و ' + mm + ' دقيقة' }), row('بالساعات العشرية', fmtN(dec, 2)), row('بالدقائق', fmtN(m, 0)));
      if (!isNaN(rt)) o.append(row('الأجر عن اليوم', fmtN(dec * rt, 2)), row('لـ 22 يوم عمل', fmtN(dec * rt * 22, 2)));
      if (e.value <= s.value) o.append(note('وقت الانتهاء أقل من البدء، فاعتُبر أن الدوام يعبر منتصف الليل.'));
    });
  };

  T.textcount = function (root) {
    var t = h('textarea', { rows: 9, placeholder: 'الصق نصك هنا…' }), o = out();
    root.append(field('النص', t), o);
    bind(root, [t], function () {
      o.textContent = ''; var s = C.textStats(t.value);
      var g = h('div', { class: 'stats' }); [['كلمة', s.words], ['حرف (مع المسافات)', s.chars], ['حرف (بلا مسافات)', s.charsNoSpace], ['جملة', s.sentences], ['فقرة', s.paragraphs], ['تشكيل', s.diacritics]].forEach(function (p) { g.append(h('div', null, h('b', { text: fmtN(p[1], 0) }), h('span', { text: p[0] }))); });
      o.append(g, row('زمن القراءة تقريباً', s.words ? Math.max(1, Math.round(s.readMin)) + ' دقيقة (180 كلمة/دقيقة)' : '—'), row('زمن الإلقاء تقريباً', s.words ? Math.max(1, Math.round(s.speakMin)) + ' دقيقة (130 كلمة/دقيقة)' : '—'));
      if (s.top.length) o.append(h('p', { class: 'sub', text: 'الكلمات الأكثر تكراراً' }), h('p', { class: 'tags' }, s.top.map(function (k) { return h('span', { text: k[0] + ' × ' + k[1] }); })));
    });
  };

  T.countdown = function (root) {
    var ev = sel([['9-1', 'بداية رمضان'], ['10-1', 'عيد الفطر'], ['12-10', 'عيد الأضحى (10 ذو الحجة)'], ['1-1', 'رأس السنة الهجرية'], ['custom', 'تاريخ ميلادي أختاره']], '9-1'), c = inp('date'), o = out(), fc = field('التاريخ', c);
    root.append(field('الحدث', ev), fc, o);
    bind(root, [ev, c], function () {
      fc.style.display = ev.value === 'custom' ? '' : 'none'; o.textContent = ''; var td = today(), tgt, label = ev.options[ev.selectedIndex].text;
      if (ev.value === 'custom') { tgt = C.parseISO(c.value); if (!tgt) { o.append(note('اختر تاريخاً.')); return; } label = 'التاريخ المحدد'; } else { var p = ev.value.split('-'); tgt = C.nextHijriOccurrence(td, +p[0], +p[1]); }
      var d = C.diffDays(td, tgt), r = d >= 0 ? C.ymd(td, tgt) : null;
      o.append(h('div', { class: 'big', text: d === 0 ? 'هو اليوم' : d > 0 ? 'باقي ' + fmtN(d, 0) + ' يوماً' : 'مضى ' + fmtN(-d, 0) + ' يوماً' }), row(label, gname(tgt)), row('هجرياً', hname(tgt)), r ? row('أي', Math.floor(d / 7) + ' أسبوعاً و ' + (d % 7) + ' أيام') : null,
        ev.value !== 'custom' ? note('الموعد محسوب بتقويم أم القرى. الإعلان الرسمي في مصر يتبع رؤية الهلال فقد يتأخر يوماً.') : null);
    });
  };

  document.querySelectorAll('.tool[data-tool]').forEach(function (r) { var f = T[r.getAttribute('data-tool')]; if (f && !r.hasAttribute('data-ready')) { r.setAttribute('data-ready', '1'); try { f(r); } catch (e) { r.append(h('p', { class: 'note', text: 'تعذّر تحميل الأداة. حدّث الصفحة.' })); } } });

  /* تاريخ اليوم في الرئيسية والترويسة */
  var n = today(); document.querySelectorAll('[data-today="g"]').forEach(function (e) { e.textContent = gname(n); }); document.querySelectorAll('[data-today="h"]').forEach(function (e) { e.textContent = hname(n); });
  /* لوحة اليوم في الرئيسية */
  var pl = $('#plate'); if (pl) {
    var hj = C.toHijri(n);
    var cell = function (lab, day, mon, sub) { return h('div', null, h('small', { text: lab }), h('span', { class: 'd', text: String(day) }), h('span', { class: 'm' }, mon, h('span', { text: sub }))); };
    pl.append(cell('اليوم بالتقويم الميلادي', n.getUTCDate(), C.GM[n.getUTCMonth()] + ' ' + n.getUTCFullYear(), C.DN[n.getUTCDay()]), cell('اليوم بالتقويم الهجري (أم القرى)', hj.d, C.HM[hj.m - 1] + ' ' + hj.y, 'هـ'));
  }
  /* عينات حيّة في فهرس الأدوات */
  var S = { age: function () { return '36 سنة'; }, hijri: function () { return C.toHijri(n).y + ' هـ'; }, words: function () { return 'ألف ومائتان'; } };
  document.querySelectorAll('[data-sample]').forEach(function (e) { var f = S[e.getAttribute('data-sample')]; if (f && e.getAttribute('data-sample') === 'hijri') e.textContent = f(); });

  /* وضع الإضاءة */
  var tg = $('#theme-toggle'); if (tg) tg.addEventListener('click', function () { var d = document.documentElement.getAttribute('data-theme') === 'dark'; document.documentElement.setAttribute('data-theme', d ? 'light' : 'dark'); try { localStorage.setItem('dq-theme', d ? 'light' : 'dark'); } catch (e) { } });

  /* فهرس المقال + زمن القراءة */
  var post = $('.prose[data-toc]');
  if (post) {
    var hs = post.querySelectorAll('h2'), toc = $('#toc');
    if (toc && hs.length > 2) { var ul = h('ol'); hs.forEach(function (x, i) { x.id = x.id || 'h' + i; ul.append(h('li', null, h('a', { href: '#' + x.id, text: x.textContent }))); }); toc.append(h('b', { text: 'في هذه الصفحة' }), ul); toc.hidden = false; }
    var rt = $('#rt'); if (rt) rt.textContent = Math.max(1, Math.round((post.textContent.split(/\s+/).length) / 180)) + ' دقائق قراءة';
  }
})();
