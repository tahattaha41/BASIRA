#!/usr/bin/env python3
"""يتحقق من تباين ألوان التصميم (WCAG) مباشرة من توكنز src/app.css في الوضعين الداكن والفاتح."""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
css = (ROOT / 'src/app.css').read_text(encoding='utf-8')
fails = 0
def check(ok, name, extra=''):
    global fails
    print(('ok   ' if ok else 'FAIL ') + name + (' ' + extra if extra else ''))
    if not ok: fails += 1
def block(sel):
    m = re.search(re.escape(sel) + r'\{(.*?)\}', css, re.S)
    return dict(re.findall(r'--([\w-]+):\s*(#[0-9A-Fa-f]{6})', m.group(1))) if m else {}
dark = block(':root'); light = {**dark, **block(':root[data-theme=light]')}
def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def cr(a, b):
    x, y = sorted([lum(a), lum(b)], reverse=True); return (x + .05) / (y + .05)
games = ['g-mcq', 'g-truefalse', 'g-order', 'g-memory', 'g-word', 'g-math', 'g-pattern', 'g-simon', 'g-blitz', 'g-survival', 'g-bubbles'] + ['g-%s' % s for s in 'stroop compare count schulte odd multiples digits stack rhythm merge opsign numline pathmem revdigits shades intruder battle lanes hopper moles lantern'.split()]
for name, t in (('dark', dark), ('light', light)):
    pairs = [('ink', 'bg', 7), ('ink', 'card', 7), ('mute', 'bg', 4.5), ('mute', 'card', 4.5), ('acc-t', 'bg', 4.5), ('acc-t', 'card', 4.5),
             ('acc-ink', 'acc', 4.5), ('ok', 'card', 4.5), ('bad', 'card', 4.5), ('teal-t', 'card', 4.5)]
    pairs += [(g, 'card', 4.5) for g in games] + [('on-g', g, 4.5) for g in games]
    for a, b, need in pairs:
        r = cr(t[a], t[b]); check(r >= need, f'{name}: {a} on {b} >= {need}', f'({r:.2f})')
check(light['acc-t'].lower() != light['gold'].lower() and cr(light['gold'], light['card']) < 4.5, 'light: gold is never used as small text (acc-t differs from gold)')
check(cr(dark['gold'], dark['bg']) >= 4.5, 'dark: gold on background has enough contrast')
check('--hero-bg' in css and css.count(':root{') >= 1, 'single token source present')
print('FAILED' if fails else 'ALL PASS'); sys.exit(1 if fails else 0)
