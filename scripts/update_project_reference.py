#!/usr/bin/env python3
"""Refresh repository activity and append/update GitHub issue requests."""
from __future__ import annotations
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ACTIVITY = ROOT / "docs" / "PROJECT_ACTIVITY.md"
REQUESTS = ROOT / "docs" / "REQUEST_LOG.md"


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def refresh_activity() -> None:
    sha = git("rev-parse", "HEAD")
    short = sha[:12]
    subject = git("log", "-1", "--pretty=%s")
    stamp = git("log", "-1", "--date=iso-strict", "--pretty=%cI")
    branch = os.environ.get("GITHUB_REF_NAME", "unknown")
    changed = git("diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD")
    paths = [p for p in changed.splitlines() if p]
    lines = [
        "# نشاط المستودع — تحديث آلي",
        "",
        f"- **الفرع:** {branch}",
        f"- **آخر commit:** {short}",
        f"- **التاريخ:** {stamp}",
        f"- **الرسالة:** {subject}",
        f"- **وقت تحديث التقرير:** {datetime.now(timezone.utc).isoformat()}",
        "",
        "## الملفات التي تغيرت في آخر commit",
        "",
    ]
    lines += [f"- {p}" for p in paths] if paths else ["- لا توجد مسارات تغيّرت (commit دمج أو تشغيل يدوي)."]
    lines += [
        "",
        "## مصدر الحالة",
        "",
        "- المتطلبات والقرارات: docs/PROJECT_REFERENCE.md وdocs/DECISIONS.md.",
        "- حالة الإنجاز: docs/STATUS.md.",
        "- الطلبات: docs/REQUEST_LOG.md.",
        "- هذا التقرير آلي ويصف نشاط Git فقط؛ لا يعلن اكتمال ميزة لمجرد وجود commit.",
        "",
    ]
    ACTIVITY.write_text("\n".join(lines), encoding="utf-8")


def append_issue(event_path: str | None) -> None:
    if not event_path:
        return
    event_file = Path(event_path)
    if not event_file.exists():
        return
    event = json.loads(event_file.read_text(encoding="utf-8"))
    issue = event.get("issue") or {}
    if not issue or "pull_request" in issue:
        return
    number = issue.get("number")
    title = (issue.get("title") or "طلب بلا عنوان").replace("|", "\\|").replace("\n", " ")
    url = issue.get("html_url", "")
    state = issue.get("state", "open")
    action = os.environ.get("GITHUB_EVENT_NAME", "issue")
    marker = f"GitHub Issue #{number} ("
    old_lines = REQUESTS.read_text(encoding="utf-8").splitlines()
    row = f"| {datetime.now(timezone.utc).date().isoformat()} | GitHub Issue #{number} ({action}) — {url} | {title} | {state} — يحتاج فرزًا | لم يُنفذ بعد |"
    found = False
    for index, line in enumerate(old_lines):
        if marker in line:
            old_lines[index] = row
            found = True
            break
    if not found:
        old_lines.append(row)
    REQUESTS.write_text("\n".join(old_lines).rstrip() + "\n", encoding="utf-8")


if __name__ == "__main__":
    append_issue(os.environ.get("GITHUB_EVENT_PATH"))
    refresh_activity()
