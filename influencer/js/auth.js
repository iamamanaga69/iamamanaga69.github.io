/**
 * FLEXIST Influencer Portal - Supabase Auth & Schema
 * 
 * ============================================================================
 * DATABASE SCHEMA & RLS POLICIES (Run this in Supabase SQL Editor)
 * ============================================================================
 * 
 * -- Enable UUID generation
 * create extension if not exists "uuid-ossp";
 * 
 * -- TABLE: creators
 * create table creators (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamptz default now(),
 *   name text not null,
 *   email text unique not null,
 *   telegram_handle text not null,
 *   twitter_handle text,
 *   youtube_channel text,
 *   instagram_handle text,
 *   primary_platform text not null,
 *   follower_count text not null,
 *   language_primary text not null,
 *   content_type text[] not null, -- ['Text Posts', 'Short Videos', 'Long Videos', etc.]
 *   status text default 'pending', -- pending | approved | rejected
 *   notes text,
 *   total_earned numeric default 0,
 *   payment_preference text not null, -- UPI | Crypto | Both
 *   payment_upi text,
 *   payment_crypto_address text,
 *   auth_user_id uuid references auth.users(id)
 * );
 * 
 * -- TABLE: campaigns
 * create table campaigns (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamptz default now(),
 *   project_name text not null,
 *   project_description text not null,
 *   campaign_brief text not null,
 *   deliverables text not null,
 *   deadline date not null,
 *   budget_per_creator numeric not null,
 *   status text default 'draft' -- draft | active | completed | cancelled
 * );
 * 
 * -- TABLE: campaign_assignments
 * create table campaign_assignments (
 *   id uuid primary key default gen_random_uuid(),
 *   campaign_id uuid references campaigns(id) on delete cascade,
 *   creator_id uuid references creators(id) on delete cascade,
 *   assigned_at timestamptz default now(),
 *   status text default 'assigned', -- assigned | accepted | submitted | approved | paid
 *   submission_url text,
 *   submission_note text,
 *   submitted_at timestamptz,
 *   payment_amount numeric,
 *   payment_status text default 'pending', -- pending | paid
 *   paid_at timestamptz
 * );
 * 
 * -- Enable Row Level Security (RLS)
 * alter table creators enable row level security;
 * alter table campaigns enable row level security;
 * alter table campaign_assignments enable row level security;
 * 
 * -- Allow public inserts to creators (for signup)
 * create policy "creators_public_insert" on creators
 *   for insert with check (true);
 * 
 * -- Creators can read/update their own row (either by uuid or email match in JWT)
 * create policy "creator_self" on creators
 *   for all using (
 *     auth.uid() = auth_user_id or 
 *     email = auth.jwt()->>'email'
 *   );
 * 
 * -- Campaigns are readable by all authenticated users
 * create policy "campaigns_read" on campaigns
 *   for select using (auth.role() = 'authenticated');
 * 
 * -- Creators can see/manage their own assignments
 * create policy "assignment_self" on campaign_assignments
 *   for all using (
 *     creator_id in (
 *       select id from creators where auth_user_id = auth.uid() or email = auth.jwt()->>'email'
 *     )
 *   );
 * 
 * -- NOTE: Admin panel uses Supabase service_role key to bypass all RLS policies.
 * ============================================================================
 */

// Placeholders for Supabase credentials - You will replace these
const SUPABASE_URL = 'SUPABASE_URL';
const SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY';

// Initialize Supabase Client
let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase CDN not loaded.");
}

/**
 * Gets the current active session
 */
async function getSession() {
  if (!supabase) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }
  return session;
}

/**
 * Signs the user out and redirects to login
 */
async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

/**
 * Automatically link the auth.users ID with creators table auth_user_id
 */
async function linkAuthUser(session) {
  if (!supabase || !session || !session.user) return null;
  const user = session.user;

  try {
    // Check if creator exists by email
    const { data: creator, error } = await supabase
      .from('creators')
      .select('id, auth_user_id, status')
      .eq('email', user.email)
      .maybeSingle();

    if (error) {
      console.error("Error querying creator:", error);
      return null;
    }

    if (creator) {
      // If auth_user_id is not set, set it now
      if (!creator.auth_user_id) {
        const { error: updateError } = await supabase
          .from('creators')
          .update({ auth_user_id: user.id })
          .eq('id', creator.id);

        if (updateError) {
          console.error("Error linking auth user ID:", updateError);
        }
      }
      return creator;
    }
    return null;
  } catch (err) {
    console.error("linkAuthUser failed:", err);
    return null;
  }
}

/**
 * Guards page for creators, redirects if unauthenticated or status not approved
 */
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }

  const creator = await linkAuthUser(session);
  if (!creator) {
    // No application found for this email
    document.body.innerHTML = `
      <div class="auth-container" style="max-width: 500px; text-align: center;">
        <div class="auth-header">
          <h1>Application Not Found</h1>
          <p>No creator profile is registered under <strong>${session.user.email}</strong>.</p>
          <p style="margin-top: 20px;">
            <a href="signup.html" class="neon-button" style="display: inline-block;">Apply Now &rarr;</a>
          </p>
          <p style="margin-top: 15px;">
            <button onclick="signOut()" class="ghost-button" style="display: inline-block;">Logout</button>
          </p>
        </div>
      </div>
    `;
    return null;
  }

  if (creator.status === 'pending') {
    document.body.innerHTML = `
      <div class="auth-container" style="max-width: 500px; text-align: center;">
        <div class="auth-header">
          <div style="font-size: 3rem; margin-bottom: 15px;">⏳</div>
          <h1>Application Pending</h1>
          <p>Your creator profile application for <strong>${session.user.email}</strong> is currently under review.</p>
          <p style="margin-top: 10px; color: var(--text-secondary);">The Flexist team will review your profile and update your access. Please check back in 24-48 hours.</p>
          <p style="margin-top: 24px;">
            <button onclick="signOut()" class="ghost-button">Logout</button>
          </p>
        </div>
      </div>
    `;
    return null;
  }

  if (creator.status === 'rejected') {
    document.body.innerHTML = `
      <div class="auth-container" style="max-width: 500px; text-align: center;">
        <div class="auth-header">
          <div style="font-size: 3rem; margin-bottom: 15px;">❌</div>
          <h1>Application Declined</h1>
          <p>We regret to inform you that your creator partner application for <strong>${session.user.email}</strong> was not approved at this time.</p>
          <p style="margin-top: 10px; color: var(--text-secondary);">If you believe this was an error, please reach out to Flexist support directly.</p>
          <p style="margin-top: 24px;">
            <button onclick="signOut()" class="ghost-button">Logout</button>
          </p>
        </div>
      </div>
    `;
    return null;
  }

  return { session, creator };
}

/**
 * Guards page for admin (admin only)
 */
async function requireAdmin() {
  const session = await getSession();
  const adminEmail = 'FlexistCrypto@gmail.com';

  if (!session) {
    window.location.href = 'login.html';
    return null;
  }

  if (session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    document.body.innerHTML = `
      <div class="auth-container" style="max-width: 500px; text-align: center;">
        <div class="auth-header">
          <div style="font-size: 3rem; margin-bottom: 15px;">⛔</div>
          <h1>Access Denied</h1>
          <p>You do not have administrative access to this portal.</p>
          <p style="margin-top: 10px; color: var(--text-secondary);">Logged in as: ${session.user.email}</p>
          <p style="margin-top: 24px;">
            <button onclick="signOut()" class="ghost-button">Logout</button>
          </p>
        </div>
      </div>
    `;
    return null;
  }

  return session;
}
