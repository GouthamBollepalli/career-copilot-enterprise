# Career Copilot Enterprise
Commercial-ready Next.js app with Supabase Auth, protected APIs, Stripe billing + webhook, ATS resume optimizer, and interview coach.

## Quick start
1. Copy `.env.example` → `.env.local` and fill all keys.
2. `npm install`
3. `npm run dev` → open http://localhost:3000
   - Sign in at /login (Google or magic link)
   - Resume optimizer at /resume
   - Interview coach at /interview
   - Pricing & checkout at /pricing

## Required setup
- **Supabase**: create project, get URL + anon key + service role key. Create tables:
```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  is_pro boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled',
  content text not null,
  ats_score int not null default 0,
  created_at timestamptz not null default now()
);
```
- **Stripe**: create Product + Price. Set env: STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_WEBHOOK_SECRET. In Stripe dashboard, add a webhook pointing to `/api/billing/webhook`.

- **OpenAI**: set OPENAI_API_KEY.

- **(Optional) Upstash** for rate limiting: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.

## Deploy to Vercel
- Push to GitHub, import to Vercel, set all env vars, deploy.
- Ensure the webhook URL is your deployed URL + `/api/billing/webhook`.

## Security
- All protected APIs verify Supabase Bearer token server-side.
- Interview feedback endpoint is **Pro-gated** via profiles.is_pro updated by Stripe webhook.
- OpenAI key is server-only.
