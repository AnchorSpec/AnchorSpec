# Supported Tools

AnchorSpec works with many AI coding assistants. When you run `anchorspec init`, AnchorSpec configures selected tools using your active profile/workflow selection and delivery mode.

## How It Works

For each selected tool, AnchorSpec can install:

1. **Skills** (if delivery includes skills): `.../skills/anchorspec-*/SKILL.md`
2. **Commands** (if delivery includes commands): tool-specific `ansx-*` command files

By default, AnchorSpec uses the `core` profile, which includes:
- `propose`
- `explore`
- `apply`
- `archive`

You can enable expanded workflows (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) via `anchorspec config profile`, then run `anchorspec update`.

## Tool Directory Reference

| Tool (ID) | Skills path pattern | Command path pattern |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/anchorspec-*/SKILL.md` | `.amazonq/prompts/ansx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/anchorspec-*/SKILL.md` | `.agent/workflows/ansx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/anchorspec-*/SKILL.md` | `.augment/commands/ansx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/anchorspec-*/SKILL.md` | `.bob/commands/ansx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/anchorspec-*/SKILL.md` | `.claude/commands/ansx/<id>.md` |
| Cline (`cline`) | `.cline/skills/anchorspec-*/SKILL.md` | `.clinerules/workflows/ansx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/anchorspec-*/SKILL.md` | `.codebuddy/commands/ansx/<id>.md` |
| Codex (`codex`) | `.codex/skills/anchorspec-*/SKILL.md` | `$CODEX_HOME/prompts/ansx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/anchorspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/anchorspec-*` invocations) |
| Continue (`continue`) | `.continue/skills/anchorspec-*/SKILL.md` | `.continue/prompts/ansx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/anchorspec-*/SKILL.md` | `.cospec/anchorspec/commands/ansx-<id>.md` |
| Crush (`crush`) | `.crush/skills/anchorspec-*/SKILL.md` | `.crush/commands/ansx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/anchorspec-*/SKILL.md` | `.cursor/commands/ansx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/anchorspec-*/SKILL.md` | `.factory/commands/ansx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/anchorspec-*/SKILL.md` | `.gemini/commands/ansx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/anchorspec-*/SKILL.md` | `.github/prompts/ansx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/anchorspec-*/SKILL.md` | `.iflow/commands/ansx-<id>.md` |
| Junie (`junie`) | `.junie/skills/anchorspec-*/SKILL.md` | `.junie/commands/ansx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/anchorspec-*/SKILL.md` | `.kilocode/workflows/ansx-<id>.md` |
| Kiro (`kiro`) | `.kiro/skills/anchorspec-*/SKILL.md` | `.kiro/prompts/ansx-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/anchorspec-*/SKILL.md` | `.opencode/commands/ansx-<id>.md` |
| Pi (`pi`) | `.pi/skills/anchorspec-*/SKILL.md` | `.pi/prompts/ansx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/anchorspec-*/SKILL.md` | `.qoder/commands/ansx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/anchorspec-*/SKILL.md` | `.qwen/commands/ansx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/anchorspec-*/SKILL.md` | `.roo/commands/ansx-<id>.md` |
| Trae (`trae`) | `.trae/skills/anchorspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/anchorspec-*` invocations) |
| Windsurf (`windsurf`) | `.windsurf/skills/anchorspec-*/SKILL.md` | `.windsurf/workflows/ansx-<id>.md` |

\* Codex commands are installed in the global Codex home (`$CODEX_HOME/prompts/` if set, otherwise `~/.codex/prompts/`), not your project directory.

\*\* GitHub Copilot prompt files are recognized as custom slash commands in IDE extensions (VS Code, JetBrains, Visual Studio). Copilot CLI does not currently consume `.github/prompts/*.prompt.md` directly.

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

**Available tool IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## Workflow-Dependent Installation

AnchorSpec installs workflow artifacts based on selected workflows:

- **Core profile (default):** `propose`, `explore`, `apply`, `archive`
- **Custom selection:** any subset of all workflow IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

In other words, skill/command counts are profile-dependent and delivery-dependent, not fixed.

## Generated Skill Names

When selected by profile/workflow config, AnchorSpec generates these skills:

- `anchorspec-propose`
- `anchorspec-explore`
- `anchorspec-new-change`
- `anchorspec-continue-change`
- `anchorspec-apply-change`
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
