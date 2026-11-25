#!/usr/bin/env python3
"""مولّد أيقونات BASIRA ثلاثية الأبعاد (SVG متعدد الطبقات، بلا مكتبات).

كل أيقونة = ظل أرضي + جسم ممتد (عمق) + وجه بتدرج + لمعة + حافة مضيئة.
المخرجات: sprite واحد من <symbol> يُدرج مرة في القالب، ويُستعمل بـ <use href='#i3-NAME'>.
"""
import math

HUES = {  # (أعلى فاتح, أسفل غامق)
    'teal': ('#5EE0D0', '#0A6B65'), 'gold': ('#FBE7A8', '#B8862B'), 'violet': ('#C4B8FF', '#5B4BB0'),
    'rose': ('#FFA9C4', '#B0365F'), 'blue': ('#9AD7F8', '#2A6FA3'), 'amber': ('#FFC06E', '#C4561A'),
    'green': ('#9BE8B0', '#2E8B57'), 'navy': ('#3A5680', '#101827'), 'silver': ('#FFFFFF', '#B7C1CF'),
}


def _mix(a, b, t):
    ca = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    cb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return '#%02x%02x%02x' % tuple(round(x + (y - x) * t) for x, y in zip(ca, cb))


def defs():
    out = ["<linearGradient id='i3-gloss' x1='0' y1='0' x2='.8' y2='1'><stop offset='0' stop-color='#fff' stop-opacity='.65'/><stop offset='.45' stop-color='#fff' stop-opacity='.05'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></linearGradient>"]
    for n, (hi, lo) in HUES.items():
        dk = _mix(lo, '#000000', .38)
        out.append(f"<linearGradient id='i3g-{n}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='{hi}'/><stop offset='1' stop-color='{lo}'/></linearGradient>")
        out.append(f"<linearGradient id='i3d-{n}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='{lo}'/><stop offset='1' stop-color='{dk}'/></linearGradient>")
        out.append(f"<linearGradient id='i3l-{n}' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='{_mix(hi, '#ffffff', .35)}'/><stop offset='1' stop-color='{hi}'/></linearGradient>")
    return ''.join(out)


G = lambda h: f"url(#i3g-{h})"
D = lambda h: f"url(#i3d-{h})"
L = lambda h: f"url(#i3l-{h})"
RIM = "stroke='#fff' stroke-opacity='.4' stroke-width='1.2' stroke-linejoin='round'"


def shadow(cx=48, cy=88, rx=30, ry=5):
    return f"<ellipse cx='{cx}' cy='{cy}' rx='{rx}' ry='{ry}' fill='#000' opacity='.28'/>"


def ext(d, h, dy=5, extra=''):
    """جسم ممتد من مسار: عمق + وجه + لمعة."""
    return (f"<path d='{d}' fill='{D(h)}' transform='translate(0 {dy})' {extra}/>"
            f"<path d='{d}' fill='{G(h)}' {RIM} {extra}/>"
            f"<path d='{d}' fill='url(#i3-gloss)' {extra}/>")


def rrect(x, y, w, h, r):
    return (f"M{x + r} {y}H{x + w - r}A{r} {r} 0 0 1 {x + w} {y + r}V{y + h - r}A{r} {r} 0 0 1 {x + w - r} {y + h}"
            f"H{x + r}A{r} {r} 0 0 1 {x} {y + h - r}V{y + r}A{r} {r} 0 0 1 {x + r} {y}Z")


