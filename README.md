<p align="center">
  <a href="https://github.com/AnchorSpec/AnchorSpec">
    <picture>
      <source srcset="assets/anchorspec_bg.png">
      <img src="assets/anchorspec_bg.png" alt="AnchorSpec logo">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://github.com/AnchorSpec/AnchorSpec/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/AnchorSpec/AnchorSpec/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://www.npmjs.com/package/anchorspec"><img alt="npm version" src="https://img.shields.io/npm/v/anchorspec?style=flat-square" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://discord.gg/YctCnvvshC"><img alt="Discord" src="https://img.shields.io/discord/1411657095639601154?style=flat-square&logo=discord&logoColor=white&label=Discord&suffix=%20online" /></a>
</p>

<details>
<summary><strong>The most loved spec framework.</strong></summary>

[![Stars](https://img.shields.io/github/stars/AnchorSpec/AnchorSpec?style=flat-square&label=Stars)](https://github.com/AnchorSpec/AnchorSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/anchorspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/anchorspec)
[![Contributors](https://img.shields.io/github/contributors/AnchorSpec/AnchorSpec?style=flat-square&label=Contributors)](https://github.com/AnchorSpec/AnchorSpec/graphs/contributors)

</details>
<p></p>
Our philosophy:

```text
→ fluid not rigid
→ iterative not waterfall
→ easy not complex
→ built for brownfield not just greenfield
→ scalable from personal projects to enterprises
```

> [!TIP]
> **New workflow now available!** We've rebuilt AnchorSpec with a new artifact-guided workflow.
>
> Run `/ansx:propose "your idea"` to get started. → [Learn more here](docs/ansx.md)



<!-- TODO: Add GIF demo of /ansx:propose → /ansx:archive workflow -->

## See it in action

```text
You: /ansx:explore
AI:  What would you like to explore?
You: I want dark mode but I'm not sure how to do it cleanly.
AI:  Let me look at your styling setup...
     Cleanest path here: CSS variables + a small theme context,
     with system-preference detection. No new dependencies. Scope it?
You: Yes, let's do it.

You: /ansx:propose add-dark-mode
AI:  Created anchorspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /ansx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /ansx:archive
AI:  Archived to anchorspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>AnchorSpec Dashboard</strong></summary>

<p align="center">
  <img src="assets/anchorspec_dashboard.png" alt="AnchorSpec dashboard preview" width="90%">
</p>

</details>

## Quick Start

**Requires Node.js 20.19.0 or higher.**

Install AnchorSpec globally:

```bash
npm install -g anchorspec@latest
```

Then navigate to your project directory and initialize:

```bash
cd your-project
anchorspec init
```

Now talk to your AI:

- **Not sure what to build yet?** Start with `/ansx:explore`, a no-stakes thinking partner that reads your code, weighs options, and shapes a plan before anything is written. ([Explore guide](docs/explore.md))
- **Already know what you want?** Go straight to `/ansx:propose <what-you-want-to-build>`.

Both are in the default profile. If you want the expanded workflow (`/ansx:new`, `/ansx:continue`, `/ansx:ff`, `/ansx:verify`, `/ansx:bulk-archive`, `/ansx:onboard`), select it with `anchorspec config profile` and apply with `anchorspec update`.

> [!NOTE]
> Not sure if your tool is supported? [View the full list](docs/supported-tools.md) – we support 25+ tools and growing.
>
> Also works with pnpm, yarn, bun, and nix. [See installation options](docs/installation.md).

## Docs

**Start here:** the **[Documentation Home](docs/README.md)** maps everything. New to AnchorSpec? Read [Getting Started](docs/getting-started.md), then [How Commands Work](docs/how-commands-work.md) (where you actually type `/ansx:propose`).

→ **[Getting Started](docs/getting-started.md)**: first steps<br>
→ **[Explore First](docs/explore.md)**: think it through with `/ansx:explore` before you commit<br>
→ **[How Commands Work](docs/how-commands-work.md)**: where slash commands run vs the CLI<br>
→ **[Core Concepts at a Glance](docs/overview.md)**: the whole mental model, one page<br>
→ **[Examples & Recipes](docs/examples.md)**: real changes, start to finish<br>
→ **[Workflows](docs/workflows.md)**: combos and patterns<br>
→ **[Existing Projects](docs/existing-projects.md)**: adopt AnchorSpec on a brownfield codebase<br>
→ **[Editing a Change](docs/editing-changes.md)**: update artifacts, go back, reconcile manual edits<br>
→ **[Commands](docs/commands.md)**: slash commands & skills<br>
→ **[CLI](docs/cli.md)**: terminal reference<br>
→ **[Stores](docs/stores-beta/user-guide.md)**: plan in a separate repo, shared across your team (beta)<br>
→ **[Supported Tools](docs/supported-tools.md)**: tool integrations & install paths<br>
→ **[Concepts](docs/concepts.md)**: how it all fits<br>
→ **[Multi-Language](docs/multi-language.md)**: multi-language support<br>
→ **[Customization](docs/customization.md)**: make it yours<br>
→ **[FAQ](docs/faq.md)** · **[Troubleshooting](docs/troubleshooting.md)** · **[Glossary](docs/glossary.md)**: quick help


## Community schemas

Third-party schema bundles distributed via standalone repositories — these provide opinionated workflows that integrate AnchorSpec with other tools, similar to how [github/spec-kit's community extension catalog](https://github.com/github/spec-kit/tree/main/extensions) handles tool integrations.

→ **[Browse the catalog](docs/customization.md#community-schemas)** in the customization docs.


## Why AnchorSpec?

AI coding assistants are powerful but unpredictable when requirements live only in chat history. AnchorSpec adds a lightweight spec layer so you agree on what to build before any code is written.

- **Agree before you build** — human and AI align on specs before code gets written
- **Stay organized** — each change gets its own folder with proposal, specs, design, and tasks
- **Work fluidly** — update any artifact anytime, no rigid phase gates
- **Use your tools** — works with 20+ AI assistants via slash commands

### How we compare

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Thorough but heavyweight. Rigid phase gates, lots of Markdown, Python setup. AnchorSpec is lighter and lets you iterate freely.

**vs. [Kiro](https://kiro.dev)** (AWS) — Powerful but you're locked into their IDE and limited to Claude models. AnchorSpec works with the tools you already use.

**vs. nothing** — AI coding without specs means vague prompts and unpredictable results. AnchorSpec brings predictability without the ceremony.

## Updating AnchorSpec

**Upgrade the package**

```bash
npm install -g anchorspec@latest
```

**Refresh agent instructions**

Run this inside each project to regenerate AI guidance and ensure the latest slash commands are active:

```bash
anchorspec update
```

## Usage Notes

**Model selection**: AnchorSpec works best with high-reasoning models. We recommend Codex 5.5 and Opus 4.7 for both planning and implementation.

**Context hygiene**: AnchorSpec benefits from a clean context window. Clear your context before starting implementation and maintain good context hygiene throughout your session.

## Contributing

**Small fixes** — Bug fixes, typo corrections, and minor improvements can be submitted directly as PRs.

**Larger changes** — For new features, significant refactors, or architectural changes, please submit an AnchorSpec change proposal first so we can align on intent and goals before implementation begins.

When writing proposals, keep the AnchorSpec philosophy in mind: we serve a wide variety of users across different coding agents, models, and use cases. Changes should work well for everyone.

**AI-generated code is welcome** — as long as it's been tested and verified. PRs containing AI-generated code should mention the coding agent and model used (e.g., "Generated with Claude Code using claude-opus-4-5-20251101").

### Development

- Install dependencies: `pnpm install`
- Build: `pnpm run build`
- Test: `pnpm test`
- Develop CLI locally: `pnpm run dev` or `pnpm run dev:cli`
- Conventional commits (one-line): `type(scope): subject`

## Other

<details>
<summary><strong>Telemetry</strong></summary>

AnchorSpec has no telemetry. It is an MIT-licensed fork of [OpenSpec](https://github.com/Fission-AI/OpenSpec) with all PostHog instrumentation removed.

</details>

<details>
<summary><strong>Maintainers & Advisors</strong></summary>

See [MAINTAINERS.md](MAINTAINERS.md) for the list of core maintainers and advisors who help guide the project.

</details>



## License

MIT
