"""مكوّنات الواجهة المولَّدة: رسوم SVG أصلية، بطاقات الألعاب، نماذج شاشات اللعب (غير تفاعلية)."""
import html
e = html.escape

def svg(vb, body, cls='', label=None):
    a = f"role='img' aria-label='{e(label)}'" if label else "aria-hidden='true' focusable='false'"
    return f"<svg class='{cls}' viewBox='{vb}' {a} xmlns='http://www.w3.org/2000/svg'>{body}</svg>"

ICON = {  # أيقونات خطية 24px بسمك واحد
 'search': "<circle cx='11' cy='11' r='6.5'/><path d='M16 16l4.5 4.5'/>",
 'user': "<circle cx='12' cy='8.5' r='3.8'/><path d='M4.5 20c.8-4 3.6-6 7.5-6s6.7 2 7.5 6'/>",
 'menu': "<path d='M4 7h16M4 12h16M4 17h16'/>",
 'close': "<path d='M6 6l12 12M18 6L6 18'/>",
}
def icon(n):
    return f"<svg class='ic' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true' focusable='false'>{ICON[n]}</svg>"

GLYPH = {
 'mcq': "<rect x='6' y='8' width='36' height='8' rx='4' class='g-l'/><rect x='6' y='20' width='36' height='8' rx='4' class='g-f'/><path d='M12 24l3 3 5-6' class='g-w'/><rect x='6' y='32' width='36' height='8' rx='4' class='g-l'/>",
 'truefalse': "<circle cx='15' cy='24' r='10' class='g-f'/><path d='M10.5 24.5l3.2 3.2 6-6.5' class='g-w'/><circle cx='35' cy='24' r='10' class='g-l'/><path d='M31 20l8 8M39 20l-8 8' class='g-s'/>",
 'order': "<rect x='6' y='8' width='20' height='8' rx='4' class='g-f'/><rect x='14' y='20' width='20' height='8' rx='4' class='g-l'/><rect x='22' y='32' width='20' height='8' rx='4' class='g-l'/>",
 'memory': "<rect x='6' y='6' width='16' height='16' rx='5' class='g-f'/><rect x='26' y='6' width='16' height='16' rx='5' class='g-l'/><rect x='6' y='26' width='16' height='16' rx='5' class='g-l'/><rect x='26' y='26' width='16' height='16' rx='5' class='g-f'/>",
 'word': "<rect x='4' y='14' width='9' height='20' rx='3' class='g-f'/><rect x='15' y='14' width='9' height='20' rx='3' class='g-l'/><rect x='26' y='14' width='9' height='20' rx='3' class='g-f'/><rect x='37' y='14' width='9' height='20' rx='3' class='g-l'/>",
}
def glyph(k):
    return svg('0 0 48 48', GLYPH[k], 'glyph')

HERO = ("<rect x='12' y='12' width='336' height='276' rx='28' class='a-card'/>"
 "<rect x='130' y='44' width='190' height='10' rx='5' class='a-track'/><rect x='194' y='44' width='126' height='10' rx='5' class='a-acc'/>"
 "<rect x='70' y='76' width='250' height='12' rx='6' class='a-line'/><rect x='150' y='98' width='170' height='12' rx='6' class='a-line'/>"
 "<rect x='40' y='134' width='280' height='36' rx='12' class='a-opt'/><rect x='40' y='180' width='280' height='36' rx='12' class='a-ok'/>"
 "<path d='M276 198l8 8 14-16' class='a-chk'/><rect x='40' y='226' width='280' height='36' rx='12' class='a-opt'/>"
 "<circle cx='48' cy='42' r='24' class='a-play'/><g transform='translate(-264 0)'><path d='M312 28l4.2 8.6 9.5 1.4-6.9 6.7 1.6 9.4-8.4-4.4-8.4 4.4 1.6-9.4-6.9-6.7 9.5-1.4z' class='a-star'/></g>")

def hero_art():
    return svg('0 0 360 300', HERO, 'hero-art')

def level_chip(l):
    return f"<span class='lvl lvl-{ {'سهل':1,'متوسط':2,'صعب':3}[l] }'>{e(l)}</span>"

def game_cards(site):
    out = ''
    for slug, name, desc, lvl in site['games']:
        pub = f'/p/game-{slug}.html' in site.get('published', [])
        act = (f"<a class='btn play' href='/p/game-{slug}.html'>{e(site['play_label'])}</a>" if pub else "<span class='soon'>قريباً</span>")
        out += (f"<li class='gcard g-{slug}'><div class='gc-top'>{glyph(slug)}{level_chip(lvl)}</div><h3>{e(name)}</h3><p>{e(desc)}</p>{act}</li>")
    return out

