

# SysDesign Platform -- Complete Build Blueprint (MongoDB Edition)

This document covers the full architecture, features, integrations, and design specs for rebuilding the SysDesign platform from scratch, with MongoDB replacing Supabase and mutations as requested.

---

## 1. Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3.4 + shadcn/ui component library + tailwindcss-animate
- **State Management**: Zustand (Design Lab), TanStack React Query (server state)
- **Routing**: React Router DOM v6
- **Markdown**: react-markdown + remark-gfm
- **Diagramming**: @excalidraw/excalidraw ^0.18
- **Forms**: react-hook-form + zod validation + @hookform/resolvers
- **Icons**: lucide-react
- **Charts/Heatmaps**: recharts (for profile heatmaps)
- **Notifications**: sonner + radix-ui toast

### Backend (MongoDB Mutation)
- **Runtime**: Node.js (Express or Fastify)
- **Database**: MongoDB Atlas (replaces Supabase PostgreSQL)
- **ODM**: Mongoose
- **Auth**: JWT-based (jsonwebtoken + bcrypt) -- or use Auth0/Firebase Auth for speed
- **File Storage**: AWS S3 or Cloudflare R2 (replaces Supabase Storage)
- **Serverless Functions**: AWS Lambda / Cloudflare Workers (replaces Supabase Edge Functions)
- **AI**: Google Gemini API (gemini-2.5-flash for text, gemini-2.5-flash-preview for images)

---

## 2. Environment Keys Required

```text
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sysdesign

# Auth
JWT_SECRET=<random-256-bit-secret>
JWT_EXPIRY=7d

# Google Gemini (AI Generator)
GEMINI_API_KEY=<your-google-ai-api-key>

# File Storage (S3/R2)
S3_BUCKET_NAME=sysdesign-assets
S3_REGION=us-east-1
S3_ACCESS_KEY=<access-key>
S3_SECRET_KEY=<secret-key>
S3_ENDPOINT=<optional-for-r2>

# Frontend (public)
VITE_API_URL=https://api.sysdesign.dev
VITE_APP_URL=https://sysdesign.dev
```

---

## 3. Fonts & Colors (Final)

### Fonts
- **Primary**: `Roboto Mono` (body, UI text)
- **Secondary**: `JetBrains Mono` (code blocks, monospace accents)
- **Fallback**: `Fira Code`, system monospace
- Loaded via Google Fonts with `font-feature-settings: "cv03", "cv04", "cv11"`

### Color System (HSL, dark-first theme)

| Token | HSL Value | Hex Approx | Usage |
|---|---|---|---|
| `--background` | 210 5% 20% | #303233 | Page background |
| `--foreground` | 46 20% 82% | #d9c9a5 | Body text |
| `--primary` | 46 85% 49% | #e2b714 | Gold accent, CTAs, links |
| `--primary-hover` | 46 85% 44% | #cca412 | Hover state |
| `--card` | 210 5% 17% | #292a2c | Card backgrounds |
| `--border` | 210 4% 28% | #444748 | Borders |
| `--muted` | 210 4% 25% | #3c3e40 | Muted bg |
| `--muted-foreground` | 210 4% 42% | #696b6e | Secondary text |
| `--success` | 142 50% 40% | #33a653 | Success states |
| `--destructive` | 0 60% 50% | #cc3333 | Errors, warnings |
| `--ring/focus` | 46 85% 49% | #e2b714 | Focus rings |

### Gradients
- **Hero**: `linear-gradient(135deg, #e2b714 0%, #cca412 50%, #b8901a 100%)`
- **Card**: `linear-gradient(135deg, hsl(210 5% 19%), hsl(210 5% 17%))`

### Theme Color (meta): `#e2b714`

---

## 4. MongoDB Collections (Database Schema)

### `users`
```json
{ "_id", "email", "passwordHash", "username", "full_name", "bio", "avatar_url", "role": "user|admin", "createdAt", "updatedAt" }
```

### `articles`
```json
{ "_id", "title", "content", "excerpt", "company", "company_image", "author_id", "tags[]", "difficulty", "read_time", "published", "is_featured", "upvotes", "downvotes", "views", "diagram_data", "createdAt", "updatedAt" }
```

