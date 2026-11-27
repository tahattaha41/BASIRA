#!/usr/bin/env python3
"""نشر مقالات content/articles كمنشورات بلوجر (posts.insert) بتصنيفها. لا يحذف شيئاً.
يتطلب نفس أسرار الصفحات: BLOGGER_BLOG_ID, BLOGGER_CLIENT_ID, BLOGGER_CLIENT_SECRET, BLOGGER_REFRESH_TOKEN.
الأوضاع: plan (افتراضي، بلا اتصال) | apply --confirm  (يُنشئ المفقود فقط؛ --update يحدّث نص الموجود بنفس العنوان).
شرط النشر: المقال في index.json وفيه sources غير فارغة وعدد كلماته >= 500 ولا يحوي نصاً بديلاً."""
import json, os, re, sys, time, urllib.error
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import blogger_pages as bp

ROOT = bp.ROOT
POSTS = "https://blogger.googleapis.com/v3/blogs/{blog}/posts"

def wanted():
    idx = json.loads((ROOT / "content/articles/index.json").read_text(encoding="utf-8"))
    out = []
    for a in idx["articles"]:
        f = ROOT / "dist/articles" / a["file"]
        if not f.is_file(): raise SystemExit(f"missing built article {f}; run scripts/build.py")
        html = f.read_text(encoding="utf-8")
        words = len(re.sub(r"<[^>]+>", " ", html).split())
        if not a.get("sources"): print(f"[skip] {a['file']}: بلا مصادر"); continue
        if words < 500: print(f"[skip] {a['file']}: {words} كلمة (<500)"); continue
        if "يُضاف" in html or "TODO" in html: print(f"[skip] {a['file']}: نص بديل"); continue
        out.append((a["title"], a["label"], html))
    return out

def retrying(fn, tries=6, base=5, sleep=time.sleep):
    """يعيد المحاولة عند 429/5xx مع تأخير تصاعدي (يحترم Retry-After)."""
    def w(*a, **k):
        for i in range(tries):
            try: return fn(*a, **k)
            except urllib.error.HTTPError as ex:
                if ex.code not in (429, 500, 502, 503, 504) or i == tries - 1: raise
                ra = ex.headers.get("Retry-After") if ex.headers else None
                d = int(ra) if ra and ra.isdigit() else base * 2 ** i
                print(f"[retry] HTTP {ex.code}، انتظار {d}ث"); sleep(min(d, 120))
    return w

def run(mode="plan", confirm=False, update=False, _http=bp.http, _sleep=time.sleep):
    posts = wanted()
    _http = retrying(_http, sleep=_sleep)
    if mode == "plan":
        for t, l, h in posts: print(f"[plan] '{t}' [{l}] ({len(h)} chars)")
        print("[plan] لم يُرسل شيء."); return 0
    if not confirm: print("apply يتطلب --confirm."); return 2
    e = os.environ; cid = e.get("BLOGGER_CLIENT_ID") or e.get("GOOGLE_CLIENT_ID"); sec = e.get("BLOGGER_CLIENT_SECRET") or e.get("GOOGLE_CLIENT_SECRET"); rt = e.get("BLOGGER_REFRESH_TOKEN") or e.get("GOOGLE_REFRESH_TOKEN")
    if not (e.get("BLOGGER_BLOG_ID") and cid and sec and rt): print("متغيرات ناقصة"); return 2
    tok = _http("POST", bp.TOKEN_URL, form={"client_id": cid, "client_secret": sec, "refresh_token": rt, "grant_type": "refresh_token"})["access_token"]
    base = POSTS.format(blog=e["BLOGGER_BLOG_ID"])
    existing = {p["title"]: p for p in _http("GET", base + "?fetchBodies=false&maxResults=500&status=live&status=draft", token=tok).get("items", [])}
    for t, l, h in posts:
        if _sleep is time.sleep: time.sleep(3)
        if t in existing:
            if update:
                r = _http("PATCH", f"{base}/{existing[t]['id']}", token=tok, body={"title": t, "content": h, "labels": [l]}); print(f"[updated] {t} -> {r.get('url')}")
            else: print(f"[skip] {t}: موجود")
        else:
            r = _http("POST", base, token=tok, body={"kind": "blogger#post", "title": t, "content": h, "labels": [l]}); print(f"[created] {t} -> {r.get('url')}")
    return 0

if __name__ == "__main__":
    a = sys.argv[1:]
    sys.exit(run("apply" if "apply" in a else "plan", "--confirm" in a, "--update" in a))
