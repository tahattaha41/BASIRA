#!/usr/bin/env python3
"""نشر/تحديث «صفحات» بلوجر عبر Blogger API v3 (pages.insert / pages.patch). لا يرفع القالب أبداً:
الواجهة الرسمية لا تحتوي أي مورد للقوالب، فرفع dist/theme.xml يدوي من لوحة بلوجر.

الأوضاع:
  plan   (الافتراضي) يطبع ما سيحدث، بلا أي اتصال.
  --with-games ينشر صفحات الألعاب أيضاً (لا تفعل قبل رفع القالب الجديد، فهي تعتمد على جافاسكريبت القالب).
  apply  يتصل ببلوجر؛ يتطلب --confirm ومتغيرات بيئة: BLOGGER_BLOG_ID, BLOGGER_CLIENT_ID,
         BLOGGER_CLIENT_SECRET, BLOGGER_REFRESH_TOKEN (من أسرار GitHub، لا كلمة مرور جوجل أبداً).
         ينشئ الصفحات المفقودة فقط. أضف --update لتحديث محتوى صفحات موجودة بنفس العنوان. لا يحذف شيئاً.
ملاحظة: رابط الصفحة يولّده بلوجر من العنوان؛ تحقق من الرابط الفعلي ثم أضفه إلى "published" في src/site.json."""
import json, os, sys, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = "https://blogger.googleapis.com/v3/blogs/{blog}/pages"
TOKEN_URL = "https://oauth2.googleapis.com/token"
TITLES = {"about": "من نحن", "editorial-policy": "سياسة التحرير", "contact": "اتصل بنا",
          "privacy-policy": "سياسة الخصوصية", "terms": "شروط الاستخدام"}

PLACEHOLDER = "يُضاف البريد"

def wanted(with_games=False):
    site = json.loads((ROOT / "src/site.json").read_text(encoding="utf-8"))
    items = [(s, t) for s, t in TITLES.items()]
    if with_games: items += [(f"game-{g[0]}", g[1]) for g in site["games"]]
    out = []
    for slug, title in items:
        f = ROOT / "dist/pages" / f"{slug}.html"
        if not f.is_file(): raise SystemExit(f"missing built page {f}; run scripts/build.py")
        html = f.read_text(encoding="utf-8")
        if PLACEHOLDER in html:
            print(f"[skip] {slug}: يحتوي نصاً بديلاً (بريد التواصل ناقص)؛ لا يُنشر."); continue
        out.append((slug, title, html))
    return site, out

def http(method, url, token=None, body=None, form=None):
    data = None; headers = {}
    if body is not None: data = json.dumps(body).encode(); headers["Content-Type"] = "application/json"
    if form is not None: data = urllib.parse.urlencode(form).encode()
    if token: headers["Authorization"] = "Bearer " + token
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode() or "{}")

def run(mode="plan", confirm=False, update=False, with_games=False, _http=http):
    site, pages = wanted(with_games)
    if site.get("contact_email", "") == "" and not os.getenv("BASIRA_CONTACT_EMAIL"):
        print("تحذير: لا يوجد بريد تواصل؛ صفحة اتصل بنا ستحمل نص البريد البديل. لا تنشرها قبل إضافته.")
    if mode == "plan":
        for slug, title, html in pages: print(f"[plan] {slug}: '{title}' ({len(html)} chars)")
        print("[plan] لم يُرسل شيء إلى بلوجر."); return 0
    if not confirm: print("apply يتطلب --confirm صريحاً."); return 2
    cid, sec, rt = (os.getenv("BLOGGER_CLIENT_ID") or os.getenv("GOOGLE_CLIENT_ID"), os.getenv("BLOGGER_CLIENT_SECRET") or os.getenv("GOOGLE_CLIENT_SECRET"),
                    os.getenv("BLOGGER_REFRESH_TOKEN") or os.getenv("GOOGLE_REFRESH_TOKEN"))
    miss = [n for n, v in (("BLOGGER_BLOG_ID", os.getenv("BLOGGER_BLOG_ID")), ("BLOGGER_CLIENT_ID", cid), ("BLOGGER_CLIENT_SECRET", sec), ("BLOGGER_REFRESH_TOKEN", rt)) if not v]
    if miss: print("متغيرات ناقصة:", ", ".join(miss)); return 2
    tok = _http("POST", TOKEN_URL, form={"client_id": cid, "client_secret": sec, "refresh_token": rt, "grant_type": "refresh_token"})["access_token"]
    base = API.format(blog=os.environ["BLOGGER_BLOG_ID"])
    existing = {p["title"]: p for p in _http("GET", base + "?fetchBodies=false&maxResults=100", token=tok).get("items", [])}
    for slug, title, html in pages:
        if title in existing:
            if update:
                r = _http("PATCH", f"{base}/{existing[title]['id']}", token=tok, body={"title": title, "content": html})
                print(f"[updated] {slug} -> {r.get('url')}")
            else:
                print(f"[skip] {slug}: صفحة بنفس العنوان موجودة ({existing[title].get('url')}); استخدم --update لتحديثها.")
        else:
            r = _http("POST", base, token=tok, body={"kind": "blogger#page", "title": title, "content": html})
            print(f"[created] {slug} -> {r.get('url')}")
    print("راجع الروابط الفعلية وحدّث published في src/site.json."); return 0

if __name__ == "__main__":
    a = sys.argv[1:]
    mode = "apply" if "apply" in a else "plan"
    sys.exit(run(mode, "--confirm" in a, "--update" in a, "--with-games" in a))
