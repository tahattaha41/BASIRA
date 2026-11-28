import json, subprocess, sys, pathlib
from xml.dom import minidom
R = pathlib.Path(__file__).resolve().parent.parent; SJ = R / 'src/site.json'; orig = SJ.read_text(encoding='utf-8'); fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def build(): return subprocess.run([sys.executable, str(R / 'scripts/build.py')], capture_output=True, text=True, cwd=R)
try:
    check('googletagmanager' not in (R / 'dist/theme.xml').read_text(encoding='utf-8') or json.loads(orig).get('ga4_id'), 'no GA snippet when ga4_id is empty')
    d = json.loads(orig); d['ga4_id'] = 'G-TEST123456'; SJ.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf-8')
    r = build(); t = (R / 'dist/theme.xml').read_text(encoding='utf-8')
    check(r.returncode == 0 and 'G-TEST123456' in t and 'basira_internal' in t and "anonymize_ip" in t, 'snippet present with id, internal-exclusion flag and IP anonymisation')
    check("navigator.webdriver" in t and "file:" in t, 'snippet skips automated browsers (CI) and local files so tests never pollute real stats')
    minidom.parseString(t.encode('utf-8')); check(True, 'theme is still valid XML with the snippet')
    check('إحصاءات الزيارات' in (R / 'dist/pages/privacy-policy.html').read_text(encoding='utf-8'), 'privacy page discloses analytics when enabled')
    d['ga4_id'] = 'bad id'; SJ.write_text(json.dumps(d), encoding='utf-8'); check(build().returncode != 0, 'invalid ga4_id fails the build')
finally:
    SJ.write_text(orig, encoding='utf-8'); build()
print('\nFAILED: %d' % len(fails) if fails else '\nALL PASS'); sys.exit(1 if fails else 0)
