# Chongkran Frontend — Agent Notes

Nuxt 4 Vue.js recipe web app. Connects to a NestJS backend at `../chongkran-backend`.

## Commands

- `pnpm dev` — Dev server (http://localhost:3000)
- `pnpm build` / `pnpm generate` / `pnpm preview`
- `pnpm lint` / `pnpm lint:fix` — **oxlint** (config: `oxlint.config.ts`; `any`/empty-type/ban-types rules off)
- `pnpm fmt` / `pnpm fmt:check` — **oxfmt** (config: `oxfmt.config.ts`; 2-space indent, double quotes, semicolons, trailing commas, 100 char width)
- `pnpm postinstall` — runs `nuxt prepare`

No test runner, no typecheck script, no CI.

## Environment Variables

```env
NUXT_BASE_URL=http://localhost:8080/api
NUXT_JWT_ACCESS_SECRET=...
NUXT_JWT_ACCESS_EXPIRES_IN=15m
NUXT_JWT_REFRESH_SECRET=...
NUXT_JWT_REFRESH_EXPIRES_IN=7d
```

All are **server-side only** (no `public` prefix). Access via `useRuntimeConfig().baseURL` / `useRuntimeConfig().jwt.*`.

Backend runs on port **8080** by default.

## Architecture

### BFF Proxy Pattern (critical)

The Nuxt server (`server/`) acts as a **Backend-For-Frontend** proxy to the NestJS backend. The frontend never calls the backend directly — all API calls go through `server/api/` routes.

- **`server/utils/proxy.ts`** — core proxy helper: forwards requests to backend with the access token from cookies. Auto-refreshes on 401 via `server/utils/refreshToken.ts`.
- **`server/utils/refreshToken.ts`** — reads refresh token from httpOnly cookies, calls backend `/auth/refresh`, writes new tokens back as httpOnly cookies.
- **`server/utils/response.ts`** — `createResponse<T>()` helper matching the backend's `ApiResponse<T>` envelope.
- **`server/utils/auth.ts`** — `expiresInToSeconds()` for cookie maxAge calculation.

All 60+ server routes in `server/api/` follow the same pattern: `defineEventHandler` → `proxy<T>(event, path, opts)`. Auth routes (`login.post.ts`, `signup.post.ts`) also set httpOnly cookies directly.

### Client → Server Communication

- **`useApi`** (`app/composables/useApi.ts`) — `$fetch` wrapper. Use for imperative API calls (form submissions, mutations).
- **`useFetchApi`** (`app/composables/useFetchApi.ts`) — `createUseFetch` wrapper with cookie relay. Use for SSR-aware data fetching in pages.
- **`useUser`** (`app/composables/useUser.ts`) — `useState<User | null>("user")` singleton. Populated by the auth plugin.

### Auth Flow

- **`app/plugins/auth.ts`** — runs on app load, calls `/api/auth/me` to hydrate `useUser()`. Uses `callOnce` to prevent duplicate calls.
- **`app/middleware/auth.global.ts`** — global route guard. Public routes: `/`, `/auth`, `/recipes`, `/categories`. All other routes redirect to `/auth` if no user.
- Tokens stored as **httpOnly cookies** (`access_token`, `refresh_token` / `CookieName` enum). Client never sees raw tokens.

### Directory Layout

- **Entrypoint**: `app/app.vue` — `<UApp>` wraps `<NuxtLayout>` + `<NuxtPage>`
- **Nuxt 4 compat**: `future.compatibilityVersion: 4` in `nuxt.config.ts`
- **Layouts**: `app/layouts/default.vue` (header + footer), `app/layouts/auth.vue` (no header/footer)
- **Pages**: `app/pages/` — file-based routing. Auth page sets `layout: "auth"`.
- **Components**: `app/components/` — auto-imported by Nuxt. `AppHeader`, `AppFooter`, `RecipeCard`, `CreateRecipeModal`, `auth/LoginForm`, `auth/SignupForm`
- **Shared types**: `shared/types/index.ts` — `ApiResponse<T>`, `ApiResponseCode`, `PaginationMeta`, `CookieName`, `Role`, `User`, `Author`, `Recipe`, `RecipeWithAuthor`, `Category`, `Review`, `Ingredient`, `Favorite`, `FollowStats`, `MealPlan`, `ShoppingList`, `AuthorRequest`. Auto-imported.
- **Server types**: `server/types/` — server-specific types like `RecipeResponse`, `CreateRecipeDto`, `UploadResponse`, `AuthResponse`, `CurrentUser`. These are **NOT auto-imported on the client** — only available in `server/` code via `#server/types`.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`. Nuxt UI v4 (primary: yellow, neutral: zinc). Fonts: Geist. Custom scrollbar styles in `app/assets/css/main.css`.
- **State**: Pinia (`@pinia/nuxt`)
- **Validation**: Zod (used with `UForm` + `UFormField` pattern)

### Server API Routes (`server/api/`)

| Domain            | Routes                                                                   |
| ----------------- | ------------------------------------------------------------------------ |
| `auth/`           | login, signup, logout, me, refresh                                       |
| `recipes/`        | CRUD, my, pending, update-status, author/[id], like, view, with-author   |
| `categories/`     | CRUD                                                                     |
| `reviews/`        | CRUD, recipe/[id]                                                        |
| `favorites/`      | toggle per recipe                                                        |
| `follows/`        | follow/unfollow, followers/following lists, stats, is-following          |
| `users/`          | CRUD, authors (profile, stats, search, popular, requests, become-author) |
| `meal-plans/`     | CRUD                                                                     |
| `shopping-lists/` | CRUD                                                                     |
| `upload/`         | file upload                                                              |

All paginated endpoints use `{ offset, limit }` query params and return `{ meta: { total, limit, offset } }`.

## Key Conventions & Gotchas

- **Server types are server-only**: `RecipeResponse`, `UploadResponse`, etc. from `#server/types` are not available in client components. Use shared types (`Recipe`, `Category`, etc.) or inline types for client-side API calls.
- **`noUncheckedIndexedAccess: true`**: Array index access returns `T | undefined`. Use non-null assertions (`arr[index]!`) in v-for templates where the index is known to exist.
- **Pagination is offset-based**: The backend uses `PaginationQueryDto` with `{ offset, limit }` — not page-based. All server proxy routes forward these params.
- **Recipe `category` and `author` fields**: Can be either a string ID (unpopulated) or an object (populated). Always handle both: `typeof r.category === "string" ? r.category : r.category.id`.
- **UForm nesting**: Use `<UForm :schema="itemSchema" :name="`items.${index}`" nested>` for validating dynamic array items. The parent form auto-validates nested forms on submit. The parent schema should not include the nested fields — use a `validate` function for array-level constraints (e.g., "at least one item").
- **UModal trigger pattern**: Use `<slot />` in the modal for the trigger element. Control open state with a local `ref` + `v-model:open`. The parent passes the trigger button as slot content.
- **UFileUpload**: Without `multiple` prop, v-model is `File | undefined` (not `File[]`).
- **USelectMenu `value-key`**: Must be `"id"` not `"_id"` — all Mongoose IDs are serialized as `id` by the backend's global `toJSON` transform.
- **Recipe status filtering**: The public recipes endpoint (`GET /api/recipes`) returns all statuses. Filter client-side with `r.status === "approved"` for public-facing pages.

## Git

- `production` — main branch
- `dev` — development branch

## .gitignore Excludes

`.github/`, `.claude/`, `CLAUDE.md` are gitignored.

## Backend (`../chongkran-backend`)

NestJS + MongoDB (Mongoose). Backend `.env` has `PORT=8080` and `ALLOW_ORIGIN=http://localhost:3000`.

- `pnpm start:dev` — dev server with hot reload
- `pnpm seed` — seed database (requires running backend; default password `Password123!`)
- `pnpm test` / `pnpm test:e2e` — Jest
- `docker-compose up` — backend + MongoDB containers
- Swagger docs at `http://localhost:8080/api/docs`

### API Conventions

- All responses wrapped: `{ status: { code, message, requestId, requestTime }, data: T }`
- `JwtAuthGuard` applied globally; public routes marked `@Public()` on backend
- Roles: `admin`, `author`, `user`. Only `admin`/`author` can create/edit recipes
- All Mongoose schemas have a global `toJSON` transform that maps `_id` → `id` and strips `__v`
