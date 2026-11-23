# BASIRA Phase 2 execution log

Last updated: 2026-11-23

This document records GitHub work only. It does not imply that any pull request has been merged or that Blogger has been changed.

## Scope and guardrails

- Repository: `tahattaha41/BASIRA`.
- Approved scope: phases A through E.
- Phase F (accounts, leaderboard, external backend/services) is excluded pending separate owner approval.
- No PR merge, Blogger theme upload, Blogger page publication, account creation, or external-service setup is authorized by this log.
- Admin and login files remain out of scope.

## Phase status

| Phase | PR | Current status | Evidence / limitations |
|---|---:|---|---|
| A — foundation | #17 | CI passed | Search, language switch, theme toggle, `data:view.isHomepage`, initial verification page. Blogger live rendering not tested; English articles/questions are not published. |
| C — game engine | #18 | CI passed | Timers, levels, streak scoring, 50:50 hint, ordering interaction, memory levels, daily challenge, local XP/achievements. No physical-device touch or Blogger test. |
| B — pages | #19 | CI passed | Responsive Blogger article cards, English verification-page draft, accurate About-page authorship statement. Blogger real-world behavior not tested. |
| D — friend challenge | #20 | CI passed | Shareable deterministic daily challenge URL and local score comparison. Not anti-cheat, not an official leaderboard, no server. |
| E — SEO/visuals/manifest | #21 | In progress | Dynamic OG/Twitter metadata, Article JSON-LD, lightweight manifest, original SVG topic illustrations and image provenance. First CI run failed only because the new SVG assertion expected the wrong quote style; assertion was corrected in a follow-up commit. Re-run must confirm green before calling E passed. |

## Verified workflow runs

- Phase B: [Run 45131282935](https://github.com/tahattaha41/BASIRA/actions/runs/45131282935) — success.
- Phase D: [Run 45131428587](https://github.com/tahattaha41/BASIRA/actions/runs/45131428587) — success.
- Phase E initial attempt: [Run 45131693440](https://github.com/tahattaha41/BASIRA/actions/runs/45131693440) — failed at `qa/test_theme.py` because the assertion expected single quotes around an SVG id while the source uses double quotes. Build, release preflight, and XML checks passed. The assertion was corrected; a new green run is still required.
- Blogger API connection checks were skipped because the required secrets were unavailable in the PR workflow. This is not a Blogger live test.

## Remaining work / limits

1. Confirm phase E CI is green after the SVG assertion correction.
2. Blogger live test remains blocked until the owner manually uploads the generated theme to a test blog and confirms the homepage, `?m=1`, labels, article pages, and static pages.
3. No paired English articles/posts exist yet, so hreflang alternates are intentionally not emitted.
4. English verification page is a draft artifact only; it is not added to Blogger's published-page allowlist.
5. Original SVG illustrations are provided for knowledge-section cards. Third-party article photographs remain absent until their source and license are reviewed and recorded.
6. The manifest is a lightweight install-metadata enhancement only. There is no service worker and no offline guarantee on Blogger.
7. Contact email remains unset; contact page publication remains blocked.
8. The existing article drafts remain drafts and require owner review before publication.

## Next acceptance checks

- Re-run all CI stages on the latest phase E head.
- Inspect the built XML and packaged artifact after CI.
- Keep all PRs open and unmerged until the owner reviews the diffs and authorizes a separate merge decision.
- Do not claim Blogger production readiness based on local CI.
