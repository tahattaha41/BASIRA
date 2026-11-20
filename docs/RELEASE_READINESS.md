# BASIRA release readiness gate

This branch adds a repeatable preflight for the Blogger release package. It does not publish, merge, change Blogger settings, delete pages, or upload a theme.

## Automated checks
- Build the Blogger XML and static HTML pages from source.
- Parse the generated XML.
- Verify the five required editorial/legal/contact page source files and built outputs.
- Verify exactly eight approved knowledge sections and five game concepts.
- Warn during ordinary CI when contact email or Blogger page routes are not confirmed.
- Fail a strict release check when contact email is absent/invalid or the five Blogger page routes are not confirmed in `src/site.json`.

## Required owner inputs before strict release
1. Set GitHub Actions secret `BASIRA_CONTACT_EMAIL` to the real public contact email. Do not commit an email or credential into source.
2. Create/verify the five Blogger static pages and their actual URLs. Only then add those exact paths to `src/site.json` under `published`.
3. Review the five game pages: current `scripts/ui.py` explicitly generates inert, static design mockups. They must not be marked as playable or published until real game logic is implemented and tested.
4. Run `BASIRA release readiness` with `strict_release_check=true`.

## Publishing limitation
The official Blogger API v3 manages pages and posts but has no Theme XML upload/update method. GitHub Actions cannot safely automate the theme upload through that API. The theme must be uploaded through Blogger's Theme interface. Do not use Google account passwords or browser-login workarounds in GitHub Actions.

## Tested vs not tested
- CI validates generated XML syntax and generated page files.
- This is not a live Blogger integration test.
- It does not prove that the theme renders correctly on Blogger.
- It does not publish any page or theme.
- It does not implement game logic, user accounts, cross-device progress, points, badges, or original articles.
- No Blogger content or settings are modified by this workflow.
