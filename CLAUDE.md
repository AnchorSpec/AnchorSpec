# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is This Repo?

This is a **minimal fork** of the upstream [OpenSpec](https://github.com/Fission-AI/OpenSpec) project. The sole intended difference from upstream is the **complete removal of telemetry** (PostHog) to guarantee it is not a potential data exfiltration vector. All other changes should come from upstream via merges — do not introduce feature divergence.

OpenSpec itself is an AI-native CLI tool for spec-driven development. It maintains structured specifications where changes are proposed as delta specs, reviewed, and merged — giving AI coding assistants a shared source of truth instead of relying on chat history.

### Documentation

Docs live in `docs/` and are rebranded at build time by `scripts/rebrand.js` (runs automatically via `pnpm build`). After tagging a release, copy the rebranded `docs/` folder into the [www repo](https://github.com/AnchorSpec/www) at `src/docs/v{version}/` and update the `VERSIONS` array and redirect in `src/pages/docs/`. The www repo is deployed separately via GH Pages.

## Build & Development Commands

```bash
pnpm install              # Install dependencies
pnpm run build            # Build (cleans dist/, compiles TS → dist/)
pnpm run dev              # Watch mode (tsc --watch)
pnpm run dev:cli          # Build + run CLI locally
pnpm lint                 # ESLint
pnpm test                 # Vitest (single run, forked pool)
pnpm test:watch           # Vitest watch mode
pnpm test:coverage        # Coverage report
```

Node >=20.19.0 required. ESM-only (`"type": "module"`).

## Architecture

**Data model** — two key directories inside a user's `openspec/` folder:

- `specs/` — source-of-truth markdown specs organized by domain, each with Requirements → Scenarios
- `changes/` — proposed modifications containing artifacts (proposal.md, design.md, tasks.md) and delta specs with ADDED/MODIFIED/REMOVED blocks

**Core flow:** CLI commands → Commander.js routing (`src/cli/index.ts`) → core logic (`src/core/`) → file operations on `openspec/` directory.

**Key subsystems in `src/core/`:**

| Directory/File | Purpose |
|---|---|
| `artifact-graph/` | Dependency graph determining artifact creation order |
| `parsers/` | Markdown parsing for requirements, scenarios, and delta blocks |
| `specs-apply.ts` | Merges delta specs into main specs during archive |
| `archive.ts` | Archive flow — validates deltas, applies them, moves change to archive |
| `command-generation/` | Generates platform-specific skills/commands for 20+ AI tools |
| `shared/` | Tool detection, skill filename generation |
| `validation/` | Spec and change validation |
| `project-config.ts` | Loads `openspec/config.yaml` (Zod-validated) |
| `init.ts` | Project initialization (interactive prompts) |

**Command implementations** live in `src/commands/`, with workflow-specific commands (status, instructions, templates) in `src/commands/workflow/`.

## Critical Conventions

**@inquirer imports must be dynamic** — Static imports of `@inquirer/*` cause pre-commit hook hangs by keeping the event loop alive when stdin is piped. Use `import()` instead. ESLint enforces this. Only exception: `src/core/init.ts` (which is itself dynamically imported).

**Cross-platform paths** — This tool runs on macOS, Linux, and Windows. Always use `path.join()`/`path.resolve()`, never hardcode slashes. Tests must use `path.join()` for expected path values.

**Changesets required** — PRs need a `.changeset/` entry. CI validates this.

**Profiles and schemas** — The `schemas/` directory contains built-in artifact schemas (e.g., `spec-driven`). The artifact graph resolves creation order based on the selected schema.

## Testing

Tests are in `test/` mirroring `src/` structure. Vitest with forked pool (process isolation per file). Tests spawn real CLI processes via `test/helpers/run-cli.ts`. 10s timeout per test.

Run a single test file:
```bash
pnpm vitest run test/core/archive.test.ts
```

Run tests matching a pattern:
```bash
pnpm vitest run -t "pattern"
```

`vitest.setup.ts` ensures the CLI bundle is built before tests run.

## CI

GitHub Actions runs on PRs and main pushes: lint, type-check (`tsc --noEmit`), tests on Linux/macOS/Windows, Nix flake validation, and changeset verification. PR merge requires all checks to pass.

### Release token

`release-prepare.yml` needs a token with more privilege than the default `GITHUB_TOKEN` (to push the Version Packages PR and let `changesets/action` create releases past branch protection). This is provided by the **AnchorSpec Release** GitHub App, minted per-run via `actions/create-github-app-token`, rather than a personal access token — PATs have an expiration date and silently break the release workflow when they lapse (happened 2026-07, ~7 weeks after the previous PAT was set). App-generated tokens are short-lived per run but the App installation itself doesn't expire, so there's nothing to rotate on a calendar.

Org-level config (Settings → Secrets and variables → Actions, org scope, visible to `AnchorSpec/AnchorSpec`): variable `RELEASE_CLIENT_ID` (App Client ID, used by the workflow) and secret `RELEASE_APP_PRIVATE_KEY` (the App's private key). `RELEASE_APP_ID` (numeric App ID) is also kept on the org for reference/tooling that wants it, but the workflow uses `client-id` since `actions/create-github-app-token` deprecated `app-id` in favor of it. To manage the App itself: `AnchorSpec` org → Developer settings → GitHub Apps → AnchorSpec Release (owned by the org, not a personal account) — must be **installed** on `AnchorSpec/AnchorSpec` (Install App tab on the App's own settings page). Permissions needed: Contents (read/write), Pull requests (read/write). Revoke access by uninstalling the App from the repo, not by deleting the secret/variable.

## Versioning

`major.minor.patch` **always** tracks the upstream OpenSpec version being merged — never bump these three segments independently of an upstream release. If AnchorSpec needs to publish or republish a version without a corresponding upstream bump (e.g. a fork-only CI/infra fix that needs a new npm release), use a fourth segment instead: `x.x.x.1`, `x.x.x.2`, etc. Drop the fourth segment again on the next upstream merge — it resets to plain `major.minor.patch` once upstream moves forward, since alignment with upstream numbering takes priority over a continuous 4th-segment counter.

**Publish parity with upstream is mandatory, not opportunistic.** Every upstream OpenSpec release gets a corresponding AnchorSpec release published to npm, at minimum as a 1:1 mirror (merge + republish, even with zero AnchorSpec-specific changes beyond the standing telemetry removal). Don't let AnchorSpec's published version lag behind upstream indefinitely — an unmirrored upstream release is a gap to close, not a backlog item to defer.

### Tracking new upstream releases

`.github/workflows/upstream-release-watch.yml` runs on a schedule, compares AnchorSpec's `package.json` version against the latest [Fission-AI/OpenSpec release](https://github.com/Fission-AI/OpenSpec/releases), and opens a tracking Issue (labeled `upstream-release`) when AnchorSpec is behind and no open issue for that version already exists. This is detection + tracking only; the merge and publish are still done by hand. Full automation (auto-merge, auto-publish) is a future step once the manual process is well-worn.

The issue body comes from `.github/ISSUE_TEMPLATE/release-checklist.md` — the single source of truth for the release checklist (merge, version bump, changeset, CI including the Nix hash-refresh gotcha, npm publish, **and** copying rebranded docs into the [www repo](https://github.com/AnchorSpec/www), which is easy to forget since it's a separate repo). The workflow substitutes its `{{VERSION}}`-style placeholders; the same template is also usable standalone via GitHub's "New Issue" picker for a manually-triggered release. Update the template, not the workflow, when the checklist itself needs to change.

## Fork Strategy & Future Direction

**Current priority: upstream mergeability.** This fork is in early evaluation. Minimize divergence from OpenSpec — telemetry removal only. Publishing to npm as `anchorspec` is acceptable if needed (just maintenance overhead). Do not introduce feature changes.

**Investigated but deferred: CLI-free skills.** The generated skills/commands (`anchorspec init` output) depend on the CLI being installed because they embed commands like `openspec status --json` and `openspec instructions <id> --json`. Investigation (2026-03-15) found this *could* be replaced — most CLI commands are thin wrappers around file I/O, and the only non-trivial logic (artifact dependency graph resolution) is small enough to embed in skill instructions. The archive skill already operates CLI-free as a proof of concept. However, this would create a true fork that can't merge from upstream, so it's **not worth pursuing unless upstream mergeability is abandoned.** If that decision is made, the path is: bake schema knowledge into skill templates, copy schemas into the project directory (not symlinks to node_modules), and drop most of the CLI infrastructure.