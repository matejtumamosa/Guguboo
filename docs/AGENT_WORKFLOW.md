# GuGuBoo agent workflow

This is the operating agreement for owner-agent and specialist-agent work in this repository. The human project owner retains final authority.

## Authority and roles

The human project owner approves priorities, major product decisions, release readiness, production deployment, data-risk changes, payments, security or access changes, and any material change to product direction.

The owner agent:

- maintains product purpose, users, logic, decisions, MVP versus later ideas, UX direction, technical constraints, risks, priorities, and open work;
- turns owner-approved outcomes into scoped work;
- validates specialist output against [the product context](PRODUCT_CONTEXT.md) and the requested acceptance criteria;
- surfaces conflicts and missing decisions rather than inventing strategy; and
- prepares work for human review but does not substitute for human approval.

Specialist agents may cover development, UX/UI, product, QA, content, and growth/marketing. Each assignment must be bounded by an issue or written task with relevant context, files or systems in scope, acceptance criteria, exclusions, and expected verification.

## Source of truth

Important decisions and work outcomes belong in durable project records: repository documentation, GitHub issues, pull requests, or a changelog. Chat is coordination, not the sole decision record.

Use these labels in written records:

- **Confirmed**: supported by the repository or explicitly approved by the human owner.
- **Proposed**: a recommendation awaiting approval.
- **Open question**: a missing decision that can materially affect the result.
- **Rejected/superseded**: no longer active, with a link or note explaining why.

When an approved decision changes product context, update `docs/PRODUCT_CONTEXT.md` in the same pull request or link a follow-up issue.

## Change workflow

1. Read `README.md`, `docs/PRODUCT_CONTEXT.md`, and relevant issues or pull requests. Check the working tree before editing and preserve unrelated work.
2. State the requested outcome, authority, constraints, risks, acceptance criteria, and open questions. Stop for an owner decision if an assumption would materially change product direction or risk.
3. Use a focused branch for reviewable work. Major changes must use a branch and pull request and must never be committed directly to `main`.
4. Make the smallest coherent change. Do not silently expand scope or convert prototype copy into approved strategy.
5. Verify behavior and documentation in proportion to risk. Include the commands or manual checks and their results in the handoff or pull request.
6. Report changed files, user-visible impact, risks, unresolved questions, and rollback considerations. The owner agent validates specialist work before asking the human owner to approve it.
7. Merge and deploy only through the owner's approved process. Production deployment always requires explicit human approval.

## Guardrails

Without explicit human approval, do not:

- change product direction or the approved MVP;
- delete or irreversibly migrate functionality or user data;
- add or change a database, authentication, payments, analytics, AI data sharing, security rules, permissions, secrets, or collaborator access;
- make health, legal, benefit, privacy, or security claims beyond verified evidence; or
- deploy to production.

If sensitive data is involved, document the data categories, purpose, storage location, retention/deletion behavior, access, third parties, failure modes, and recovery plan before implementation approval.

## Review-ready handoff

A change is ready for owner review when its scope and acceptance criteria are satisfied, relevant checks pass, documentation and links are valid, no unrelated changes are included, and unresolved risks or decisions are explicit. Only the human owner can give release approval.
