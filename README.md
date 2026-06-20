# Aspect CRM — Real Estate Admin Panel

A dark-mode CRM dashboard for **Aspect Infrastructure & Construction** (a division of Aspect Global Ventures). Built as a pitch demo to manage real estate leads from Framer forms.

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL)
- **Recharts** (bar charts)
- **Lucide React** (icons)
- **Google Fonts** — Poppins (headings) + Roboto (body)

## Features

- Dashboard with KPI cards (Total, New, Contacted, Converted)
- Leads-by-type bar chart (Recharts)
- Recent leads table (last 10)
- All Leads page with form type and status filters
- Lead detail page with contact info, status update (auto-saves), and metadata cards
- 4 Framer webhook endpoints (SRA, Redevelopment, Open Plot, Others)
- Status badges and form type badges with Aspect brand colors

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

Create a Supabase project at [supabase.com](https://supabase.com) and run this SQL in the SQL Editor:

```sql
CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type     TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone_number  TEXT NOT NULL,
  email         TEXT,
  status        TEXT NOT NULL DEFAULT 'New',
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Then disable RLS (or create a permissive policy) so the app can read/write:

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON leads FOR ALL USING (true) WITH CHECK (true);
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Find these values in your Supabase dashboard under **Settings → API**.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts          # GET all leads + POST new lead
│   │   │   └── [id]/route.ts     # GET single lead + PATCH status
│   │   ├── sra/route.ts          # Framer webhook: SRA Opportunity
│   │   ├── redevelopment/route.ts # Framer webhook: Redevelopment
│   │   ├── open-plot/route.ts    # Framer webhook: Open Plot
│   │   └── others/route.ts       # Framer webhook: Others
│   ├── dashboard/page.tsx        # Dashboard with KPIs + chart
│   ├── leads/
│   │   ├── page.tsx              # All leads list with filters
│   │   └── [id]/page.tsx         # Lead detail page
│   ├── layout.tsx                # Root layout (Poppins + Roboto fonts)
│   ├── page.tsx                  # Redirects to /dashboard
│   └── globals.css
├── components/
│   ├── Sidebar.tsx               # Navy sidebar with Aspect logo
│   └── Badges.tsx                # StatusBadge + FormTypeBadge
├── lib/
│   └── supabase.ts               # Supabase clients + Lead type
└── .env.local
```

## API Endpoints

### Leads CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads` | Fetch all leads (newest first) |
| `POST` | `/api/leads` | Create a new lead |
| `GET` | `/api/leads/[id]` | Fetch a single lead |
| `PATCH` | `/api/leads/[id]` | Update lead status |

### Framer Webhooks

Each endpoint receives raw Framer form JSON and maps fields to the leads schema.

| Endpoint | Form Type |
|----------|-----------|
| `POST /api/sra` | SRA Opportunity |
| `POST /api/redevelopment` | Redevelopment |
| `POST /api/open-plot` | Open Plot |
| `POST /api/others` | Others |

### Test the API

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "form_type": "SRA Opportunity",
    "full_name": "Rahul Sharma",
    "phone_number": "+919876543210",
    "email": "rahul@example.com",
    "metadata": {
      "society_name": "XYZ CHS",
      "number_of_families": 72,
      "carpet_area_sqft": 380,
      "year_built": 1995,
      "address": "Dharavi, Mumbai"
    }
  }'
```

Expected response:

```json
{ "success": true, "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }
```

## Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Add these environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**
5. Your app will be live at `https://<your-project>.vercel.app`

## Connect to Framer

After deploying, paste these URLs into Framer's form "Send to" settings:

| Framer Form | Send to URL |
|-------------|-------------|
| SRA Opportunity | `https://<your-project>.vercel.app/api/sra` |
| Redevelopment | `https://<your-project>.vercel.app/api/redevelopment` |
| Open Plot | `https://<your-project>.vercel.app/api/open-plot` |
| Others | `https://<your-project>.vercel.app/api/others` |

In Framer, select the form component → **Form Settings** → set method to **POST** → paste the URL.

## Brand

- **Aspect Navy**: `#1B1D4D` — sidebar, backgrounds
- **Aspect Red**: `#D60039` — primary accent, CTAs
- **Aspect Green**: `#166846` — secondary accent, converted state
- Fonts: Poppins (headings) + Roboto (body)
