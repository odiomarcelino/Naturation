# 🌿 Nature-Animation Polyglot Demo

Live, interactive single-page site that celebrates natural beauty **and** every runtime that Vercel supports.

## Local Development

Node ≥18, Rust, Go, and wasm-pack must be installed.

```bash
# root
npm install          # installs workspaces & Turbo
npm run dev          # apps/web + any dev servers

# compile Rust → WASM once
npm run build:wasm   # via scripts/wasm-build.sh
```

Open `http://localhost:3000` and click to toggle day/night. More scenes coming soon.

## Deployment

Just push to GitHub; Vercel detects poly-repo, builds each function with the correct runtime via `vercel.json`, and serves the Next.js front-end from the Edge.

```jsonc
// excerpt
{
  "functions": {
    "api/weather/index.py": { "runtime": "python3.11" },
    "api/socket/index.go":  { "runtime": "go1.x" }
  }
}
```

## Roadmap
- [x] Scaffolding & placeholder sky scene
- [ ] River scene with Rust fluid WASM ripples
- [ ] Forest scene swaying with wind (GSAP)
- [ ] Desert parallax dunes & fireflies particles
- [ ] GraphQL endpoint & stats panel
- [ ] Docs polish & open-source launch.

---
MIT 

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