#!/usr/bin/env python3
"""BASIRA Blogger release preflight. Never changes Blogger or deletes content."""
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
site = json.loads((ROOT / "src/site.json").read_text(encoding="utf-8"))
strict = "--strict" in sys.argv or os.getenv("BASIRA_RELEASE_STRICT") == "1"
errors, warnings = [], []

required_pages = {
    "about": "من نحن",
    "editorial-policy": "سياسة التحرير",
    "contact": "اتصل بنا",
    "privacy-policy": "سياسة الخصوصية",
    "terms": "شروط الاستخدام",
}
for slug, title in required_pages.items():
    source = ROOT / "src/pages" / f"{slug}.html"
    built = ROOT / "dist/pages" / f"{slug}.html"
    if not source.is_file():
        errors.append(f"Missing source page: {source.relative_to(ROOT)}")
    if not built.is_file():
        errors.append(f"Missing built page: dist/pages/{slug}.html")
    elif "{{EMAIL}}" in built.read_text(encoding="utf-8"):
        errors.append(f"Unresolved email placeholder in {slug}.html")

email = os.getenv("BASIRA_CONTACT_EMAIL") or site.get("contact_email", "")
if not email or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
    (errors if strict else warnings).append(
        "BASIRA_CONTACT_EMAIL/contact_email is missing or invalid; contact page is not release-ready."
    )

topics = site.get("topics", [])
games = site.get("games", [])
if len(topics) != 8:
    errors.append(f"Expected exactly 8 approved knowledge sections; found {len(topics)}.")
if len(games) != 5:
    errors.append(f"Expected exactly 5 approved game concepts; found {len(games)}.")

published = set(site.get("published", []))
for slug in required_pages:
    route = f"/p/{slug}.html"
    if route not in published:
        (errors if strict else warnings).append(
            f"Blogger page route is not confirmed published in src/site.json: {route}"
        )

for slug, *_ in games:
    route = f"/p/game-{slug}.html"
    if route in published:
        warnings.append(
            f"{route} is marked published; verify the page is genuinely interactive, not a static mockup."
        )

if errors:
    print("RELEASE PREFLIGHT: FAILED")
    for item in errors:
        print(f"ERROR: {item}")
else:
    print("RELEASE PREFLIGHT: PASS" if strict else "BUILD PREFLIGHT: PASS")
for item in warnings:
    print(f"WARNING: {item}")

if errors or (strict and warnings):
    sys.exit(1)
