# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## Package Managers

### npm

```bash
npm install -g anchorspec@latest
```

### pnpm

```bash
pnpm add -g anchorspec@latest
```

### yarn

```bash
yarn global add anchorspec@latest
```

### bun

Bun can install OpenSpec globally, but OpenSpec currently runs on Node.js.
You still need Node.js 20.19.0 or higher available on `PATH`.

```bash
bun add -g anchorspec@latest
```

## Nix

Run AnchorSpec directly without installation:

```bash
nix run github:AnchorSpec/AnchorSpec -- init
```

Or install to your profile:

```bash
nix profile install github:AnchorSpec/AnchorSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    anchorspec.url = "github:AnchorSpec/AnchorSpec";
  };

  outputs = { nixpkgs, anchorspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ anchorspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verify Installation

```bash
anchorspec --version
```

## Next Steps

After installing, initialize AnchorSpec in your project:

```bash
cd your-project
anchorspec init
```

See [Getting Started](getting-started.md) for a full walkthrough.