### `roadmap_articles`
```json
{ "_id", "slug", "title", "content", "excerpt", "category", "difficulty", "tags[]", "read_time", "source_url", "createdAt", "updatedAt" }
```

### `comments`
```json
{ "_id", "article_id", "user_id", "content", "parent_id", "createdAt", "updatedAt" }
```

### `votes`
```json
{ "_id", "article_id", "user_id", "vote_type": "up|down", "createdAt" }
```

### `saved_articles`
```json
{ "_id", "user_id", "article_id", "createdAt" }
```

### `roadmap_progress`
```json
{ "_id", "user_id", "node_id", "completed", "createdAt", "updatedAt" }
```

### `designs`
```json
{ "_id", "user_id", "title", "description", "diagram_data", "is_public", "createdAt", "updatedAt" }
```

### `follows`
```json
{ "_id", "follower_id", "following_id", "createdAt" }
```

**Indexes for speed:**
- `articles`: compound index on `{ published: 1, is_featured: 1 }`, text index on `{ title, content }`
- `roadmap_articles`: unique index on `{ slug: 1 }`
- `votes`: unique index on `{ article_id: 1, user_id: 1 }`
- `saved_articles`: unique index on `{ user_id: 1, article_id: 1 }`
- `roadmap_progress`: unique index on `{ user_id: 1, node_id: 1 }`
- `comments`: index on `{ article_id: 1 }`

---

## 5. API Routes (REST)

```text
# Auth
POST   /api/auth/register        { email, password, username, full_name }
POST   /api/auth/login            { email, password } -> JWT
POST   /api/auth/forgot-password  { email }
POST   /api/auth/reset-password   { token, newPassword }
GET    /api/auth/me               -> current user profile

# Articles (CRUD - users create community articles)
GET    /api/articles              ?published=true&featured=true&company=Netflix&difficulty=...
GET    /api/articles/:id
POST   /api/articles              [auth] create article (author_id = JWT user)
PUT    /api/articles/:id          [auth] update own article
DELETE /api/articles/:id          [auth] delete own article

# Featured Articles (admin-only write)
PUT    /api/articles/:id/feature  [admin] toggle is_featured

# Votes
POST   /api/articles/:id/vote     [auth] { vote_type: "up"|"down" }
DELETE /api/articles/:id/vote     [auth] remove vote

# Comments
GET    /api/articles/:id/comments
POST   /api/articles/:id/comments [auth] { content, parent_id? }
PUT    /api/comments/:id          [auth] update own
DELETE /api/comments/:id          [auth] delete own

# Saved Articles
GET    /api/saved                 [auth]
POST   /api/saved/:articleId      [auth]
DELETE /api/saved/:articleId      [auth]

# Roadmap Articles (admin-only write)
GET    /api/roadmap-articles
GET    /api/roadmap-articles/:slug
PUT    /api/roadmap-articles/:slug [admin] upsert content

# Roadmap Progress
GET    /api/roadmap-progress       [auth]
POST   /api/roadmap-progress       [auth] { node_id, completed }

# Designs
GET    /api/designs                [auth] own designs
POST   /api/designs                [auth]
PUT    /api/designs/:id            [auth]
DELETE /api/designs/:id            [auth]

# Profile
GET    /api/profiles/:userId
PUT    /api/profiles               [auth] update own
POST   /api/profiles/avatar        [auth] upload -> S3

# AI Generator
POST   /api/generate               [auth] { title, company } -> calls Gemini API

# Follows
POST   /api/follows/:userId        [auth]
DELETE /api/follows/:userId        [auth]
GET    /api/follows/followers/:userId
GET    /api/follows/following/:userId
```

---

## 6. Feature Breakdown

### 6.1 Roadmap (30 Modules)
- 30 system design topics across 8 categories: Communication, Infrastructure, Architecture, Theory, Database, Performance, Security, Data Structures, Processing
- Local baseline content in `src/content/roadmap-articles/*.ts` (markdown strings)
- Database overrides: if `roadmap_articles` has a matching slug, it takes priority
- Progress tracking: toggles per-node stored in `roadmap_progress`, supports grid/list view
- Only admin can edit roadmap article content (password gate on frontend + role check on API)

