#!/usr/bin/env python3
"""اختبار المحتوى: ثمانية أقسام، 500 كلمة فأكثر، مصادر https، بلا تكرار، ولا ادعاءات نشر."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site = json.load(open(os.path.join(ROOT, 'src/site.json'), encoding='utf-8'))
idx = json.load(open(os.path.join(ROOT, 'content/articles/index.json'), encoding='utf-8'))
fails = []
def check(n, ok, d=''):
    print(('PASS ' if ok else 'FAIL ') + n + (' — ' + str(d) if not ok else ''))
    if not ok: fails.append(n)
topics = [t[0] for t in site['topics']]
arts = idx['articles']
check('كل قسم من الأقسام الثمانية له مقال واحد على الأقل', all(any(a['label'] == t for a in arts) for t in topics), [t for t in topics if not any(a['label'] == t for a in arts)])
check('لا تسميات خارج الأقسام الثمانية', all(a['label'] in topics for a in arts))
check('عناوين فريدة', len({a['title'] for a in arts}) == len(arts))
for a in arts:
    html = open(os.path.join(ROOT, 'content/articles', a['file']), encoding='utf-8').read()
    words = len(re.sub(r'<[^>]+>', ' ', html).split())
    check(f"{a['file']}: ≥ 500 كلمة ({words})", words >= 500)
    check(f"{a['file']}: مصدر https واحد على الأقل", a['sources'] and all(s['url'].startswith('https://') and s['title'] for s in a['sources']))
    check(f"{a['file']}: فيه عملية حسابية أو مثال محسوب", bool(re.search(r'[0-9٠-٩]+\s*[×÷+−=]\s*[0-9٠-٩]', html)))
    check(f"{a['file']}: بلا نص بديل أو علامات ناقصة", not re.search(r'(TODO|lorem|\[\.\.\.\]|XXX)', html, re.I))
check('المسودات غير مدرجة في published', not any('article' in p for p in site.get('published', [])))
# فحص الحسابات المذكورة
import math
v = lambda T: 331 * math.sqrt(1 + T / 273)
check('حساب سرعة الصوت 0/20 °م', round(v(0)) == 331 and round(v(20)) == 343)
check('زمن ضوء الشمس 8 دقائق و19 ثانية', divmod(round(149597870700 / 299792458), 60) == (8, 19))
check('الكبيسة: 97 في 400 سنة و365.2425', sum(1 for y in range(1, 401) if (y % 4 == 0 and y % 100) or y % 400 == 0) == 97 and (400 * 365 + 97) / 400 == 365.2425)
check('حجم 1920×1080×3 = 6,220,800', 1920 * 1080 * 3 == 6220800 and round(6220800 / 2**20, 2) == 5.93)
check('الثنائي 11001010 = 202 و101101 = 45', int('11001010', 2) == 202 and int('101101', 2) == 45)
check('جسور كونيغسبرغ: مجموع الدرجات 14 = 2×7', 5 + 3 + 3 + 3 == 14 == 2 * 7)
check('حجر رشيد: 1994 و23 سنة', 196 + 1799 - 1 == 1994 and 1822 - 1799 == 23)
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
