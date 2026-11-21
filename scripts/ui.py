"""مكوّنات الواجهة المولَّدة: رسوم SVG أصلية، بطاقات الألعاب، صفحات الألعاب."""
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
        act = (f"<a class='btn play' href='/p/game-{slug}.html'>{e(site['play_label'])}</a>" if pub else "<a class='btn play' href='/#games'>" + e(site['play_label']) + "</a>")
        out += (f"<li class='gcard g-{slug}'><div class='gc-top'>{glyph(slug)}{level_chip(lvl)}</div><h3>{e(name)}</h3><p>{e(desc)}</p>{act}</li>")
    return out


def game_page(site, slug):
    name, desc, lvl = next((g[1], g[2], g[3]) for g in site['games'] if g[0] == slug)
    about = GAME_ABOUT[slug]
    return (f"<div class='game-page'><div class='bsr-game' data-game='{slug}'><noscript><p>تحتاج هذه اللعبة إلى تفعيل JavaScript في المتصفح.</p></noscript></div>"
            f"<div class='game-about'><h2>عن «{e(name)}»</h2><p>{e(desc)}.</p><p>{e(about)}</p>"
            f"<p>جميع الأسئلة مراجَعة ومخزّنة مسبقاً داخل الموقع، ولا يستعين اللعب بأي ذكاء اصطناعي. تُحفظ نتائجك على جهازك فقط. <a href='/#games'>العودة إلى الألعاب</a></p></div></div>")

GAME_ABOUT = {
 'mcq': 'تتألف الجولة من عشرة أسئلة من أقسام المعرفة الثمانية، لكل سؤال أربع إجابات واحدة منها صحيحة. تُمنح 10 نقاط للسهل و15 للمتوسط و20 للصعب عن كل إجابة صحيحة، ويتطلب النجاح 70% فأكثر. في المستوى الصعب مؤقت قدره 20 ثانية لكل سؤال.',
 'truefalse': 'عشر جمل قصيرة تحكم على كل منها بأنها صحيحة أو خاطئة، ثم يوضح الموقع السبب. النقاط والنجاح كما في الاختبارات متعددة الخيارات، وفي المستوى الصعب مؤقت 20 ثانية.',
 'order': 'خمسة أسئلة ترتيب، تحرّك فيها العناصر بالأسهم ثم تتحقق مرة واحدة. تُمنح النقاط كاملة عند صحة الترتيب كله، ويعرض الموقع الترتيب الصحيح بعد التحقق.',
 'memory': 'لوحة بطاقات تتطابق أزواجها بين مفهوم وما يقابله، مثل دولة وعاصمتها. المستوى السهل أربعة أزواج، والمتوسط ستة، والصعب ستة بحد أقصى 14 محاولة وإلا خسرت. كلما قلّت محاولاتك زادت نقاطك.',
 'word': 'خمس كلمات مخفية في كل جولة، لكل منها تلميح. تضغط على الحروف لتكشف الكلمة، وكل حرف خاطئ يستهلك محاولة من المحاولات المسموحة. في المستوى الصعب يكلفك التلميح محاولة.',
}

def progress_block():
    return ("<div class='lvlcard'><div id='bsr-progress'><p>يحتاج عرض تقدّمك إلى JavaScript.</p></div></div>")


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
        more = (f"<a class='btn alt' href='/p/game-{slug}.html'>صفحة اللعبة</a>" if f'/p/game-{slug}.html' in pub else '')
        panes += (f"<div class='pane p-{slug}'><div class='pane-txt'><h3>{e(name)}</h3><p>{e(desc)}</p><div class='pane-meta'>{level_chip(lvl)}</div>{more}</div>"
                  f"<div class='pane-vis'><div class='bsr-game' data-game='{slug}'><noscript><p>تحتاج هذه اللعبة إلى تفعيل JavaScript.</p></noscript></div></div></div>")
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
