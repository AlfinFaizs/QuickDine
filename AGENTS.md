<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# QuickDine Agent & Coding Rules

## 1. File Length Limit
- **Panjang baris per file wajib di bawah 500 baris.**
- Pecah komponen, fungsi, hook, dan tipe data menjadi modul-modul kecil yang terisolasi dan mudah diuji (Single Responsibility Principle).

## 2. Arsitektur Folder: Feature-Driven Architecture (Modular Monolith) + Route Groups
- `src/app/(marketing)/` : Halaman landing & direktori resto publik (`/`)
- `src/app/(customer)/`  : Alur pemesanan customer (`/[slug]`, `/[slug]/checkout`, `/[slug]/order/[id]`, `/pesanan-saya`)
- `src/app/(auth)/`      : Autentikasi customer & resto staff (`/login`)
- `src/app/(dashboard)/` : Portal resto staff & owner (`/dashboard/kds`, `/tables`, `/menu`, `/finance`, `/settings`)
- `src/app/(super-admin)/`: Portal super admin platform (`/super-admin`, `/super-admin/tenants`)
- `src/app/api/`         : Webhooks (Midtrans) & Cron jobs
- `src/features/`        : Domain business logic per fitur (`orders`, `tables`, `kds`, `menu`)
- `src/services/`        : External provider integration dengan Adapter Pattern (`notification`, `payment`)
- `src/components/ui/`   : UI primitives
- `src/components/shared/`: Shared layout components (Navbar, Footer, Modals)
- `src/lib/`             : Prisma, Supabase client/server/admin singletons & utils
- `src/types/`           : Global TypeScript definitions

## 3. Desain & UX
- Gunakan design system "Emerald Efficiency" (Primary: `#006948`, Font: Inter, Radius: `rounded-xl`).
- Utamakan visual yang rapi, modern, dan fungsional sesuai PRD v4.2 dan Stitch Design System.
