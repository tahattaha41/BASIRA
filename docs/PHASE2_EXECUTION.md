# BASIRA Phase 2 execution log

Last updated: 2026-11-23

This document records the verified GitHub state. A merge into `main` does not mean the Blogger site has been updated or tested live.

## Scope and guardrails

- Repository: `tahattaha41/BASIRA`.
- Approved implementation scope: phases A through E.
- Phase F (accounts, official leaderboard, external backend/services) remains excluded pending separate approval.
- PRs #13 and #17–#21 have been merged into `main`.
- No Blogger theme upload or page publication was performed.
- Admin and login functionality remain out of scope.

## Merge record

| PR | Scope | Result | Merge commit |
|---:|---|---|---|
| #13 | Core rebuild | Merged | `1c2d6c1b0790776e6bae7a7c237c38dcab13e6f9` |
| #17 | A — foundation | Merged | `c7a8b42450cca7d3dd4379b79e5ad3750bedca2e` |
| #18 | C — game engine | Merged | `cf41af13fe483f9357b9a5bd2c9b4f9527ee0c86` |
| #19 | B — pages | Merged | `22004b562d73b793ab8296c7d79182528d8cf53c` |
| #20 | D — friend challenge | Merged | `189b02c21476da34d41d50570e00e520703d2eeb` |
| #21 | E — SEO, visuals, manifest | Merged | `e8958742eb7ea9a9514155dd9cb287ee2b1a0de7` |

All six PRs are closed as merged. The current `main` HEAD at the time of this update is `e8958742eb7ea9a9514155dd9cb287ee2b1a0de7`.

## Phase status

| Phase | Status in main | Evidence and remaining limitations |
|---|---|---|
| A — foundation | Merged; PR CI passed | `data:view.isHomepage`, header, search, language toggle, theme toggle, verification page. Blogger live rendering remains untested. |
| B — pages | Merged; PR CI passed | Article cards, featured-article behavior, English verification-page draft, corrected About-page authorship statement. Blogger rendering and actual published-post data remain untested. |
| C — game engine | Merged; PR CI passed | Levels, timers, streaks, 50:50 hint, ordering interaction, memory levels, daily challenge, local XP and achievements. Physical touch-device testing and performance on a mid-range phone remain untested. |
| D — friend challenge | Merged; PR CI passed | Shareable deterministic challenge URL and local result comparison. This is not anti-cheat and is not an official leaderboard. |
| E — SEO/visuals/manifest | Merged; corrected PR CI passed | Dynamic OG/Twitter metadata, Article JSON-LD, lightweight manifest, original SVG topic illustrations and image provenance file. No service worker or offline guarantee. |

## Verified PR workflow runs

- PR #13: [Run 45053051032](https://github.com/tahattaha41/BASIRA/actions/runs/45053051032) — success.
- PR #17: [Run 45089252966](https://github.com/tahattaha41/BASIRA/actions/runs/45089252966) — success.
- PR #18: [Run 45128265736](https://github.com/tahattaha41/BASIRA/actions/runs/45128265736) — success.
- PR #19: [Run 45131282935](https://github.com/tahattaha41/BASIRA/actions/runs/45131282935) — success.
- PR #20: [Run 45131428587](https://github.com/tahattaha41/BASIRA/actions/runs/45131428587) — success.
- PR #21: [Run 45131807393](https://github.com/tahattaha41/BASIRA/actions/runs/45131807393) — success.

The first phase E attempt [Run 45131693440](https://github.com/tahattaha41/BASIRA/actions/runs/45131693440) failed because an SVG test expected single quotes while the source used double quotes. The assertion was corrected, and the subsequent PR run succeeded.

## Main-branch validation

- The merge sequence triggered push workflows on `main`.
- Latest observed main workflow: [Run 45132674901](https://github.com/tahattaha41/BASIRA/actions/runs/45132674901).
- At the time of this document update, build, release preflight, static theme tests, content tests, and publish-path tests had passed. Browser dependency installation was still running; UI/game tests had not yet completed. Do not report the main-branch run as fully green until its final conclusion is success.

## Remaining work / limits

1. Confirm the final result of the latest `main` CI run.
2. Test the built theme on a real Blogger test blog, including homepage, `?m=1`, labels, article pages, and static pages.
3. Test drag-and-drop with actual touch input on a phone; current automated checks do not replace physical-device testing.
4. Review the question bank for balance and verify sources/explanations for any new questions.
5. Review the eight article drafts before publication. They must remain drafts until owner review.
6. English article/question content is not ready for publication. No hreflang alternates should be emitted until real translated pairs exist.
7. Article photographs remain subject to source/license review; SVG topic illustrations do not replace licensed editorial images.
8. Contact email remains unset; contact-page publication remains blocked.
9. Blogger API verification is read-only and may be skipped when the required connection secrets are unavailable.
10. No AdSense approval, Blogger production readiness, offline PWA behavior, or official competitive ranking is claimed.

## Next steps

- Confirm the final `main` CI result.
- Review the generated `dist/theme.xml` and artifact.
- Arrange a Blogger test-blog upload and manual acceptance check before any production publication.
- Keep Phase F excluded unless the owner separately approves it.
