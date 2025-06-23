# 🌿 Nature-Animation Polyglot

A live, interactive digital artwork and technical showcase, blending the beauty of nature with the creative power of every language and framework Vercel supports.

## Features
- **Immersive, animated natural scenes**: Rivers, sky, forest, night, and more, each powered by a different language/runtime.
- **Real-time, multi-user interactions**: Ripples, rain, blooming, and more, all tracked and visualized live.
- **Polyglot architecture**: Go, Python, Rust, Ruby, PHP, TypeScript/Next.js, and GraphQL, orchestrated together.
- **Open source & modular**: Easily extend or remix any section.

## Local Development

Requirements: Node ≥18, Rust, Go, Ruby, PHP, and wasm-pack must be installed.

```bash
# root
npm install          # installs workspaces & Turbo
npm run dev          # apps/web + any dev servers

# compile Rust → WASM once (if Rust is installed)
npm run build:wasm   # via scripts/wasm-build.sh
```

Open `http://localhost:3000` and explore the interactive scenes.

## Deployment

Push to GitHub; Vercel auto-detects and builds each function with the correct runtime via `vercel.json`, serving the Next.js front-end from the Edge.

```jsonc
// excerpt
{
  "functions": {
    "api/weather/index.py": { "runtime": "python3.11" },
    "api/socket/index.go":  { "runtime": "go1.x" },
    "api/graphql.ts": { "runtime": "nodejs18.x" },
    // ...
  }
}
```

## Architecture & Language Map
| Section | Path | Language / Runtime | Role |
|---------|------|--------------------|------|
| River | `services/go-socket` | Go 1.x | Real-time ripples via WebSocket |
| Sky | `services/py-weather` | Python 3.11 | Live weather-driven sky/clouds (FastAPI) |
| Forest | `services/rb-cron` | Ruby 3.2 | Seasonal color changes (Sinatra) |
| Night Sky | `services/php-legacy` | PHP 8 | Dynamic SVG flower blooming |
| Particles | `services/rs-particles` | Rust → WASM | High-performance particle system |
| Stats API | `apps/web/src/pages/api` | TypeScript/Next.js | Unified stats and GraphQL API |

## How Each Language is Used
- **Go**: WebSocket server for real-time river ripples.
- **Python**: FastAPI service for live weather data, driving sky/clouds.
- **Rust**: WASM module for high-performance particles (fireflies, pollen, etc.).
- **Ruby**: Sinatra server for time-based season rotation in the forest.
- **PHP**: Dynamic SVG/HTML generation for blooming flowers.
- **TypeScript/Next.js**: Main frontend, orchestrator, and API routes.
- **GraphQL**: Unified API for querying live stats.

## Contributing
PRs and ideas welcome! See `/dashboard` for a live overview of all sections and their powering technologies.

---
MIT License

| Path | Language / Runtime | Role |
|------|--------------------|------|
| `apps/web` | TypeScript · Next 14 | Front-end UI / animations (GSAP, Canvas, Tailwind) |
| `services/py-weather` | Python 3.11 · FastAPI | Fetch live weather → affects sky & clouds |
| `services/go-socket` | Go 1.x | WebSocket broadcast of shared interactions |
| `services/rs-particles` | Rust → WASM | Performance-heavy particle & fluid simulations |
| `services/rb-cron` | Ruby 3.2 | Scheduled season rotation (edge function) |
| `services/php-legacy` | PHP 8 | Nostalgic view-source page |
| `graphql/` | SDL & codegen | Query interaction stats |
| `infra/` | Prisma schema | Edge Postgres (Neon) logging |