# ---------- نماذج شاشات اللعب (inert) ----------
def head(n, total, timer=None):
    t = f"<span class='timer'>{timer}</span>" if timer else ''
    return (f"<div class='g-head'><div class='g-prog' role='presentation'><i style='width:{n*100//total}%'></i></div>"
            f"<div class='g-row'><span>السؤال {n} من {total}</span>{t}</div></div>")

def frame(title, inner):
    return f"<figure class='screen'><div class='phone' inert='inert' aria-hidden='true'>{inner}</div><figcaption>{e(title)}</figcaption></figure>"

def opts(items, state=None):
    s = ''
    for i, (t, st) in enumerate(items):
        mark = {'ok': "<b class='mk'>✓</b>", 'bad': "<b class='mk'>✕</b>"}.get(st, '')
        s += f"<div class='opt {st or ''}'><span class='ol'>{'أبجد'[i]}</span><span>{e(t)}</span>{mark}</div>"
    return f"<div class='opts'>{s}</div>"

def explain(ok, text):
    cls, ttl = ('ok', 'إجابة صحيحة') if ok else ('err', 'إجابة خاطئة')
    return f"<div class='msg {cls}'><b>{ttl}</b><p>{e(text)}</p></div><div class='cta'><span class='btn'>السؤال التالي</span></div>"

def endscreen(score, total, pts, extra=''):
    return (f"<div class='end'><div class='ring' style='--p:{score*100//total}'><b>{score}/{total}</b></div><h3>أحسنت</h3><p>حصلت على {pts} نقطة في هذه الجولة.</p>{extra}"
            f"<div class='lvlbar'><span>المستوى 2</span><div class='g-prog'><i style='width:62%'></i></div></div>"
            f"<div class='cta'><span class='btn play'>أعد اللعب</span><span class='btn alt'>راجع الإجابات</span></div></div>")

