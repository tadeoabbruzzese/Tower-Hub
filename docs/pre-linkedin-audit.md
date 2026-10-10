# TowerHub — pre-LinkedIn audit (2026-10-10)

## Starting state

- Path: `C:\Users\tadeo\Desktop\proyectos\tower-hub`
- Origin: `https://github.com/tadeoabbruzzese/Tower-Hub.git`
- Branch: `main`; HEAD: `d2de5b942ce55e67646e9db1473601c2aabf3a7c`.
- Working tree was clean. Existing `.env`, ignored `AGENTS.md` and generated data were preserved.
- No production writes, credentials changes, commits, pushes or deployments.

## Causes and local corrections

| Finding | Cause | Change |
| --- | --- | --- |
| Guides 404 | Navbar links to a nonexistent route | Removed public access and guides keyword; no new section |
| Hybrid filters | Only first hyphen-separated element compared; Frost alias and slash unsupported | Shared normalization; either explicit affinity matches |
| Role overflow | Intrinsic flex width exceeds mobile container | Bounded wrapping group; all roles visible |
| Mobile moveset buttons | Label hidden on mobile, leaving icon/count | Explicit labels and pressed state |
| Menu close/hidden navigation | Icon-only close and accessible offscreen controls | Close label; closed menu inert/aria-hidden |
| Tier search | Every tier shown even with no results | Single useful empty state/reset; hide unrelated tiers during search |
| Tier names | Hover-only overlay | Persistent name caption and accessible profile name |
| Gallery names on hover | Full-height description overlays/fades the name | Persistent name; hover details at top |
| Discord | Fake invite and nonfunctional home CTA | Removed pending real invitation |
| Missing fields | Empty date/image in data | Neutral placeholders; no invented values |
| Manifest | Metadata path differs from Next route | Use `/manifest.webmanifest` |
| Corrupted word highlighting | Formatter matches Ice inside Device/voice | Whole-word element tokens shared by relics and character descriptions |

Read-only public data inspection found 16 characters and 12 relics. Actual elements include `Frost/Volt` (Helene/Lyncis), `Volt-Ice` (Veronika/Hipper/Antoria), `Ice-Volt` (Gray Fox) and Flame/Physical hybrids. Filtering uses explicit data, without inferring game mechanics.

## Security: confirmed vs unknown

Confirmed in source: the ImageKit signature route had no identity/role validation. No repository middleware/proxy protects it. `AdminGuard` protects UI only. The application implementation permits unauthorized signing; no production exploit/signature/upload test was attempted. External hosting controls were not inspected.

Confirmed from the deployed-rule text supplied by the owner: owners could create/update `users/{uid}` with unrestricted `role`. Setting it to `admin` grants character/relic/news writes through `isAdmin()`. This is a rule-level privilege escalation; it is not evidence of exploitation. Private user records were not inspected or changed.

The local route now validates Firebase tokens through Auth REST and reads the current server-side role using the same token. UID/role headers are ignored. Project/expiry/disabled/revocation checks, no-store responses and sanitized errors are included. SDK and upload response shape are preserved.

`firestore.rules` is a local proposal, **not deployed**. It preserves public reads/admin CRUD, requires owner registration with matching UID/`executor`, and permits owner updates only to email/displayName/photoURL/lastLogin. Admin role management remains available to existing trusted admins. Until rules are hardened, a role-based signing guard alone is insufficient.

Unknown: prior unauthorized uploads/data changes, compromised accounts, legitimacy of existing admins, effective API-key restrictions and real authenticated admin uploads after these changes. These require owner/staging verification. No claim of exploitation or complete production security is made.

## Content requiring decisions

- **Helene:** `characters/helene.releaseDate` is empty, as in local Fandom extraction. `source.releaseVersion` is `5.3.5`; it is not a date. Confirm region (Global/CN) and authoritative date before an approved admin update.
- **Blocker Device:** `relics/blocker-device.image` and normalized JSON image are empty. It is not an HTTP image error. Supply an approved/licensed asset for later manual upload and assignment.
- **Tier date:** `UPDATED: JAN 2026` contradicts ranked Agleia `2026-03-16` and Salidy `2026-02-02`. These are recorded dates, not independently verified release facts.
- **Version:** tier header V5.6 vs home/catalog 5.6.2. Labels are literal strings, not calculated freshness indicators.
- **Methodology:** `Based on CN/Global Calculation` has no corresponding calculation, source, region policy, advancement/matrix/team assumptions or scoring criteria. Rankings are a manual map. Confirm editorial choices; no tiers were changed.
- **Copy:** public descriptions include Helene `siblings ave`, Lechesis `event wit hthe`/`the ysoon`, Aster `quite nature`, Claudia `Spedial`/`instructed`. Lyncis/Gray Fox contain `[...]` and source excerpt markers. Review source wording before production edits.
- **Status claims:** home `ACTIVE`/`ONLINE` are static; no game-server monitoring exists. News/roster fetch on mount without automatic wiki synchronization.
- **Existing admin title:** edit character uses `data.name` instead of `simulacrumName`. Identified, unchanged in this public correction scope.
- A real Discord invitation and actual guides content are needed before restoring those links.

