#!/usr/bin/env python3
"""بوابة جاهزية BASIRA قبل أي نشر. للقراءة فقط: لا تغيّر بلوجر ولا تحذف محتوى.
الوضع العادي: الأخطاء تفشل والتحذيرات للعلم. الوضع الصارم (--strict أو BASIRA_RELEASE_STRICT=1): أي تحذير يفشل."""
import json, os, re, subprocess, sys, tempfile, shutil
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
site = json.loads((ROOT / "src/site.json").read_text(encoding="utf-8"))
strict = "--strict" in sys.argv or os.getenv("BASIRA_RELEASE_STRICT") == "1"
errors, warnings = [], []
def err(m): errors.append(m)
def warn(m): warnings.append(m)

# 1) البناء يعمل، وdist المرفوع يطابق ناتج البناء (لا dist قديم)
tmp = Path(tempfile.mkdtemp())
try:
    shutil.copytree(ROOT, tmp / "r", ignore=shutil.ignore_patterns(".git", "preview", "__pycache__"))
    r = subprocess.run([sys.executable, "scripts/build.py"], cwd=tmp / "r", capture_output=True, text=True)
    if r.returncode != 0:
        err("scripts/build.py failed: " + r.stderr.strip()[-300:])
    else:
        fresh = (tmp / "r/dist/theme.xml").read_text(encoding="utf-8")
        cur = ROOT / "dist/theme.xml"
        if not cur.is_file() or cur.read_text(encoding="utf-8") != fresh:
            err("dist/theme.xml is stale: run `python3 scripts/build.py` and commit the result.")
        for name in ("basira.css", "basira.js"):
            fresh_asset = tmp / "r/dist" / name
            current_asset = ROOT / "dist" / name
            if not fresh_asset.is_file() or not current_asset.is_file() or current_asset.read_bytes() != fresh_asset.read_bytes():
                err(f"dist/{name} is stale or missing.")
        for f in (tmp / "r/dist/pages").glob("*.html"):
            c = ROOT / "dist/pages" / f.name
            if not c.is_file() or c.read_text(encoding="utf-8") != f.read_text(encoding="utf-8"):
                err(f"dist/pages/{f.name} is stale or missing.")
finally:
    shutil.rmtree(tmp, ignore_errors=True)

theme_path = ROOT / "dist/theme.xml"
theme = theme_path.read_text(encoding="utf-8") if theme_path.is_file() else ""
try:
    ElementTree.fromstring(re.sub(r"<!DOCTYPE[^>]*>", "", theme, count=1).encode("utf-8"))
except Exception as e:
    err(f"Blogger theme XML is not well-formed: {e}")
for needle in ("<b:skin>", "type='Blog'", "id='Blog1'"):
    if needle not in theme:
        err(f"Theme is missing required Blogger element: {needle}")
if "{{" in theme:
    err("Unresolved template placeholder in dist/theme.xml")

# 2) الصفحات الأساسية
required_pages = {"about": "من نحن", "editorial-policy": "سياسة التحرير", "contact": "اتصل بنا",
                  "privacy-policy": "سياسة الخصوصية", "terms": "شروط الاستخدام"}
email = os.getenv("BASIRA_CONTACT_EMAIL") or site.get("contact_email", "")
email_ok = bool(re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email or ""))
for slug in required_pages:
    for base in ("src/pages", "dist/pages"):
        if not (ROOT / base / f"{slug}.html").is_file():
            err(f"Missing page: {base}/{slug}.html")
    built = ROOT / "dist/pages" / f"{slug}.html"
    if built.is_file():
        t = built.read_text(encoding="utf-8")
        if "{{" in t: err(f"Unresolved placeholder in dist/pages/{slug}.html")
        if "يُضاف البريد" in t: (err if strict else warn)(f"Contact email placeholder is still visible in {slug}.html")
        if len(re.sub(r"<[^>]+>", " ", t).split()) < 40: warn(f"Page {slug}.html is very short.")
if not email_ok:
    (err if strict else warn)("contact_email / BASIRA_CONTACT_EMAIL is missing or invalid; the contact page is not release-ready.")
_pages_txt = "".join(p.read_text(encoding="utf-8") for p in (ROOT / "dist/pages").glob("*.html"))
if re.search(r"(example\.(com|org)|test@|lorem ipsum|\bTODO\b|\bFIXME\b)", theme + _pages_txt, re.I):
    err("Unacceptable placeholder text (example.com / lorem / TODO ...) found in built output.")