def model(slug):
    Q = 'ما أكبر كواكب المجموعة الشمسية؟'
    EX = 'المشتري هو الأكبر، وكتلته أكبر من كتلة بقية الكواكب مجتمعة.'
    if slug == 'mcq':
        o = [('زحل', ''), ('المشتري', ''), ('نبتون', ''), ('الأرض', '')]
        return [frame('سؤال', head(3, 10) + f"<h3 class='q'>{Q}</h3>" + opts(o)),
                frame('إجابة صحيحة وتفسير', head(3, 10) + f"<h3 class='q'>{Q}</h3>" + opts([('زحل', ''), ('المشتري', 'ok'), ('نبتون', ''), ('الأرض', '')]) + explain(True, EX)),
                frame('إجابة خاطئة', head(3, 10) + f"<h3 class='q'>{Q}</h3>" + opts([('زحل', 'bad'), ('المشتري', 'ok'), ('نبتون', ''), ('الأرض', '')]) + explain(False, EX)),
                frame('نهاية اللعبة', endscreen(8, 10, 80))]
    if slug == 'truefalse':
        S = 'يغلي الماء النقي عند 100 درجة مئوية عند مستوى سطح البحر.'
        tf = lambda a, b: f"<div class='tf'><div class='opt big {a}'>صح</div><div class='opt big {b}'>خطأ</div></div>"
        return [frame('سؤال بمؤقت', head(5, 20, '0:12') + f"<h3 class='q'>{S}</h3>" + tf('', '')),
                frame('إجابة صحيحة', head(5, 20, '0:12') + f"<h3 class='q'>{S}</h3>" + tf('ok', '') + explain(True, 'يتغير ذلك مع الارتفاع، إذ ينخفض الضغط فتنخفض درجة الغليان.')),
                frame('نهاية اللعبة', endscreen(16, 20, 160))]
    if slug == 'order':
        ev = ['سقوط جدار برلين', 'الثورة الفرنسية', 'أول إنسان على سطح القمر', 'اختراع الطباعة بالحروف المتحركة في أوروبا']
        def lst(states, nums=False):
            s = ''
            for i, (t, st) in enumerate(zip(ev, states)):
                s += f"<div class='row {st}'><span class='grip'>⋮⋮</span><span>{e(t)}</span><span class='num'>{(i + 1) if nums else ''}</span></div>"
            return f"<div class='rows'>{s}</div>"
        return [frame('رتّب من الأقدم إلى الأحدث', head(2, 8) + "<h3 class='q'>رتّب الأحداث من الأقدم إلى الأحدث</h3>" + lst(['', '', '', '']) + "<div class='cta'><span class='btn'>تحقق</span></div>"),
                frame('نتيجة التحقق', head(2, 8) + "<h3 class='q'>رتّب الأحداث من الأقدم إلى الأحدث</h3>" + lst(['bad', 'bad', 'ok', 'ok'], True) + explain(False, 'المطبعة (منتصف القرن 15) ثم الثورة الفرنسية 1789 ثم الهبوط على القمر 1969 ثم سقوط الجدار 1989.')),
                frame('نهاية اللعبة', endscreen(6, 8, 90))]
    if slug == 'memory':
        faces = ['ب', 'س', 'ن', 'م', 'ر', 'ج', 'ك', 'ل']
        def grid(flip, done):
            s = ''
            for i, f in enumerate(faces + faces[::-1]):
                st = 'done' if i in done else ('up' if i in flip else '')
                s += f"<div class='mc {st}'><span>{f if st else ''}</span></div>"
            return f"<div class='mgrid'>{s}</div>"
        stat = "<div class='g-row'><span>المحاولات 7</span><span class='timer'>0:48</span></div>"
        return [frame('بطاقتان مكشوفتان', "<div class='g-head'>" + stat + "</div>" + grid({1, 9}, {0, 15}) + "<div class='msg err'><b>غير متطابقتين</b><p>ستنقلبان تلقائياً.</p></div>"),
                frame('تطابق', "<div class='g-head'>" + stat + "</div>" + grid(set(), {0, 15, 2, 13}) + "<div class='msg ok'><b>تطابق</b><p>تبقّت 6 أزواج.</p></div>"),
                frame('نهاية اللعبة', endscreen(1, 1, 120, "<p class='sub'>أكملتها في 14 محاولة.</p>"))]
    if slug == 'word':
        def tiles(letters):
            return "<div class='tiles'>" + ''.join(f"<span class='tile {'on' if l else ''}'>{l}</span>" for l in letters) + '</div>'
        keys = lambda used: "<div class='keys'>" + ''.join(f"<span class='key {used.get(k, '')}'>{k}</span>" for k in 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي') + '</div>'
        hint = "<p class='hint'>تلميح: تجمع هائل من النجوم والغاز والغبار</p>"
        return [frame('لعبة جارية', "<div class='g-head'><div class='g-row'><span>المحاولات المتبقية 5</span><span class='timer'>0:40</span></div></div>" + hint + tiles(['م', '', 'ر', '']) + keys({'م': 'ok', 'ر': 'ok', 'ب': 'bad', 'س': 'bad'})),
                frame('إجابة صحيحة', "<div class='g-head'><div class='g-row'><span>المحاولات المتبقية 3</span></div></div>" + hint + tiles(['م', 'ج', 'ر', 'ة']) + "<div class='msg ok'><b>أحسنت: «مجرة»</b><p>المجرة تجمّع من النجوم والغاز والغبار تربطه الجاذبية.</p></div><div class='cta'><span class='btn'>الكلمة التالية</span></div>"),
                frame('نهاية اللعبة', endscreen(7, 10, 70))]

def model_page(site, slug):
    name = next(g[1] for g in site['games'] if g[0] == slug)
    lvl = next(g[3] for g in site['games'] if g[0] == slug)
    shots = ''.join(model(slug))
    return (f"<div class='board'><p class='lede'>هذه صفحة نموذج تصميم: لقطات ثابتة لشاشات «{e(name)}» (مستوى {e(lvl)}). اللعبة نفسها لم تُنفَّذ بعد، والعناصر داخل الإطارات غير تفاعلية عن قصد.</p>"
            f"<div class='screens'>{shots}</div><p><a href='/#games'>العودة إلى الألعاب</a></p></div>")

def progress_block():
    badge = lambda cls, t, g: f"<li class='badge {cls}'>{svg('0 0 48 48', g, 'bd')}<span>{t}</span></li>"
    star = "<path d='M24 6l5.2 10.6 11.8 1.7-8.5 8.3 2 11.7L24 32.8l-10.5 5.5 2-11.7L7 18.3l11.8-1.7z' class='b-f'/>"
    bolt = "<path d='M26 4L10 27h12l-2 17 16-23H24z' class='b-f'/>"
    flag = "<path d='M12 6v38' class='b-s'/><path d='M12 8h26l-6 9 6 9H12z' class='b-f'/>"
    lock = "<rect x='10' y='22' width='28' height='20' rx='6' class='b-l'/><path d='M16 22v-5a8 8 0 0116 0v5' class='b-s'/>"
    return ("<div class='prog'><div class='lvlcard'><div class='lv-top'><b>المستوى 3</b><span>240 من 400 نقطة</span></div><div class='g-prog big'><i style='width:60%'></i></div>"
            "<p>تبقّى 160 نقطة للمستوى الرابع.</p></div>"
            "<ul class='badges'>" + badge('earned', 'أول اختبار', star) + badge('earned', 'خمس إجابات متتالية', bolt) + badge('', 'مستكشف الأقسام', flag) + badge('locked', 'تحدٍّ أسبوعي', lock) + "</ul></div>"
            "<p class='note'>نموذج توضيحي. تعمل كل الألعاب بلا حساب، وإنشاء حساب اختياري لحفظ النقاط بين الأجهزة.</p>")


# ---------- التصميم التحريري الجديد ----------
def quiz_fallback(site):
    q = site['quiz'][0]
    o = ''.join(f"<button class='lo' type='button'><span class='ol'>{'أبجد'[i]}</span><span>{e(t)}</span></button>" for i, t in enumerate(q['o']))
    return f"<h2 class='live-q' id='lv-q'>{e(q['q'])}</h2><div class='live-o' id='lv-o'>{o}</div>"


def stage(site):
    gs = site['games']
    pub = site.get('published', [])
    inputs = ''.join(f"<input class='sr' type='radio' name='gm' id='gm-{g[0]}'{" checked='checked'" if i == 0 else ''}/>" for i, g in enumerate(gs))
    tabs = ''.join(f"<label class='tab' for='gm-{g[0]}'><span class='tn'>{i + 1:02d}</span><span class='tt'>{e(g[1])}</span>{level_chip(g[3])}</label>" for i, g in enumerate(gs))
    panes = ''
    for g in gs:
        slug, name, desc, lvl = g
        act = (f"<a class='btn play' href='/p/game-{slug}.html'>{e(site['play_label'])}</a>" if f'/p/game-{slug}.html' in pub else "<span class='soon'>قريباً</span>")
        panes += (f"<div class='pane p-{slug}'><div class='pane-txt'><h3>{e(name)}</h3><p>{e(desc)}</p><div class='pane-meta'>{level_chip(lvl)}<span class='tag'>قيد التنفيذ</span></div>{act}</div>"
                  f"<div class='pane-vis'>{model(slug)[0]}</div></div>")
    return f"<div class='stage-grid'>{inputs}<div class='tabs'>{tabs}</div><div class='panes'>{panes}</div></div>"


def stage_css(site):
    css = ''
    for g in site['games']:
        s = g[0]
        css += (f"#gm-{s}:checked~.tabs [for=gm-{s}]{{background:var(--paper);color:var(--ink);border-color:var(--paper)}}"
                f"#gm-{s}:checked~.tabs [for=gm-{s}] .tn{{color:var(--play)}}"
                f"#gm-{s}:checked~.panes .p-{s}{{display:grid}}"
                f"#gm-{s}:focus-visible~.tabs [for=gm-{s}]{{outline:3px solid var(--play-on-deep);outline-offset:2px}}\n")
    return css


def fahras(site):
    out = ''
    for i, (n, d) in enumerate(site['topics']):
        from urllib.parse import quote
        out += f"<li><a href='/search/label/{quote(n)}'><span class='fn'>{i + 1:02d}</span><span class='fb'><span class='ft'>{e(n)}</span><span class='fd'>{e(d)}</span></span><span class='fg' aria-hidden='true'>←</span></a></li>"
    return out


def method_block():
    items = [('مصدر لكل معلومة', 'كل رقم أو تاريخ في المقال مرتبط بمصدر يمكنك فتحه ومراجعته.'),
             ('تاريخ تحديث ظاهر', 'المعلومات التي تتغير تحمل تاريخ آخر مراجعة لها.'),
             ('مراجعة بشرية', 'لا يُنشر مقال ولا سؤال دون أن يراجعه إنسان.')]
    return ''.join(f"<li><span class='mn'>{i + 1}</span><h3>{e(t)}</h3><p>{e(p)}</p></li>" for i, (t, p) in enumerate(items))


# ---------- BASIRA brand identity ----------
def brand_lockup(site):
    """Inline, self-contained BASIRA lockup for Blogger's single-file theme."""
    mark = svg('0 0 48 48',
        "<path d='M7 24c4.8-8 10.5-12 17-12s12.2 4 17 12c-4.8 8-10.5 12-17 12S11.8 32 7 24z' class='bs-line'/><path d='M15 24c2.8-4.1 5.8-6.2 9-6.2s6.2 2.1 9 6.2c-2.8 4.1-5.8 6.2-9 6.2s-6.2-2.1-9-6.2z' class='bs-line'/><path d='M24 19l5 5-5 5-5-5z' class='bs-core'/><path d='M24 4v5M24 39v5M4 24h5M39 24h5' class='bs-ray'/>",
        'brand-symbol')
    ar = e(site.get('name_ar', 'بصيرة'))
    en = e(site.get('name', 'BASIRA'))
    return f"<span class='brand-lockup'>{mark}<span class='brand-names'><b>{en}</b><small>{ar}</small></span></span>"