def disc(cx, cy, r, h, dy=5):
    return (f"<circle cx='{cx}' cy='{cy + dy}' r='{r}' fill='{D(h)}'/><circle cx='{cx}' cy='{cy}' r='{r}' fill='{G(h)}' {RIM}/>"
            f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='url(#i3-gloss)'/>")


def cube(x, y, w, h, d, hue):
    front = f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='3' fill='{G(hue)}' {RIM}/>"
    top = f"<path d='M{x} {y}L{x + d} {y - d}H{x + w + d}L{x + w} {y}Z' fill='{L(hue)}' {RIM}/>"
    side = f"<path d='M{x + w} {y}L{x + w + d} {y - d}V{y + h - d}L{x + w} {y + h}Z' fill='{D(hue)}' {RIM}/>"
    gloss = f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='3' fill='url(#i3-gloss)'/>"
    return side + top + front + gloss


def star(cx, cy, R, r=None):
    r = r or R * .45
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rad = R if i % 2 == 0 else r
        pts.append(f"{cx + rad * math.cos(a):.1f} {cy + rad * math.sin(a):.1f}")
    return 'M' + 'L'.join(pts) + 'Z'


def txt(x, y, s, size=26, fill='#fff'):
    return f"<text x='{x}' y='{y}' text-anchor='middle' font-family=\"'Noto Sans Arabic',Inter,sans-serif\" font-weight='700' font-size='{size}' fill='{fill}'>{s}</text>"


def check(cx, cy, s=1.0, col='#fff', w=7):
    return (f"<path d='M{cx - 12 * s} {cy}L{cx - 3 * s} {cy + 9 * s}L{cx + 13 * s} {cy - 10 * s}' fill='none' stroke='{col}' "
            f"stroke-width='{w * s}' stroke-linecap='round' stroke-linejoin='round'/>")


# ---------- الألعاب ----------
def i_mcq():
    s = shadow()
    for y, h in ((10, 'teal'), (34, 'gold'), (58, 'teal')):
        s += ext(rrect(10, y, 70, 20, 10), h, 5)
    s += check(26, 44, .55, '#101827', 7)
    s += f"<rect x='42' y='16' width='28' height='7' rx='3.5' fill='#fff' opacity='.55'/><rect x='42' y='64' width='22' height='7' rx='3.5' fill='#fff' opacity='.55'/>"
    return s


def i_tf():
    s = shadow()
    s += disc(34, 52, 26, 'green') + check(34, 53, .85, '#fff', 8)
    s += disc(62, 42, 26, 'rose')
    s += "<path d='M52 32L72 52M72 32L52 52' stroke='#fff' stroke-width='8' stroke-linecap='round'/>"
    return s


def i_order():
    s = shadow(50, 90, 36)
    s += cube(8, 60, 22, 22, 8, 'blue') + txt(19, 78, '1', 20)
    s += cube(34, 46, 22, 36, 8, 'violet') + txt(45, 72, '2', 22)
    s += cube(60, 30, 22, 52, 8, 'gold') + txt(71, 64, '3', 24, '#5a3d00')
    return s


def i_memory():
    s = shadow()
    s += f"<g transform='rotate(-12 36 50)'>{ext(rrect(14, 22, 44, 58, 8), 'rose', 5)}</g>"
    s += f"<g transform='rotate(10 60 48)'>{ext(rrect(40, 18, 44, 58, 8), 'violet', 5)}<path d='{star(62, 47, 14)}' fill='{G('gold')}' stroke='#fff' stroke-opacity='.6' stroke-width='1.2'/></g>"
    return s


def i_word():
    s = shadow(50, 88, 38)
    s += cube(6, 40, 22, 28, 8, 'teal') + txt(17, 62, '؟', 24)
    s += cube(34, 40, 22, 28, 8, 'gold') + txt(45, 62, 'ب', 26, '#5a3d00')
    s += cube(62, 40, 22, 28, 8, 'teal') + txt(73, 62, '؟', 24)
    s += f"<path d='{star(76, 22, 9)}' fill='{G('gold')}'/><path d='{star(20, 24, 6)}' fill='{G('gold')}' opacity='.8'/>"
    return s


# ---------- التقدم ----------
def i_trophy():
    s = shadow()
    s += "<path d='M30 22H18C18 38 24 44 33 46' fill='none' stroke='url(#i3d-gold)' stroke-width='6' stroke-linecap='round'/>"
    s += "<path d='M66 22H78C78 38 72 44 63 46' fill='none' stroke='url(#i3d-gold)' stroke-width='6' stroke-linecap='round'/>"
    s += ext("M28 12H68V34C68 52 60 60 48 60C36 60 28 52 28 34Z", 'gold', 4)
    s += ext(rrect(43, 60, 10, 14, 2), 'gold', 3) + ext(rrect(28, 74, 40, 12, 4), 'gold', 3)
    s += f"<path d='{star(48, 34, 12)}' fill='#fff' opacity='.85'/>"
    return s


def i_xp():
    s = shadow(48, 88, 28)
    s += ext(star(48, 46, 38, 17), 'gold', 6)
    s += f"<path d='{star(48, 46, 14, 6)}' fill='#fff' opacity='.5'/>"
    return s


def i_level():
    s = shadow()
    d = "M48 8L80 19V46C80 66 66 80 48 88C30 80 16 66 16 46V19Z"
    s += ext(d, 'teal', 5)
    s += f"<path d='{d}' transform='translate(48 47) scale(.78) translate(-48 -48)' fill='none' stroke='{G('gold')}' stroke-width='4'/>"
    s += f"<path d='{star(48, 46, 17)}' fill='{G('gold')}' stroke='#fff' stroke-opacity='.6' stroke-width='1.2'/>"
    return s


def i_flame():
    s = shadow(48, 89, 22)
    s += ext("M48 6C52 24 72 32 72 56C72 75 61 88 48 88C35 88 24 75 24 58C24 46 33 40 38 28C42 36 44 38 47 38C49 28 46 18 48 6Z", 'amber', 5)
    s += f"<path d='M48 48C53 58 60 62 60 72C60 80 55 84 48 84C41 84 36 80 36 72C36 62 45 58 48 48Z' fill='{L('gold')}'/>"
    return s


def i_gem():
    s = shadow(48, 89, 28)
    facets = [('20 36 36 16 44 36', 'l'), ('36 16 60 16 52 36 44 36', 'g'), ('60 16 76 36 52 36', 'l'),
              ('20 36 44 36 48 84', 'd'), ('44 36 52 36 48 84', 'g'), ('52 36 76 36 48 84', 'd')]
    s += "<path d='M20 41L36 21H60L76 41L48 89Z' fill='url(#i3d-teal)'/>"
    for pts, k in facets:
        s += f"<polygon points='{pts}' fill='{ {'l': L('teal'), 'g': G('teal'), 'd': D('teal')}[k] }' stroke='#fff' stroke-opacity='.45' stroke-width='1' stroke-linejoin='round'/>"
    s += "<polygon points='36 16 60 16 76 36 20 36' fill='url(#i3-gloss)'/>"
    return s


def i_target():
    s = shadow(48, 89, 32)
    s += disc(48, 46, 36, 'rose') + disc(48, 46, 26, 'silver', 0) + disc(48, 46, 17, 'rose', 0) + disc(48, 46, 8, 'gold', 0)
    s += f"<path d='M48 46L82 12' stroke='{D('gold')}' stroke-width='4' stroke-linecap='round'/><path d='M74 10L86 8L84 20Z' fill='{G('gold')}'/>"
    return s


# ---------- أقسام المعرفة ----------
def i_science():
    s = shadow()
    body = "M38 14H58V36L76 70C80 79 74 86 65 86H31C22 86 16 79 20 70L38 36Z"
    s += f"<path d='{body}' fill='{D('blue')}' transform='translate(0 4)'/><path d='{body}' fill='#cfeaff' fill-opacity='.55' {RIM}/>"
    s += f"<path d='M28 62H68L76 70C80 79 74 86 65 86H31C22 86 16 79 20 70Z' fill='{G('teal')}'/>"
    s += "<circle cx='42' cy='72' r='4' fill='#fff' opacity='.7'/><circle cx='56' cy='66' r='3' fill='#fff' opacity='.7'/><circle cx='50' cy='78' r='2.5' fill='#fff' opacity='.6'/>"
    s += ext(rrect(36, 8, 24, 9, 4), 'gold', 3)
    s += f"<path d='{body}' fill='url(#i3-gloss)'/>"
    return s


def i_history():
    s = shadow(48, 89, 30)
    s += ext(rrect(20, 10, 56, 12, 3), 'gold', 4)
    s += ext(rrect(30, 24, 36, 46, 2), 'gold', 4)
    s += "".join(f"<path d='M{x} 26V68' stroke='#8a6420' stroke-opacity='.45' stroke-width='2'/>" for x in (39, 48, 57))
    s += ext(rrect(20, 72, 56, 12, 3), 'gold', 4)
    return s


def i_geo():
    s = shadow(48, 89, 28)
    s += disc(48, 44, 36, 'blue')
    s += f"<path d='M30 30C38 24 46 28 44 36C42 44 32 42 28 48C24 42 24 34 30 30Z' fill='{G('green')}'/><path d='M54 40C62 34 72 40 70 50C68 60 58 64 54 58C50 52 50 44 54 40Z' fill='{G('green')}'/><path d='M40 62C46 60 50 66 46 72C42 74 36 70 40 62Z' fill='{G('green')}'/>"
    s += "<ellipse cx='48' cy='44' rx='14' ry='36' fill='none' stroke='#fff' stroke-opacity='.3' stroke-width='1.5'/><path d='M12 44H84' stroke='#fff' stroke-opacity='.3' stroke-width='1.5'/>"
    s += "<circle cx='48' cy='44' r='36' fill='url(#i3-gloss)'/>"
    return s


def i_tech():
    s = shadow(48, 89, 30)
    for i in range(4):
        p = 28 + i * 12
        s += f"<rect x='{p - 2}' y='10' width='5' height='10' rx='1.5' fill='{G('silver')}'/><rect x='{p - 2}' y='72' width='5' height='10' rx='1.5' fill='{G('silver')}'/>"
        s += f"<rect x='10' y='{p - 2}' width='10' height='5' rx='1.5' fill='{G('silver')}'/><rect x='72' y='{p - 2}' width='10' height='5' rx='1.5' fill='{G('silver')}'/>"
    s += ext(rrect(18, 18, 56, 56, 10), 'navy', 5) + ext(rrect(30, 30, 32, 32, 6), 'teal', 2)
    s += f"<path d='{star(46, 46, 9)}' fill='#fff' opacity='.85'/>"
    return s


def i_culture():
    s = shadow(48, 89, 34)
    s += ext("M8 22C24 16 40 18 48 28V80C40 70 24 68 8 74Z", 'rose', 5)
    s += ext("M88 22C72 16 56 18 48 28V80C56 70 72 68 88 74Z", 'violet', 5)
    s += "".join(f"<path d='M{x1} {y}Q{(x1 + x2) / 2} {y - 4} {x2} {y + 2}' stroke='#fff' stroke-opacity='.5' stroke-width='2' fill='none' stroke-linecap='round'/>" for x1, x2, y in ((14, 40, 38), (14, 40, 50), (56, 82, 38), (56, 82, 50)))
    return s


def i_logic():
    s = shadow(50, 89, 32)
    s += cube(12, 36, 44, 44, 16, 'violet')
    for cx, cy in ((22, 46), (46, 70), (34, 58), (22, 70), (46, 46)):
        s += f"<circle cx='{cx + 0}' cy='{cy}' r='3.6' fill='#fff'/>"
    s += "<circle cx='34' cy='28' r='3' fill='#fff' opacity='.9'/><circle cx='44' cy='22' r='3' fill='#fff' opacity='.9'/>"
    s += f"<path d='{star(76, 18, 9)}' fill='{G('gold')}'/>"
    return s


def i_language():
    s = shadow(48, 89, 30)
    s += ext(rrect(8, 12, 60, 44, 14) + "M20 56L18 74L36 56Z", 'blue', 5)
    s += txt(38, 46, 'ع', 34)
    s += ext(rrect(48, 40, 40, 32, 12) + "M74 72L80 86L66 72Z", 'gold', 5)
    s += txt(68, 66, 'A', 24, '#5a3d00')
    return s


def i_space():
    s = shadow(48, 89, 26)
    s += "<ellipse cx='48' cy='48' rx='42' ry='13' fill='none' stroke='url(#i3d-gold)' stroke-width='7' transform='rotate(-22 48 48)'/>"
    s += disc(48, 46, 26, 'amber', 4)
    s += "<ellipse cx='48' cy='48' rx='42' ry='13' fill='none' stroke='url(#i3g-gold)' stroke-width='6' transform='rotate(-22 48 48)' stroke-dasharray='62 200' stroke-dashoffset='-72'/>"
    s += f"<path d='{star(80, 18, 8)}' fill='{G('gold')}'/><path d='{star(14, 22, 5)}' fill='{G('silver')}'/>"
    return s


# ---------- ألعاب جديدة ----------
def i_math():
    s = shadow(48, 89, 30)
    s += ext(rrect(14, 8, 68, 78, 12), 'navy', 6)
    s += ext(rrect(22, 16, 52, 18, 5), 'teal', 2) + txt(48, 31, '٤٢', 15)
    for r, row in enumerate((('+', '\u2212', '\u00d7'), ('\u00f7', '=', '؟'))):
        for c, ch in enumerate(row):
            x = 22 + c * 18
            y = 42 + r * 20
            hue = 'gold' if ch in '=؟' else 'blue'
            s += ext(rrect(x, y, 15, 16, 4), hue, 2) + txt(x + 7.5, y + 12.5, ch, 12, '#101827' if hue == 'gold' else '#fff')
    return s


def i_pattern():
    s = shadow(48, 89, 32)
    xs = (8, 30, 52)
    for i, x in enumerate(xs):
        s += ext(rrect(x, 52 - i * 12, 20, 22 + i * 12, 6), ('blue', 'violet', 'teal')[i], 4)
    s += ext(rrect(74, 20, 18, 54, 6), 'gold', 4) + txt(83, 55, '؟', 22, '#5a3d00')
    s += "<path d='M12 36Q40 6 74 14' fill='none' stroke='#fff' stroke-opacity='.6' stroke-width='3' stroke-dasharray='2 6' stroke-linecap='round'/>"
    return s


def i_simon():
    s = shadow(48, 89, 30)
    pads = (('rose', 8, 10), ('blue', 50, 10), ('green', 8, 48), ('amber', 50, 48))
    for h, x, y in pads:
        s += ext(rrect(x, y, 38, 34, 12), h, 5)
    s += f"<circle cx='48' cy='45' r='10' fill='{G('navy')}' stroke='#fff' stroke-opacity='.4'/><path d='{star(48, 45, 6)}' fill='{G('gold')}'/>"
    return s


def i_blitz():
    s = shadow(48, 89, 28)
    s += disc(48, 50, 34, 'navy', 6)
    s += f"<circle cx='48' cy='50' r='27' fill='{G('silver')}'/>"
    s += "".join(f"<path d='M48 {26 + 0} V30' stroke='#101827' stroke-width='3' stroke-linecap='round' transform='rotate({a} 48 50)'/>" for a in range(0, 360, 30))
    s += f"<path d='M48 50L48 32' stroke='#101827' stroke-width='4' stroke-linecap='round'/><path d='M48 50L62 58' stroke='{D('rose')}' stroke-width='4' stroke-linecap='round'/>"
    s += ext(rrect(41, 8, 14, 8, 3), 'gold', 2)
    s += f"<path d='M70 6L58 26H68L62 40L80 20H70Z' fill='{G('gold')}' stroke='#fff' stroke-opacity='.7' stroke-width='1.2' stroke-linejoin='round'/>"
    return s


def i_survival():
    s = shadow(48, 89, 28)
    heart = "M48 84C20 64 10 48 10 34C10 22 19 14 30 14C38 14 44 18 48 25C52 18 58 14 66 14C77 14 86 22 86 34C86 48 76 64 48 84Z"
    s += ext(heart, 'rose', 6)
    s += f"<path d='M26 30C26 24 31 21 36 22' fill='none' stroke='#fff' stroke-opacity='.7' stroke-width='4' stroke-linecap='round'/>"
    s += f"<path d='M48 28V58M36 44H60' stroke='#fff' stroke-width='7' stroke-linecap='round' opacity='.9'/>"
    return s


ICONS = {
    'math': i_math, 'pattern': i_pattern, 'simon': i_simon, 'blitz': i_blitz, 'survival': i_survival,
    'mcq': i_mcq, 'truefalse': i_tf, 'order': i_order, 'memory': i_memory, 'word': i_word,
    'trophy': i_trophy, 'xp': i_xp, 'level': i_level, 'flame': i_flame, 'gem': i_gem, 'target': i_target,
    'science': i_science, 'history': i_history, 'geography': i_geo, 'technology': i_tech,
    'culture': i_culture, 'logic': i_logic, 'language': i_language, 'space': i_space,
}


def sprite():
    body = ''.join(f"<symbol id='i3-{n}' viewBox='0 0 96 96'>{fn()}</symbol>" for n, fn in ICONS.items())
    return f"<svg class='svg-defs' aria-hidden='true' focusable='false' xmlns='http://www.w3.org/2000/svg'><defs>{defs()}</defs>{body}</svg>"


def use(name, cls='i3'):
    return f"<svg class='{cls}' aria-hidden='true' focusable='false' viewBox='0 0 96 96'><use href='#i3-{name}'></use></svg>"


if __name__ == '__main__':
    print(len(sprite()), 'bytes')