# 3) ثمانية أقسام وخمس ألعاب حقيقية
topics, games = site.get("topics", []), site.get("games", [])
if len(topics) != 8: err(f"Expected 8 sections; found {len(topics)}.")
if len(games) != 32: err(f"Expected 32 games; found {len(games)}.")
bank = json.loads((ROOT / "src/data/bank.json").read_text(encoding="utf-8"))
if [t[0] for t in topics] != bank.get("topics"): err("Sections in site.json and bank.json differ.")
asset_js_path = ROOT / "dist/basira.js"
asset_js = asset_js_path.read_text(encoding="utf-8") if asset_js_path.is_file() else ""
for slug, name, *_ in games:
    pg = ROOT / "dist/pages" / f"game-{slug}.html"
    if not pg.is_file(): err(f"Missing game page dist/pages/game-{slug}.html"); continue
    if f"data-game='{slug}'" not in pg.read_text(encoding="utf-8"): err(f"game-{slug}.html has no interactive mount point.")
    if f"slug==='{slug}'" not in asset_js: err(f"Game engine for '{slug}' not found in dist/basira.js.")
    if f"data-g='{slug}'" not in theme: err(f"Home page has no playable entry for '{slug}'.")
for bad in ("نموذج تصميم", "قيد التنفيذ", "قريباً", "هذه صفحة نموذج", "inert='inert'"):
    blob = theme + "".join(p.read_text(encoding="utf-8") for p in (ROOT / "dist/pages").glob("*.html"))
    if re.search(r"(?<![\u0600-\u06FF])" + re.escape(bad), blob):
        err(f"Mockup/unfinished marker present in output: {bad}")
for k, need in (("mcq", 20), ("tf", 20), ("order", 8), ("word", 20), ("mem", 3)):
    if len(bank.get(k, [])) < need: err(f"Question bank '{k}' has {len(bank.get(k, []))} items (< {need}).")

arts = json.loads((ROOT / "content/articles/index.json").read_text(encoding="utf-8"))["articles"]
for t in topics:
    if not any(a["label"] == t[0] for a in arts): err(f"No article draft for section: {t[0]}")
for a in arts:
    if not (ROOT / "dist/articles" / a["file"]).is_file(): err(f"Built article missing: {a['file']}")
warn(f"{len(arts)} article drafts are AI-written and need owner review before publishing; none is published automatically.")

# 4) الروابط والمسارات
published = set(site.get("published", []))
for route in published:
    m = re.fullmatch(r"/p/([a-z0-9-]+)\.html", route)
    if not m or not (ROOT / "dist/pages" / f"{m.group(1)}.html").is_file():
        err(f"'published' lists a route with no source page: {route}")
for p in (ROOT / "dist/pages").glob("*.html"):
    for href in re.findall(r"href=[\"']([^\"']+)[\"']", p.read_text(encoding="utf-8")):
        if href.startswith("/p/") and not (ROOT / "dist/pages" / (href[3:])).is_file():
            err(f"Broken internal link in {p.name}: {href}")
page_urls = site.get("published_urls", {})
for slug in required_pages:
    route = page_urls.get(slug)
    if not route:
        (err if strict else warn)(f"Blogger page URL is not confirmed in src/site.json: {slug}")
    elif not re.fullmatch(r"/p/[a-z0-9_-]+\.html", route):
        err(f"Invalid verified Blogger page URL for {slug}: {route}")
for slug, *_ in games:
    if f"/p/game-{slug}.html" not in published:
        warn(f"Game page not yet confirmed published: /p/game-{slug}.html (the game still plays on the home page).")

# 5) الإعلانات والأسرار
scan = [p for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts and "preview" not in p.parts and p.suffix in {".html", ".xml", ".json", ".py", ".js", ".yml", ".md", ".css"}]
for p in scan:
    t = p.read_text(encoding="utf-8", errors="ignore")
    if re.search(r"ca-pub-\d{6,}|pagead2\.googlesyndication|adsbygoogle", t) and p.name != "release_preflight.py":
        err(f"AdSense publisher ID / ad code found in {p.relative_to(ROOT)} (not allowed before approval).")
    if re.search(r"(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_\-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY-----|ghp_[0-9A-Za-z]{36}|client_secret\"\s*:\s*\"[A-Za-z0-9_\-]{20,}\")", t):
        err(f"Possible secret in {p.relative_to(ROOT)}")

if errors:
    print("RELEASE PREFLIGHT: FAILED")
    for i in errors: print("ERROR:", i)
else:
    print("RELEASE PREFLIGHT: PASS" if strict else "BUILD PREFLIGHT: PASS")
for i in warnings: print("WARNING:", i)
sys.exit(1 if errors or (strict and warnings) else 0)
