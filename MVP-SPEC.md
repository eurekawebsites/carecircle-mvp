# CareCircle MVP — Working Specification

Status: production-minded demo for client validation  
Budget guardrail: USD $1,200 total for the agreed web app and installable PWA  
Working name: CareCircle (not cleared or approved as the final brand)

## Product purpose

CareCircle gives parents and trusted caregivers one private place to coordinate a child’s daily care, follow the same interventions, and see measurable progress over time. It is not merely a pickup scheduler or checklist. The differentiator is the connection between daily actions, care strategies, and visible progress.

## MVP users

- Parent: creates/manages the child’s care space, care plan, caregivers, and permissions.
- Trusted caregiver: sees assigned daily care, completes items, records observations, and logs progress.

The demo includes a role switcher to validate both perspectives. Production authentication and invitations are added after the workflow is approved.

## Core MVP capabilities

1. Child care space with a private invited care circle.
2. Shared daily checklist with time, instructions, completion state, and who completed each item.
3. Care goals with plain-language definitions and measurable progress.
4. Active interventions that tell caregivers exactly what approach to follow.
5. Progress dashboard showing trends, meaningful wins, and goal-level progress.
6. Caregiver update feed for observations and handoff notes.
7. Responsive web interface designed primarily for phones.
8. Installable PWA in the production phase.
9. Small attribution: “Powered by Eureka Websites.”

## Demo acceptance flow

The client should be able to:

1. Switch between a parent and caregiver perspective.
2. See what care has already been completed today and by whom.
3. Complete an outstanding care item and see the daily progress update immediately.
4. Review care goals and the active intervention.
5. Log a successful goal occurrence and see its progress change.
6. Review progress over time.
7. Publish a caregiver update and see it appear in the shared feed.

## Production phase after approval

- Real authentication and password recovery.
- Parent-created care spaces and caregiver invitations.
- Database persistence and tenant-safe access rules.
- Parent/caregiver permissions.
- Real child, checklist, care-plan, progress, and update records.
- Loading, empty, error, validation, and success states.
- PWA manifest, icons, installation behavior, and offline shell.
- Responsive/device QA and production deployment.

## Explicitly excluded from the $1,200 MVP

- Native iOS or Android applications or app-store submission.
- Open/public social network or community feed.
- Medical diagnosis, treatment recommendations, clinical records, or emergency services.
- Professional-provider portal, telehealth, insurance, or billing.
- Real-time chat, video calls, location tracking, or pickup verification.
- Full white-label multi-tenant SaaS administration.
- Subscriptions, marketplace features, or payment processing.

## White-label posture

The MVP uses replaceable product metadata and a reusable visual system, and it avoids embedding one family into product logic. This is a white-label-ready foundation only. Tenant isolation, per-client branding controls, organization administration, billing, and separate domains require a separately scoped upgrade.

## Validation decisions needed after the demo

- Whether parents and caregivers can both edit the care plan or only parents.
- Whether checklist items repeat daily, on selected days, or both.
- What counts as progress for each goal: occurrence, rating, duration, percentage, or a mix.
- Whether caregivers may invite others or only parents may do so.
- Which notifications are essential for version one.
- Whether the working name CareCircle should be researched for final branding.
