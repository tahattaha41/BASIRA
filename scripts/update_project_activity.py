#!/usr/bin/env python3
"""Generate a branch-local Git activity report. Uses only the Python standard library."""
from datetime import datetime, timezone
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "PROJECT_ACTIVITY.md"

def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True, stderr=subprocess.DEVNULL).strip()

def main():
    branch = git("branch", "--show-current") or "(detached)"
    sha = git("rev-parse", "HEAD")
    rows = git("log", "-12", "--date=short", "--pretty=format:%h%x09%ad%x09%s").splitlines()
    lines = [
        "# سجل نشاط BASIRA",
        "",
        "> ملف مولّد آلياً من GitHub Actions. لا تعدّله يدوياً.",
        "",
        f"- وقت التوليد: {datetime.now(timezone.utc).isoformat(timespec='seconds')}",
        f"- الفرع: `{branch}`",
        f"- HEAD: `{sha}`",
        "",
        "## آخر 12 تغييراً",
        "",
        "| Commit | التاريخ | الوصف |",
        "|---|---|---|",
    ]
    for row in rows:
        parts = row.split("\t", 2)
        if len(parts) == 3:
            msg = parts[2].replace("|", "\\|")
            lines.append(f"| `{parts[0]}` | {parts[1]} | {msg} |")
    lines += [
        "",
        "## سياسة التحديث",
        "",
        "يُعاد توليد هذا السجل عند كل push. سجل النشاط لا يثبت وحده اكتمال الميزات؛ راجع [تقرير الحالة](PROJECT_STATUS.md) وأدلة الاختبارات وروابط Pull Requests.",
        "",
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines), encoding="utf-8")

if __name__ == "__main__":
    main()
