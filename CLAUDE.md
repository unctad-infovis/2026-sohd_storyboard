# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive data visualization storyboard built with Vite + React + D3. Content lives in MDX; charts and maps are React components imported into `src/Article.mdx`.

## Commands

```bash
npm run start          # Dev server at http://localhost:8080 (auto-opens browser)
npm run start_public   # Dev server accessible over the network
npm run build          # Production build → dist/
npm run preview        # Preview the production build locally
npm run format         # Format with Biome (run after edits)
npm run lint:fix       # Lint + auto-fix with Biome
```

No test framework exists in this project.

## Code style (Biome)

- Indentation: 2 spaces
- Line width: **320 characters** — do not wrap lines at 80/100; Biome will not flag long lines
- JS/JSX: single quotes in JS, double quotes for JSX attributes
- Trailing commas: none
- Semicolons: always

## Architecture

- `src/Article.mdx` — the primary content file; slide components and text live here
- `src/jsx/components/storyboard/Slide01.jsx` … `Slide10.jsx` — one component per story section
- `public/assets/data/` — CSV and TopoJSON files loaded client-side (not bundled)
- `__PROJECT_NAME__` — a Vite-injected global (from `package.json` name) used in asset paths and DOM IDs

**BasePath logic** (`src/jsx/helpers/BasePath.js`): auto-detects environment:
- `unctad.org` host → Azure Storage paths
- `localhost` → relative paths
- anything else → GitHub Pages paths

Do not hardcode asset paths; use the BasePath helper.

## Deployment

Two separate targets, both triggered via npm scripts:

| Target | Command | Requires |
|--------|---------|---------|
| GitHub Pages | `npm run sync-gh-pages` | git subtree push; `unctad` remote set up |
| Azure Blob Storage | `npm run sync-prod` | `azcopy` installed; `AZURE_STORAGE_NAME` env var; `npm run login` first |

Azure login: `npm run login` (needs `AZURE_USER`, `AZURE_PW`, `AZURE_TENANT` env vars).

Always run `npm run build` before either deploy command.