### 6.2 CRUD Articles (Community)
- Any authenticated user can create/edit/delete their own articles
- Split-pane markdown editor with live preview (react-markdown + remark-gfm)
- Fields: title, content (markdown), excerpt, company, tags, difficulty, read_time
- Voting system (up/down per user), view counter, comments
- Save/bookmark articles to profile

### 6.3 AI Generator
- Supabase Edge Function (or Lambda) calling Google Gemini API
- **Text generation**: Gemini 2.5 Flash -- generates full markdown system design article
- **Image generation**: Gemini 2.5 Flash Image Preview -- generates company logo + HLD diagram
- Images uploaded to S3/R2 bucket (not stored as base64 in DB)
- "Post as Article" button saves generated content to `articles` collection with `is_featured` flag
- JWT auth required; input validation (title 5-200 chars, company max 50 chars)

### 6.4 Design Canvas (Excalidraw Integration)

**How Excalidraw is integrated:**

1. **Package**: `@excalidraw/excalidraw ^0.18.0` installed as dependency

2. **Wrapper Component** (`ExcalidrawCanvas.tsx`):
   - Renders `<Excalidraw>` inside a container div with `.excalidraw-wrapper` class
   - Passes `excalidrawAPI` callback to get API reference for programmatic control
   - Detects dark/light theme via MutationObserver on `document.documentElement` class
   - `onChange` callback syncs element positions back to Zustand semantic store
   - Arrow connections detected via `startBinding`/`endBinding` on arrow elements

3. **CSS Isolation** (critical): In `index.css`, `.excalidraw-wrapper` gets:
   ```css
   transform: none !important;
   zoom: 1 !important;
   isolation: isolate;
   position: absolute; top/left/right/bottom: 0;
   ```
   The Excalidraw font is reset to system-ui to avoid inheriting the monospace body font.

4. **Programmatic Element Injection**: `createExcalidrawRect()` creates rectangle + bound text elements with `generateFractionalIndex()` for valid Excalidraw internal ordering keys. Elements include `customData.semanticId` for linking back to the semantic graph.

5. **Dual-State Architecture**: 
   - **Visual layer**: Excalidraw elements (rectangles, arrows, text)
   - **Semantic layer**: Zustand store (`useDesignLabStore`) with `SemanticGraph { nodes, edges }`
   - On element change, positions sync from Excalidraw -> store
   - On programmatic add (drag from sidebar/template), store -> Excalidraw via `updateScene()`

6. **14 Domain Components**: Client, CDN, Load Balancer, API Gateway, API Server, Auth Service, Database, Cache, Message Queue, Worker, Notification Service, Search Service, Object Storage, Monitoring -- each with connection constraint rules

7. **Connection Validation**: When arrows connect two nodes, `nodeDefinitions` constraints are checked. Invalid connections show a destructive toast warning.

8. **Export**: `exportToBlob` (PNG), `exportToSvg` (SVG), `serializeAsJSON` (JSON) from Excalidraw API

9. **Save**: Diagrams saved to `designs` collection with full `diagram_data` (JSON serialized scene)

10. **Templates**: Pre-built diagram templates (e.g., "Basic Web App", "Microservices") loaded via `updateScene()` with pre-positioned elements

### 6.5 Featured Articles (30+ Company Case Studies)
- Netflix, YouTube, WhatsApp, Spotify, Instagram, Uber, Amazon, Google, Meta, etc.
- Stored in `articles` with `is_featured: true`
- Only admin can create/edit/delete featured articles (role-based middleware)
- Filterable by company and difficulty level
- Each has company logo (stored in S3), HLD diagrams, detailed markdown content

### 6.6 Profile
- Avatar upload (S3 bucket, size-limited)
- Editable username, full_name, bio with Zod validation
- **Heatmap**: Activity heatmap using recharts showing article reads/contributions over time (similar to GitHub contribution graph), data sourced from article creation dates, comments, and roadmap progress timestamps
- **Saved Articles**: List of bookmarked articles with links
- **Stats**: Article count, designs created, roadmap completion percentage, follower/following counts
- Protected route -- requires authentication

