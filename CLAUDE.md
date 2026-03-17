# SVGLogo.dev — Claude Code Guidelines

## Stack

- **Runtime**: Cloudflare Workers (via Wrangler)
- **Framework**: Vite + TanStack Start (file-based routing)
- **UI**: HeroUI v3.0.0-beta.8 (compound component API), Tailwind CSS
- **State**: Zustand with immer
- **Data fetching**: TanStack Query
- **Icons**: @iconify/react
- **Animations**: Framer Motion
- **Package manager**: Bun

---

## Architecture: CQRS + Domain-Driven

The codebase is organized into strict layers. **Import direction is one-way — never import upward.**

```
routes → features → commands → store → domain
                  ↘ queries → infra → domain
server → infra → domain
```

### Layer Rules

| Layer | Location | Rule |
|---|---|---|
| **domain** | `src/domain/` | Pure TypeScript. Zero framework or runtime deps. No React, no Zustand, no fetch. Fully unit-testable. |
| **infra** | `src/infra/` | Adapters for external APIs and browser APIs (fetch, canvas, clipboard, KV). No React. |
| **store** | `src/store/` | Zustand stores only. Imports from domain and infra. Never imported by domain or infra. |
| **commands** | `src/commands/` | Plain async functions (not hooks). Call `useStore.getState()` for reads/writes. Callable from event handlers, other commands, keyboard shortcuts. |
| **queries** | `src/queries/` | React hooks only. Zustand selectors for local state, TanStack Query for remote data. Read-only — no mutations. |
| **features** | `src/features/` | React components organized by feature. Import commands and queries. Never import from store or infra directly. |
| **routes** | `src/routes/` | TanStack Router file routes. Orchestrate features. Handle URL params and loaders. |
| **server** | `src/server/` | TanStack Start server functions (`createServerFn`). Run on Cloudflare Worker. Access KV via `import { env } from 'cloudflare:workers'`. |
| **data** | `src/data/` | Static app content (changelog, constants, copy). No logic, no imports from other layers. Plain TypeScript arrays/objects. |

---

## Strict Rules

### 1. Components never touch the store or infra directly
Features import from `commands/` and `queries/` only. If a component needs to mutate state, there must be a command function for it.

```ts
// WRONG — component calling store directly
const set = useLogoStore((s) => s.set);
set((d) => { d.iconName = "lucide:heart"; });

// RIGHT — component calls a command
import { updateLogo } from "#/commands/logo/update-logo";
updateLogo((d) => { d.iconName = "lucide:heart"; });
```

### 2. Commands are plain functions, not hooks
Commands must be callable outside React (from other commands, keyboard shortcuts, etc.).

```ts
// WRONG
export function useUpdateLogo() { ... }

// RIGHT
export function updateLogo(updater: (d: LogoState) => void) { ... }
```

### 3. Domain logic has zero dependencies
`src/domain/` files must not import from React, Zustand, TanStack, or any external package. Pure TypeScript functions and types only.

### 4. Queries are read-only hooks
Hooks in `src/queries/` must not call commands or mutate state. They return data only.

### 5. Server functions use `cloudflare:workers` env
Access Cloudflare bindings via `import { env } from 'cloudflare:workers'`. Never use `globalThis.env` or `process.env` for KV/D1/R2.

```ts
// WRONG
const kv = (globalThis as any).env.SHARE_KV;

// RIGHT
import { env } from "cloudflare:workers";
const kv = (env as { SHARE_KV?: KVNamespace }).SHARE_KV;
```

### 6. Use the `#/` path alias
Always use `#/` for src-relative imports. Never use relative `../../` paths crossing more than one directory.

```ts
// WRONG
import { updateLogo } from "../../commands/logo/update-logo";

// RIGHT
import { updateLogo } from "#/commands/logo/update-logo";
```

### 7. HeroUI compound component API
This project uses HeroUI v3.0.0-beta.8. Use the compound API — dot notation for sub-components.

```tsx
// WRONG (HeroUI v2 API)
<ModalHeader>...</ModalHeader>

// RIGHT (HeroUI v3 compound API)
<Modal.Header>...</Modal.Header>
<Select.Trigger>...</Select.Trigger>
<Tabs.Panel id="...">...</Tabs.Panel>
```

### 8. No `"use client"` directives
This is a Vite app, not Next.js. Never add `"use client"` to any file.

### 9. Avoid over-engineering
- Don't create helpers for one-off operations
- Don't add error handling for scenarios that can't happen
- Don't add comments unless the logic is non-obvious
- Don't add types for things TypeScript already infers
- Three similar lines > a premature abstraction

---

## File Naming Conventions

- **Domain types/logic**: `<noun>.<kind>.ts` — e.g. `logo.types.ts`, `logo.validators.ts`
- **Commands**: `<verb>-<noun>.ts` — e.g. `update-logo.ts`, `randomize-logo.ts`
- **Queries**: `use-<noun>.ts` — e.g. `use-logo-state.ts`, `use-icon-search.ts`
- **Infra**: `<noun>-client.ts` or `<noun>.ts` — e.g. `iconify-client.ts`, `canvas-renderer.ts`
- **Components**: `PascalCase.tsx` — e.g. `IconPickerModal.tsx`, `LogoCanvas.tsx`
- **Server functions**: `<resource>.<action>.ts` — e.g. `share.create.ts`, `share.get.ts`

---

## Dev Commands

```bash
bun run dev        # Start dev server
bun run build      # Vite build
bun run typecheck  # tsc --noEmit
bun run lint       # Biome lint
bun run deploy     # Deploy to Cloudflare Workers
```

---

## Key Domain Types

- `LogoState` — the full editor state (`src/domain/logo/logo.types.ts`)
- `Background` — solid or gradient (`src/domain/logo/logo.types.ts`)
- `ICON_SETS` — array of `{ id, label }` for all supported icon sets (`src/domain/icon/icon.types.ts`)
- `IconSvgCache` — cached SVG strings and data URIs (`src/domain/icon/icon.types.ts`)
- `CollectionItem` — saved logo with id and timestamp (`src/domain/collection/collection.types.ts`)

---

## Cloudflare KV

- Binding name: `SHARE_KV`
- Key pattern: `share:<nanoid6>`
- TTL: 30 days
- Configured in `wrangler.jsonc` under `kv_namespaces`
- Real KV namespace ID must be a 32-char hex string (set before deploying)
