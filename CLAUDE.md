# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is This Repo?

This is a **minimal fork** of the upstream [OpenSpec](https://github.com/Fission-AI/OpenSpec) project. The sole intended difference from upstream is the **complete removal of telemetry** (PostHog) to guarantee it is not a potential data exfiltration vector. All other changes should come from upstream via merges — do not introduce feature divergence.

OpenSpec itself is an AI-native CLI tool for spec-driven development. It maintains structured specifications where changes are proposed as delta specs, reviewed, and merged — giving AI coding assistants a shared source of truth instead of relying on chat history.

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

## Fork Strategy & Future Direction

**Current priority: upstream mergeability.** This fork is in early evaluation. Minimize divergence from OpenSpec — telemetry removal only. Publishing to npm as `anchorspec` is acceptable if needed (just maintenance overhead). Do not introduce feature changes.

**Investigated but deferred: CLI-free skills.** The generated skills/commands (`anchorspec init` output) depend on the CLI being installed because they embed commands like `openspec status --json` and `openspec instructions <id> --json`. Investigation (2026-03-15) found this *could* be replaced — most CLI commands are thin wrappers around file I/O, and the only non-trivial logic (artifact dependency graph resolution) is small enough to embed in skill instructions. The archive skill already operates CLI-free as a proof of concept. However, this would create a true fork that can't merge from upstream, so it's **not worth pursuing unless upstream mergeability is abandoned.** If that decision is made, the path is: bake schema knowledge into skill templates, copy schemas into the project directory (not symlinks to node_modules), and drop most of the CLI infrastructure.