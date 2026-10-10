# TowerHub

Personal, unofficial resource hub for **Tower of Fantasy**, built by Tadeo Abbruzzese. The project demonstrates a Next.js application with a public game database, Firebase authentication and an editorial administration panel.

- Public site: https://www.towerhub.online/
- Repository: https://github.com/tadeoabbruzzese/Tower-Hub

## Features

- Simulacra catalog with name, role and element filters. Hybrid elements match either explicit affinity; Frost and Ice share the Ice filter.
- Character profiles: weapons, traits, movesets, matrices and advancements.
- SSR/SR relic catalog and detail pages.
- Manual tier list with character search and profile links.
- Curated news on the home page.
- Google sign-in through Firebase Auth.
- Admin forms for characters, relics and news, JSON import and ImageKit uploads.

There is no public guides section or configured Discord invitation. Admin placeholders represent future ideas, not implemented features.

## Stack and structure

Next.js 16.1.4 (App Router), React 19.2.3, JavaScript, Tailwind CSS 4, Framer Motion, Lucide icons, Firebase 12, ImageKit 6 and imagekitio-react 4. ESLint 9 and Node's built-in test runner handle checks. React Compiler is enabled.

| Directory/file | Purpose |
| --- | --- |
| src/app | Public pages, admin routes, layouts and metadata |
| src/app/api/auth/imagekit | Server-side upload authorization and signing |
| src/components | Navigation, galleries, profiles and editor forms |
| src/context | Firebase authentication and public data providers |
| src/lib | Firebase initialization, filters and authorization helpers |
| public | Icons and local banner asset |
| scripts | Manually invoked Fandom extraction/normalization tools |
| data | Local JSON; not the live site's data store |
| tests | Offline filters, search and upload authorization tests |
| firestore.rules | Proposed rules; not automatically deployed |
| docs/pre-linkedin-audit.md | Findings, missing content and release checklist |

Firebase Storage is initialized, but the editor's image upload workflow uses ImageKit.

## Local installation

Use Node.js 20.9+ compatible with Next.js 16, npm and Firebase/ImageKit projects you are authorized to use.

1. Run `npm ci`.
2. Create a local `.env` with your project configuration (names below).
3. Run `npm run dev` and open http://localhost:3000.
4. To use another port: `npm run dev -- --port 3200`.

Environment variable names (never commit private keys or environment files):

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=
```

`NEXT_PUBLIC_*` configuration is intentionally available to the browser. `IMAGEKIT_PRIVATE_KEY` stays on the server. Local development uses whichever backend the environment selects: **admin saves can affect production if you reuse production Firebase configuration**. Use a separate test backend for write/upload validation.

## Checks and production build

```bash
npm test
npm run lint
npm run build
npm run start
```

Tests use fake accounts and mocked Firebase/ImageKit boundaries. They do not create accounts, change Firestore or upload images. They cover hybrid filters, missing elements, tier search, token forwarding, rejected sessions/non-admins, revoked/expired accounts and the admin signing path. They do not prove deployed rules or replace an authenticated staging upload test.

On restricted Windows environments, Turbopack development may encounter an OS access error. The existing alternative is `npm run dev -- --webpack`, without changing configuration. Builds need network access for Google fonts in `next/font`.

## Data sources and editorial workflow

Public pages read Firestore collections `characters`, `relics` and `news`. Context providers fetch when mounted; they do not automatically scrape or synchronize game updates. Detail pages read individual documents. Authentication uses `users/{uid}` for the application role.

Local tools extract game information from the [Tower of Fantasy community wiki on Fandom](https://toweroffantasy.fandom.com/), using its MediaWiki API. Extraction and normalization are manual:

```bash
npm run scrape:fandom -- --page Lana
npm run normalize:fandom
npm run split:fandom
npm run scrape:fandom:relics
```

Review JSON, source references and region/version, import through the admin forms, then assign approved images manually. Scripts do not publish to Firestore or ImageKit. Some generated files and tools are ignored by `.gitignore`; only tracked files are guaranteed in a fresh clone.

Rankings are a hardcoded editorial map in `src/app/tierlist/page.js`. There is no implemented calculation, documented scoring model or automatic ranking update. The January 2026 date and CN/Global wording require editorial review.

## Upload security

The client sends its current Firebase ID token to `/api/auth/imagekit`. The server validates the session through Firebase Auth REST, checks identity/project/expiry/revocation, then reads that user's current role from Firestore with the same token. Only `role === "admin"` receives ImageKit parameters. Responses are uncached; errors deny access.

No service-account credential is added. Server requests to Auth REST must be allowed by existing API-key restrictions. Firestore REST with a Firebase ID token obeys Security Rules, including permission to read one's user document.

**The rules supplied during this audit allowed owners to assign themselves admin.** The local `firestore.rules` proposal restricts self-creation to `executor` and owner updates to profile fields. Review, test and separately publish it before considering role-based authorization secure. Next.js builds do not deploy Firebase rules. Existing admin assignments require owner review; private user records were not inspected or altered.

References: [Firebase Auth REST](https://firebase.google.com/docs/reference/rest/auth#section-get-account-info), [Firestore REST authentication/rules](https://firebase.google.com/docs/firestore/use-rest-api), [ImageKit upload authentication](https://imagekit.io/docs/integration/nextjs).

## Limitations and attribution

- Helene's date and Blocker Device's image are missing. The UI communicates these gaps without inventing data.
- The catalog is curated and incomplete. Dates, versions and regions need manual verification.
- Imported descriptions contain typos/excerpts; these changes do not edit production content.
- Standard `<img>` usage produces existing Next.js optimization warnings.
- Client admin UI is not a security boundary; server checks and correctly deployed rules are required.

TowerHub is an independent fan project, not affiliated with or endorsed by the game's creators or publishers. Tower of Fantasy names, trademarks, characters, illustrations and game text belong to their respective owners. Community wiki contributions remain attributable to their sources and applicable licenses. The author's work is the application implementation, integration and presentation, not authorship of game content. Verify redistribution rights before reusing assets in portfolio material.

No CI or Firebase deployment configuration is committed. Check the hosting Git integration and production branch before a future release; do not assume a push is harmless. These corrections remain local until owner review and publication authorization.
