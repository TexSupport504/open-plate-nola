# Open Plate NOLA

A food resource navigation system for New Orleans designed to help unhoused residents and working poor find food resources via SMS and web.

## Mission

Get food access information to people who need it most — unhoused residents and working poor — with zero barriers, updated in real time, city-wide.

## Core Principles

- No app download required
- No ID, no signup, no questions asked
- Works for people with smartphones AND people without (SMS-first)
- Community-maintained so it stays accurate
- Dignity-first design

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL with real-time updates)
- **Maps**: Leaflet with OpenStreetMap (Phase 2)
- **SMS**: Twilio (Phase 3)
- **Hosting**: Vercel

## Project Structure

```
open-plate-nola/
├── app/
│   ├── page.tsx              # Landing page with resource listings
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard for managing resources
│   └── api/
│       └── resources/
│           ├── route.ts      # API for querying/creating resources
│           └── [id]/
│               └── route.ts  # API for single resource operations
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   └── types.ts              # TypeScript type definitions
├── scripts/
│   └── seed.ts               # Database seeding script
└── supabase/
    └── migrations/
        └── 001_create_resources_table.sql
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd open-plate-nola
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration script:
   - Copy contents of `supabase/migrations/001_create_resources_table.sql`
   - Paste into SQL Editor and run

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Seed the Database

```bash
npx tsx scripts/seed.ts
```

### 5. Run Development Server

```bash
npm run dev
```

Visit:
- http://localhost:3000 - Public site
- http://localhost:3000/admin - Admin dashboard

## API Reference

### GET /api/resources

Query food resources with optional filters.

**Query Parameters:**
- `type` - Filter by type: `fridge`, `pantry`, `hot_meal`, `mobile_distribution`
- `neighborhood` - Filter by neighborhood name (partial match)
- `requirements` - Filter by requirements: `none`, `id_required`, `proof_of_address`, `income_verification`
- `status` - Filter by status (default excludes `permanently_closed`)
- `open_now` - Set to `true` to only show currently open resources

**Example:**
```
GET /api/resources?type=fridge&open_now=true
```

### POST /api/resources

Create a new resource (requires service role key for now).

### GET /api/resources/[id]

Get a single resource by ID.

### PUT /api/resources/[id]

Update a resource.

### PATCH /api/resources/[id]

Partial update (e.g., status update).

### DELETE /api/resources/[id]

Delete a resource.

## Resource Types

1. **Community Fridges** (`fridge`) - 24/7, no requirements, take what you need
2. **Food Pantries** (`pantry`) - May have hours and some requirements
3. **Hot Meal Programs** (`hot_meal`) - Specific serving times
4. **Mobile Distributions** (`mobile_distribution`) - Scheduled events at various locations

## Roadmap

### Phase 1: Data Foundation (Complete)
- [x] Database schema
- [x] Seed data with initial resources
- [x] API routes for CRUD operations
- [x] Admin dashboard
- [x] Basic public listing page

### Phase 2: Web Dashboard
- [ ] Interactive map with Leaflet
- [ ] Filter by "Open now"
- [ ] Filter by resource type
- [ ] Filter by "No ID required"
- [ ] Mobile-responsive design
- [ ] Volunteer status update buttons

### Phase 3: SMS System
- [ ] Twilio integration
- [ ] Text "FOOD" to get nearby resources
- [ ] Neighborhood/zip code filtering
- [ ] Bilingual support (English/Spanish)

## Contributing

This is a community resource. Help keep information accurate by:
- Updating resource status when you visit a location
- Reporting new resources
- Fixing incorrect information

## License

[License TBD]

---

Built with love for New Orleans.