## Checks and safe publication

Offline tests cover both hybrid formats/aliases, unknown values, tier search, anonymous/invalid/expired/revoked/wrong-project/non-admin authorization, missing user and provider failures; the verified admin receives the unchanged upload response shape. Mocked providers do not prove deployed rules.

Test the local rule proposal with Emulator/Rules Playground in an isolated project before release:

1. Anonymous public reads allowed; public writes/private user reads denied.
2. Owner registration with matching UID and executor allowed; admin/missing role/another UID denied.
3. Owner profile/lastLogin updates allowed; changing/removing role/UID denied; catalog writes/signing denied.
4. User without profile denied signing; normal registration creates executor profile.
5. Trusted admin CRUD/user administration and signing remain allowed.
6. Staging admin upload: verify preview, clearing the form value and re-upload without touching production.

Rules were reviewed against the owner-supplied text; no emulator or live production rule-write tests were run. Do not present offline tests as proof that these rules are deployed or fully validated.

## Executed validation

- Final `npm run build`: passed using the existing Turbopack production configuration; all routes compiled.
- `npm test`: 12 passed, 0 failed (offline), including whole-word description formatting.
- `npm run lint`: exit 0, 0 errors; the same 20 pre-existing `no-img-element` warnings as baseline.
- Compiled local server: home/catalogs/tier list/manifest/admin shells and all 16 character + 12 relic detail pages returned 200. Missing fixture IDs and `/guides` returned the expected 404; no public guides link remains.
- All 59 assigned public image URLs responded successfully. Blocker Device has no assigned image, so it is intentionally excluded from this count.
- Anonymous compiled-route request: 401, no signature, private no-store response.
- No ImageKit private-key value found in compiled client assets.
- Catalog viewport widths 320/360/390/430/1440: document scroll width equals available width; all four role buttons stay within bounds. Ice includes Helene/Lyncis and Volt includes both as well; Support filtering remains functional.
- Browser checks: tier names visible without hover, empty-search/reset functional, all four named moveset controls operate, close-menu accessible, only existing navigation links retained. Anonymous admin view displays `No autenticado`; no new console errors in the compiled local browser session.
- Blocker Device's description now preserves the exact word `Device` instead of highlighting an `Ice` substring. Missing image remains a clearly communicated data gap.
- Local changes and server tests do not update deployed Firebase rules. Real Google sign-in/admin CRUD/upload writes were not exercised against production.
- Owner confirmed missing date/image and tier editorial decisions should stay documented.

HTTP evidence and screenshots are in ignored `.qa/`; these are local review artifacts, not source intended for publication.

## Changed source files

- `.gitignore` (ignore QA artifacts), `package.json` (test command), `README.md` (project documentation).
- `src/components/Navbar.js`, `src/app/page.js`, `src/app/layout.js` (public links, accessibility, manifest).
- `src/components/simulacra/SimulacraGallery.js`, `src/components/simulacra/SimulacrumPage.js` (filters, wrapping roles, names, moveset labels/layout).
- `src/app/tierlist/page.js`, `src/app/relics/page.js`, `src/app/relics/[id]/page.js` (search, names, neutral missing-image text).
- `src/app/api/auth/imagekit/route.js`, `src/components/ImageKit/ImageUpload.js` (server/client authorization).
- New helpers: `src/lib/elements.mjs`, `src/lib/tier-search.mjs`, `src/lib/imagekit-auth.mjs`, `src/lib/imagekit-client-auth.mjs`, `src/lib/description-tokens.mjs`.
- New tests: `tests/catalog.test.mjs`, `tests/imagekit-auth.test.mjs`.
- New `firestore.rules` and this audit document.

No dependency changes, lockfile changes, game-record changes or `AGENTS.md` edits.

Release requires explicit authorization: preserve hosting revision/current rules; owner audits existing admins; validate/publish hardened rules first; verify login/admin compatibility; commit only reviewed code/docs/tests and create a staging preview. Verify authenticated signing with existing API-key restrictions. Confirm hosting production branch and automatic deployment behavior before pushing. Promote only after public/admin checks pass. If rollback is necessary, revert the app's hosting revision; retain hardened rules and fix compatibility rather than restore the privilege escalation.
