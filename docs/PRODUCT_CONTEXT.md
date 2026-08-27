# GuGuBoo product context

Last reviewed: 2026-08-27

This document is the durable product-level reference for repository work. It separates facts visible in the repository from concepts shown by the prototype and questions that still require the human project owner's decision.

## Confirmed facts

- GuGuBoo is currently a Slovak-language, mobile-oriented pilot web application for pregnancy, early childcare, family coordination, travel preparation, and family memories.
- The repository is a static, Netlify-ready site. `index.html` is the landing page and `app.html` is the browser application; there is no build step or server-side component in this repository.
- Current user-entered application state is stored in the browser's `localStorage`. There is no implemented authentication, multi-user synchronization, database, payment processing, or production account system in this repository.
- Optional geolocation is used to infer a country. Reverse geocoding calls OpenStreetMap's Nominatim service; the interface states that coordinates are not saved. Google Fonts and public Slovak/EU resource links are also external dependencies.
- The interface contains practical and health-adjacent guidance. It repeatedly says that GuGuBoo does not diagnose, replace a clinician, determine legal entitlement, or put urgent help behind a subscription.
- The landing page identifies the app as a pilot for user testing. The repository's initial commit is on `main` and has been pushed to GitHub.

## Product story expressed by the current prototype

These are statements and concepts present in the current UI, not separately confirmed product decisions.

- Intended users appear to be expecting parents, parents of babies and young children, and invited family members or caregivers.
- The stated promise is one calm place for preparation before birth, everyday care records, family coordination, age-relevant support, travel, and memories.
- The prototype groups capabilities into free, premium, and optional add-on concepts. It displays a proposed post-birth price starting at EUR 4.99/month.
- Screens envision shared family accounts, notifications, AI assistance, memory products, gifts, and payments. The present static pilot does not implement the required backend services for those concepts.

Prototype copy is evidence of the current design direction only. It must not be treated as an approved MVP, pricing commitment, safety claim, or production capability without an explicit owner decision.

## Current constraints and quality bar

- Preserve the Slovak-first experience unless the owner approves a market or language change.
- Keep the pilot usable as a static site unless a backend or build-system change is explicitly approved.
- Do not imply that mock or local-only behavior is secure family sharing, live AI, a completed payment flow, or a production service.
- Treat pregnancy, child, health, contact, photo, family, and location-related information as sensitive. Any persistence, analytics, synchronization, export, deletion, consent, or third-party sharing change requires explicit owner approval and a written risk review.
- Health, urgent, employment, benefit, and travel guidance needs clear limits, authoritative sourcing where appropriate, and safe escalation paths.
- Do not deploy, change access, enable payments, remove functionality or data, or materially change product direction without explicit owner approval.

## Approved scope and priorities

No product MVP boundary or implementation priority beyond maintaining this owner-agent baseline has yet been confirmed in durable repository documentation. Existing screens must not be reclassified as approved MVP merely because they are present.

## Open questions for the human project owner

1. Who is the primary launch user and geography, and is Slovak-only the intended first release?
2. Which current capabilities are the approved MVP, and which are experiments or later ideas?
3. Are the free-before-birth / paid-after-birth model and the displayed EUR 4.99 price approved, provisional, or obsolete?
4. What is the current pilot status, release target, deployment URL, and release acceptance bar?
5. What data may the product collect or store, for how long, and under which privacy, consent, deletion, backup, and incident rules?
6. Which production services, if any, are approved for authentication, database/sync, AI, analytics, notifications, payments, email, and media storage?
7. Has Samuel accepted the GitHub invitation, and what review/merge permissions should collaborators have?

Record answers as repository documentation, issues, pull requests, or changelog entries before dependent work proceeds.
