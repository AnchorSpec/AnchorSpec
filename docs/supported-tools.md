# Supported Tools

AnchorSpec works with many AI coding assistants. When you run `anchorspec init`, AnchorSpec configures selected tools using your active profile/workflow selection and delivery mode.

## How It Works

For each selected tool, AnchorSpec can install:

1. **Skills** (if delivery includes skills): `.../skills/anchorspec-*/SKILL.md`
2. **Commands** (if delivery includes commands): tool-specific `ansx-*` command files

Codex is skills-only: AnchorSpec installs `.codex/skills/anchorspec-*/SKILL.md` for Codex even when delivery is set to `commands`, and it does not generate Codex custom prompt files.

By default, AnchorSpec uses the `core` profile, which includes:
- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

You can enable expanded workflows (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) via `anchorspec config profile`, then run `anchorspec update`.

## How To Invoke

These docs use `/ansx:propose` as the canonical name, but each tool spells it the
way it loads the file AnchorSpec wrote. Find your tool's command path in the
[Tool Directory Reference](#tool-directory-reference) below, then match its shape here.

| Command file AnchorSpec writes | You type | Tools |
|------------------------------|----------|-------|
| `.../commands/ansx/<id>.*` — an `ansx/` folder namespaces it | `/ansx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../ansx-<id>.*` — the filename is the command | `/ansx-<id>` | Every other tool with generated command files, except Amazon Q and Devin |
| `.devin/workflows/ansx-<id>.md` — read by only one of Devin's two agents | `/ansx-<id>` on Devin Desktop, `/anchorspec-<skill>` on Devin Local | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/ansx-<id>.md` — a prompt, not a command | `@ansx-<id>` | Amazon Q Developer |
| none — skills only | `/anchorspec-<skill>` | CodeArts, ForgeCode, Hermes, Mistral Vibe |
| none — Kimi Code | `/skill:anchorspec-<skill>` | Kimi Code |
| none — Codex CLI | `$anchorspec-<skill>` | Codex ([`/anchorspec-<skill>` is not recognized](https://github.com/openai/codex/issues/11817)) |

So `/ansx:propose` is `/ansx-propose` in Cursor, `@ansx-propose` in Amazon Q, and
`$anchorspec-propose` in Codex.

Two things vary independently, which is why the rows do not collapse:

- **The name.** Rows 1–2 differ only in how the file names the command, and the
  `ansx-<id>` / `ansx:<id>` stem is the same for every tool with generated
  command files.
- **The wrapper.** Amazon Q loads its files into a prompt library invoked with
  `@`. Skills-only tools generate no command files at all, so their last three
  rows use *skill* names — listed under
  [Generated Skill Names](#generated-skill-names) — which do not map one-to-one
  onto command ids (`/ansx:apply` is the `anchorspec-apply-change` skill).

The command path patterns above are extension-neutral (`.*`) on purpose: the
extension is the tool's (`.toml` for Gemini CLI, `.prompt` for Continue,
`.prompt.md` for Kiro and GitHub Copilot), and a few tools show the name with
its extension in the picker. Match the directory shape, not the extension.

The files AnchorSpec generates, and the "Getting started" hint printed after setup,
already use the right form for the tools you selected — so the fastest answer is
to read the hint.

## Tool Directory Reference

| Tool (ID) | Skills path pattern | Command path pattern |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/anchorspec-*/SKILL.md` | `.amazonq/prompts/ansx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/anchorspec-*/SKILL.md` | `.agent/workflows/ansx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/anchorspec-*/SKILL.md` | `.augment/commands/ansx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/anchorspec-*/SKILL.md` | `.bob/commands/ansx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/anchorspec-*/SKILL.md` | `.claude/commands/ansx/<id>.md` |
| Cline (`cline`) | `.cline/skills/anchorspec-*/SKILL.md` | `.clinerules/workflows/ansx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/anchorspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/anchorspec-*` invocations) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/anchorspec-*/SKILL.md` | `.codebuddy/commands/ansx/<id>.md` |
| Codex (`codex`) | `.codex/skills/anchorspec-*/SKILL.md` | Not generated (skills-only; use `.codex/skills/anchorspec-*`) |
| Devin Desktop, formerly Windsurf (`devin`) | `.devin/skills/anchorspec-*/SKILL.md` | `.devin/workflows/ansx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/anchorspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/anchorspec-*` invocations) |
| Continue (`continue`) | `.continue/skills/anchorspec-*/SKILL.md` | `.continue/prompts/ansx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/anchorspec-*/SKILL.md` | `.cospec/anchorspec/commands/ansx-<id>.md` |
| Crush (`crush`) | `.crush/skills/anchorspec-*/SKILL.md` | `.crush/commands/ansx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/anchorspec-*/SKILL.md` | `.cursor/commands/ansx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/anchorspec-*/SKILL.md` | `.factory/commands/ansx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/anchorspec-*/SKILL.md` | `.gemini/commands/ansx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/anchorspec-*/SKILL.md` | `.github/prompts/ansx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/anchorspec-*/SKILL.md`\*\*\* | Not generated (no command adapter; use skill-based `/anchorspec-*` invocations) |
| iFlow (`iflow`) | `.iflow/skills/anchorspec-*/SKILL.md` | `.iflow/commands/ansx-<id>.md` |
| Junie (`junie`) | `.junie/skills/anchorspec-*/SKILL.md` | `.junie/commands/ansx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/anchorspec-*/SKILL.md` | `.kilocode/workflows/ansx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/anchorspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/skill:anchorspec-*` invocations) |
| Kiro (`kiro`) | `.kiro/skills/anchorspec-*/SKILL.md` | `.kiro/prompts/ansx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/anchorspec-*/SKILL.md` | `.lingma/commands/ansx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/anchorspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/anchorspec-*` invocations) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/anchorspec-*/SKILL.md` | `.omp/commands/ansx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/anchorspec-*/SKILL.md` | `.opencode/commands/ansx-<id>.md` |
| Pi (`pi`) | `.pi/skills/anchorspec-*/SKILL.md` | `.pi/prompts/ansx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/anchorspec-*/SKILL.md` | `.qoder/commands/ansx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/anchorspec-*/SKILL.md` | `.qwen/commands/ansx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/anchorspec-*/SKILL.md` | `.roo/commands/ansx-<id>.md` |
| Trae (`trae`) | `.trae/skills/anchorspec-*/SKILL.md` | `.trae/commands/ansx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/anchorspec-*/SKILL.md` | `.zcode/commands/ansx/<id>.md` |

\*\* GitHub Copilot prompt files are recognized as custom slash commands in IDE extensions (VS Code, JetBrains, Visual Studio). Copilot CLI does not currently consume `.github/prompts/*.prompt.md` directly.

\*\*\* Hermes loads skills from `~/.hermes/skills/` by default. To use project-local AnchorSpec skills, add the project `.hermes/skills/` directory to `skills.external_dirs` in `~/.hermes/config.yaml`; Hermes then exposes skills with user-facing slash invocations such as `/anchorspec-propose`.

\*\*\*\* Windsurf was [rebranded to Devin Desktop](https://docs.devin.ai/desktop/devin-desktop-faq) on June 2, 2026, and its config directory moved: `.devin/` is the preferred read + write location, `.windsurf/` a legacy read-only fallback. AnchorSpec follows the rename — the tool id is `devin`, and `--tools windsurf` still resolves to it so existing setup scripts keep working. A project still holding AnchorSpec files in `.windsurf/` is offered the move on the next `anchorspec update`; declining leaves them in place, and files you wrote yourself are never touched. Workflows are invoked by filename, so `.devin/workflows/ansx-apply.md` is `/ansx-apply`. The [Devin Local agent does not support workflows](https://docs.devin.ai/desktop/devin-local) — only skills, and it does not read `.windsurf/` at all — so whenever AnchorSpec writes Devin skills it keeps their bodies, and the getting-started hint, on `/anchorspec-*` skill invocations, which work on both agents. Under commands-only delivery no skills are written and both fall back to `/ansx-*`.

## Non-Interactive Setup

For CI/CD or scripted setup, use `--tools` (and optionally `--profile`):

```bash
# Configure specific tools
anchorspec init --tools claude,cursor

# Configure all supported tools
anchorspec init --tools all

# Skip tool configuration
anchorspec init --tools none

# Override profile for this init run
anchorspec init --profile core
```

**Available tool IDs (`--tools`)** — `windsurf` is also accepted, as an alias for `devin`: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `zcode`

## Workflow-Dependent Installation

AnchorSpec installs workflow artifacts based on selected workflows:

- **Core profile (default):** `propose`, `explore`, `apply`, `update`, `sync`, `archive`
- **Custom selection:** any subset of all workflow IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

In other words, skill/command counts are profile-dependent and delivery-dependent, not fixed.

## Generated Skill Names

When selected by profile/workflow config, AnchorSpec generates these skills:

- `anchorspec-propose`
- `anchorspec-explore`
- `anchorspec-new-change`
- `anchorspec-continue-change`
- `anchorspec-apply-change`
- `anchorspec-update-change`
- `anchorspec-ff-change`
- `anchorspec-sync-specs`
- `anchorspec-archive-change`
- `anchorspec-bulk-archive-change`
- `anchorspec-verify-change`
- `anchorspec-onboard`

See [Commands](commands.md) for command behavior and [CLI](cli.md) for `init`/`update` options.

## Related

- [CLI Reference](cli.md) — Terminal commands
- [Commands](commands.md) — Slash commands and skills
- [Getting Started](getting-started.md) — First-time setup
