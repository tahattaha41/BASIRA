#!/usr/bin/env python3
"""Read-only check for the existing Blogger API connection. Never changes blog content."""
import json
import os
import sys
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

required = ("BLOGGER_CLIENT_ID", "BLOGGER_CLIENT_SECRET", "BLOGGER_REFRESH_TOKEN", "BLOGGER_BLOG_ID")
missing = [name for name in required if not os.environ.get(name)]
if missing:
    print("Blogger connection check skipped; missing GitHub Secrets: " + ", ".join(missing))
    sys.exit(0)

token_data = urlencode({
    "client_id": os.environ["BLOGGER_CLIENT_ID"],
    "client_secret": os.environ["BLOGGER_CLIENT_SECRET"],
    "refresh_token": os.environ["BLOGGER_REFRESH_TOKEN"],
    "grant_type": "refresh_token",
}).encode()
try:
    token_req = Request(
        "https://oauth2.googleapis.com/token",
        data=token_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urlopen(token_req, timeout=20) as response:
        token = json.loads(response.read().decode())["access_token"]

    blog_id = os.environ["BLOGGER_BLOG_ID"]
    blog_req = Request(
        "https://www.googleapis.com/blogger/v3/blogs/" + blog_id,
        headers={"Authorization": "Bearer " + token, "Accept": "application/json"},
    )
    with urlopen(blog_req, timeout=20) as response:
        blog = json.loads(response.read().decode())
    if str(blog.get("id")) != blog_id:
        raise RuntimeError("Blogger returned a different blog identifier")
    print("Blogger API connection verified (OAuth refresh + read-only blog lookup).")
except HTTPError as exc:
    # Do not print response bodies; they can contain account or configuration details.
    print("Blogger API check failed with HTTP status " + str(exc.code), file=sys.stderr)
    sys.exit(1)
except (URLError, KeyError, ValueError, TimeoutError, RuntimeError) as exc:
    print("Blogger API check failed: " + exc.__class__.__name__, file=sys.stderr)
    sys.exit(1)
