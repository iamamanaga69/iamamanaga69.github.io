# FLEXIST INFLUENCER PORTAL — SETUP INSTRUCTIONS

This private influencer portal is built using static HTML, CSS, and vanilla JS, utilizing **Supabase** for database, user authentication, and administration.

Follow these steps to set up and initialize the backend for your portal.

---

## 🛠️ Step-by-Step Setup

### 1. Create a Supabase Project
1. Log in or sign up at [supabase.com](https://supabase.com/).
2. Create a new, free project named `flexist-influencer-portal` (or similar).
3. Set your database password and choose a region close to your target audience (e.g., Mumbai/India).

### 2. Set Up Database Tables
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy and paste the following SQL schema to create the `creators`, `campaigns`, and `campaign_assignments` tables:

```sql
-- TABLE: creators
create table creators (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text unique not null,
  telegram_handle text not null,
  twitter_handle text,
  youtube_channel text,
  instagram_handle text,
  primary_platform text not null,
  follower_count text not null,
  language_primary text not null,
  content_type text[] not null,
  status text default 'pending', -- pending | approved | rejected
  notes text,
  total_earned numeric default 0,
  payment_preference text not null,
  payment_upi text,
  payment_crypto_address text,
  auth_user_id uuid references auth.users(id)
);

-- TABLE: campaigns
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  project_name text not null,
  project_description text not null,
  campaign_brief text not null,
  deliverables text not null,
  deadline date not null,
  budget_per_creator numeric not null,
  status text default 'draft' -- draft | active | completed | cancelled
);

-- TABLE: campaign_assignments
create table campaign_assignments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  creator_id uuid references creators(id) on delete cascade,
  assigned_at timestamptz default now(),
  status text default 'assigned', -- assigned | accepted | submitted | approved | paid
  submission_url text,
  submission_note text,
  submitted_at timestamptz,
  payment_amount numeric,
  payment_status text default 'pending', -- pending | paid
  paid_at timestamptz
);
```
4. Click **Run** to execute the query.

### 3. Configure Magic Link Authentication
1. Go to **Authentication** in the left sidebar.
2. Select **Providers** > **Email**.
3. Make sure **Enable Email Provider** is checked.
4. Set **Confirm Email** to off (unless you specifically want them to confirm their emails, but magic link login works by verifying the email automatically).
5. Ensure **Enable SignUp** is on.
6. Look for **OTP (One-Time Password)** or **Magic Link** configuration and ensure it is enabled.

### 4. Enable Row Level Security (RLS) & Policies
To protect your database so creators can only see their own records, execute this script in the **SQL Editor**:

```sql
-- Enable RLS on all tables
alter table creators enable row level security;
alter table campaigns enable row level security;
alter table campaign_assignments enable row level security;

-- Allow public inserts to creators (so creators can sign up)
create policy "creators_public_insert" on creators
  for insert with check (true);

-- Creators can read/update their own row
create policy "creator_self" on creators
  for all using (
    auth.uid() = auth_user_id or 
    email = auth.jwt()->>'email'
  );

-- Campaigns are readable by all authenticated creators
create policy "campaigns_read" on campaigns
  for select using (auth.role() = 'authenticated');

-- Creators can see/manage their own assignments
create policy "assignment_self" on campaign_assignments
  for all using (
    creator_id in (
      select id from creators where auth_user_id = auth.uid() or email = auth.jwt()->>'email'
    )
  );
```

### 5. Link API Keys
1. Go to **Project Settings** (gear icon) > **API** in your Supabase dashboard.
2. Copy your **Project URL**, **anon public key**, and **service_role key**.
3. Open the codebase files and replace the placeholders:
   - In `influencer/js/auth.js`:
     - Replace `'SUPABASE_URL'` with your actual Project URL.
     - Replace `'SUPABASE_ANON_KEY'` with your actual `anon` key.
   - In `influencer/js/creator.js` (uses the same initialized variables from `auth.js`).
   - In `influencer/js/admin.js`:
     - Replace `'SUPABASE_SERVICE_KEY'` with your actual `service_role` key.
     
> [!CAUTION]
> The `service_role` key bypasses all security rules. **NEVER** share the admin URL or push a commit containing the actual `service_role` key to a public GitHub repository. Aman should keep this key local or restrict access.

---

## 🚀 Deployment & URLs

1. Push all files to your GitHub repository: `https://github.com/iamamanaga69/iamamanaga69.github.io`.
2. Once the build finishes on Vercel/GitHub Pages, your portal will be live at:
   - **Creator Signup:** [https://flexist.in/influencer/signup](https://flexist.in/influencer/signup)
   - **Creator Login:** [https://flexist.in/influencer/login](https://flexist.in/influencer/login)
   - **Creator Dashboard:** [https://flexist.in/influencer/dashboard](https://flexist.in/influencer/dashboard)
   - **Private Admin Dashboard:** [https://flexist.in/influencer/admin](https://flexist.in/influencer/admin)

---

## 🔒 Security Summary

- `/influencer/` is added to your site's `robots.txt` to prevent Google from indexing the pages.
- Every influencer portal page contains the `<meta name="robots" content="noindex, nofollow">` tag.
- The admin page is protected. Even if an attacker finds `/influencer/admin`, they must log in using a magic link. The script hard-guards authentication to **only** allow access if the logged-in user email matches `FlexistCrypto@gmail.com`.
