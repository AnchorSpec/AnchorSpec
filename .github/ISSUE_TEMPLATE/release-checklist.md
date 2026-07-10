---
name: Release checklist
about: Track merging a new upstream OpenSpec release and publishing the corresponding AnchorSpec release
title: "Release checklist: mirror upstream {{VERSION_TAG}}"
labels: upstream-release
---

Upstream release: {{RELEASE_URL}}

AnchorSpec version before this release: {{CURRENT_VERSION}}

Per CLAUDE.md, every upstream release gets a corresponding AnchorSpec release published to npm, at minimum as a 1:1 mirror.

## Merge

- [ ] Fetch and merge upstream `{{VERSION_TAG}}` into `main`
- [ ] Resolve conflicts; re-apply the standing telemetry (PostHog) removal — see CLAUDE.md "What is This Repo?"
- [ ] Run `pnpm run build` and spot-check `dist/` and the rebranded `docs/` output look correct

## Version & changeset

- [ ] Bump `package.json` version to `{{VERSION}}` — must match upstream exactly, see CLAUDE.md "Versioning" (use a fourth segment only if AnchorSpec needs to republish independently of this upstream bump)
- [ ] Add a changeset if one isn't already carried over from upstream

## CI

- [ ] Lint & type-check pass
- [ ] Tests pass (Linux/macOS/Windows)
- [ ] Nix Flake Validation passes — if it fails with `ERR_PNPM_NO_OFFLINE_TARBALL` or a hash mismatch, `pnpm-lock.yaml` changed and `flake.nix`'s `pnpmDeps.hash` needs refreshing: set `hash = "";`, push, let the build fail, copy the `got: sha256-...` value back in (see CLAUDE.md "CI" section)
- [ ] Changeset validation passes

## Publish

- [ ] Merge to `main` triggers `release-prepare.yml`, which opens/updates the "Version Packages" PR
- [ ] Merge the Version Packages PR — publishes to npm via OIDC trusted publishing
- [ ] Verify `anchorspec@{{VERSION}}` is live on npm
- [ ] Confirm the GitHub Release was created

## Docs / www

The npm publish above triggers a `repository_dispatch` to the [www repo](https://github.com/AnchorSpec/www), which opens a docs PR there automatically (see `sync-docs.yml` and CLAUDE.md "Documentation"). You still need to:

- [ ] Merge the auto-opened `docs: add v{{VERSION}}` PR in `www` — GitHub Pages deploy (`pages.yml`) is automatic from there
- [ ] Spot-check the deployed docs page
- [ ] If no PR appeared within a few minutes of the npm publish, the dispatch likely failed silently (check the `release-prepare.yml` run's "Notify www of published release" step) — fall back to running `www`'s `sync-docs.yml` manually via `workflow_dispatch` with the version, or copying `docs/` by hand into `src/docs/v{{VERSION}}/` and updating the `VERSIONS` array/redirect yourself

## Close out

- [ ] Close this issue
