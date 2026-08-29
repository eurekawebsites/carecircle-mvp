# CareCircle — MVP Demo

A controlled, multi-role demo of **CareCircle**: one private place for parents and
trusted caregivers to coordinate a child's daily care, follow the same interventions,
and see progress over time.

**Live demo:** https://eurekawebsites.github.io/carecircle-mvp/

---

## What this demo is

This is a **controlled MVP demo built for client validation** — not a production
application. Its only job is to let a client walk through the intended workflow and
approve it before the production phase begins.

- **All data is sample data.** The child, caregivers, checklist, goals, and updates
  are hard-coded fixtures.
- **Changes are in-memory only and reset on refresh.** Completing a care item,
  logging a goal success, switching the parent/caregiver view, or posting a
  caregiver update all work for the session and disappear when the page reloads.
- Nothing is saved, sent, or shared anywhere.

## What belongs to the production phase (not in this demo)

The following are intentionally out of scope here and are part of the separately
delivered production build:

- Real **authentication** and password recovery
- **Database persistence** and tenant-safe access rules
- Parent-created care spaces and caregiver **invitations**
- Parent / caregiver **permissions and security rules**
- Full **PWA** behaviour — manifest, installability, offline shell, icons
- Loading, empty, error, validation, and success states
- Responsive / device QA and production deployment

No backend, authentication, or database is included in this repository, and none
should be added to it — this repo is the demo only. The CareCircle Community
Network is present as an in-memory demo (registered-member feed, questions/tips/
resources/milestones, replies, supportive reactions, and reporting/basic
moderation); it is intentionally *not* a full social network and is not expanded
here.

## Demo walkthrough

1. Choose **Parent** or **Caregiver** from the demo entry screen.
2. Use the role-specific sidebar to move through every workflow.
3. See what care is already done today and by whom, then complete an item.
4. Review measurable care goals and the active intervention.
5. In Caregiver view, create a structured progress entry.
6. In Parent view, review care-circle members and permission boundaries.
7. Review progress over time and post a caregiver handoff update.
8. Open **Community**, filter posts, publish one, view replies, react supportively,
   and report a post for review.

---

## Tech

- [Vite](https://vite.dev/) + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Radix UI primitives, `lucide-react` icons
- Static build — no server, no environment variables

## Local development

```bash
npm install
npm run dev        # http://localhost:5173/carecircle-mvp/
```

## Production build

```bash
npm run build      # type-checks, then outputs static files to dist/
npm run preview     # serve the built site locally
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes `dist/` to GitHub Pages.

The Vite `base` is set to `/carecircle-mvp/` in [`vite.config.ts`](vite.config.ts) so
assets and the favicon resolve correctly under the project Pages URL. If the
repository or Pages path changes, update `base` to match.

---

POWERED BY EUREKA TECH