### 6.7 Admin-Only Access Control
- **Role stored in `users.role` field** (for MongoDB, simpler than separate table since Mongo doesn't have RLS)
- Backend middleware checks `req.user.role === 'admin'` for:
  - Editing/creating roadmap articles
  - Toggling `is_featured` on articles
  - Managing featured articles
- Frontend: Password gate (`sysdesign2024` or custom code) as UX convenience, but real security is server-side role check
- Never trust client-side role checks for authorization

---

## 7. Speed & Security Priorities

### Speed
- **MongoDB indexes** on all query-heavy fields (see section 4)
- **React Query** with stale-while-revalidate caching (5min staleTime for articles)
- **Vite** for sub-second HMR and optimized production builds
- **Code splitting**: Lazy load Design Lab, AI Generator, Article Editor (React.lazy + Suspense)
- **CDN**: Serve static assets via Cloudflare/Vercel edge
- **Image optimization**: Compress uploads on server before S3; serve via CDN with cache headers
- **Connection pooling**: Use MongoDB connection pooling (default in Atlas)
- **Pagination**: Cursor-based pagination for articles list (not offset-based)

### Security
- **JWT with httpOnly cookies** (not localStorage) to prevent XSS token theft
- **Rate limiting**: express-rate-limit on auth routes (5 attempts/15min) and AI generator (10/hour)
- **Input validation**: Zod schemas on frontend + Joi/Zod on backend (dual validation)
- **Helmet.js**: Security headers (HSTS, CSP, X-Frame-Options)
- **CORS**: Whitelist only `sysdesign.dev` origin
- **Password hashing**: bcrypt with salt rounds 12
- **MongoDB**: Enable Atlas audit logs, IP allowlisting, encrypted at rest
- **File upload**: Validate MIME type + file size server-side before S3 upload
- **XSS prevention**: react-markdown sanitizes HTML by default; CSP headers block inline scripts
- **Admin middleware**: Server-side role verification on every admin endpoint -- never rely on frontend checks

---

## 8. Frontend Route Map

```text
/                    -> Landing page (hero, stats, featured companies)
/auth                -> Login/Register (redirects if authenticated)
/roadmap             -> 30-module curriculum grid with progress tracking
/roadmap/:slug       -> Individual roadmap article with markdown editor (admin)
/articles            -> Community articles list with search/filter
/articles/:id        -> Article detail with comments, voting, save
/featured-articles   -> Admin-curated company case studies
/ai-generator        -> AI-powered article generator (Gemini)
/practice            -> Design Lab (Excalidraw canvas)
/profile             -> User profile with heatmap, saved articles, stats
```

---

## 9. Project Structure

```text
src/
├── components/
│   ├── auth/          # ProtectedRoute, PasswordGate
│   ├── layout/        # AppLayout, TopNavbar, MobileNavigation, ThemeToggle
│   ├── profile/       # AvatarUpload, ActivityHeatmap
│   ├── roadmap/       # RoadmapTree, RoadmapNode, RoadmapCard, MarkdownRenderer
│   ├── editor/        # MarkdownEditor, PasswordGate
│   └── ui/            # shadcn/ui components (40+ components)
├── features/
│   └── design-lab/
│       ├── components/ # ExcalidrawCanvas, ComponentSidebar, CanvasHeader, PropertiesPanel
│       ├── data/       # nodeDefinitions (14 components), templates
│       ├── store/      # useDesignLabStore (Zustand)
│       ├── types/      # SemanticGraph, NodeType, etc.
│       └── pages/      # DesignLab
├── content/
│   └── roadmap-articles/ # 30 local markdown article files
├── hooks/             # useAuth, useTheme, useMobile, useToast
├── pages/             # All route pages
├── lib/               # utils (cn function)
└── integrations/      # API client (replaces Supabase client)

server/               # Express/Fastify backend (new)
├── routes/           # auth, articles, roadmap, designs, ai, profiles
├── middleware/       # auth (JWT verify), admin (role check), rateLimiter
├── models/           # Mongoose schemas
├── services/         # Gemini AI service, S3 upload service
└── index.ts          # Server entry
```

This is the complete blueprint. The core differentiator from the current build is replacing Supabase (PostgreSQL + RLS + Edge Functions + Storage) with MongoDB Atlas + Express API + S3 + Gemini direct calls, while keeping the exact same React frontend with adapted API calls.

