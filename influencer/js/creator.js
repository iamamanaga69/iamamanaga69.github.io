/**
 * FLEXIST Influencer Portal - Creator Dashboard Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Guard the page and get user details
  const authData = await requireAuth();
  if (!authData) return; // requireAuth will handle redirects/messages

  const { session, creator } = authData;
  initDashboard(creator);
});

async function initDashboard(initialCreator) {
  let creatorId = initialCreator.id;
  
  // Setup logout handler
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", signOut);
  }

  // Refresh profile details and render
  await loadCreatorProfile(creatorId);

  // Load active campaigns and earnings history
  await loadActiveCampaigns(creatorId);
  await loadEarningsHistory(creatorId);
}

/**
 * Fetch and render creator profile details
 */
async function loadCreatorProfile(creatorId) {
  try {
    const { data: profile, error } = await supabase
      .from('creators')
      .select('*')
      .eq('id', creatorId)
      .single();

    if (error) throw error;

    // Render name
    const profileName = document.getElementById("profile-name");
    if (profileName) profileName.textContent = profile.name;

    // Render email
    const profileEmail = document.getElementById("profile-email");
    if (profileEmail) profileEmail.textContent = profile.email;

    // Render platform & handle
    const profilePlatform = document.getElementById("profile-platform");
    if (profilePlatform) {
      let handle = "";
      if (profile.primary_platform === "Telegram") handle = profile.telegram_handle;
      else if (profile.primary_platform === "Twitter-X") handle = profile.twitter_handle;
      else if (profile.primary_platform === "YouTube") handle = profile.youtube_channel;
      else if (profile.primary_platform === "Instagram") handle = profile.instagram_handle;
      else handle = profile.telegram_handle || profile.twitter_handle || "Profile";
      
      profilePlatform.textContent = `${profile.primary_platform}: ${handle}`;
    }

    // Render avatar letter
    const profileAvatar = document.getElementById("profile-avatar");
    if (profileAvatar) profileAvatar.textContent = profile.name.charAt(0).toUpperCase();

    // Render total earnings
    const totalEarnedText = document.getElementById("total-earned-amount");
    if (totalEarnedText) {
      totalEarnedText.textContent = `₹${parseFloat(profile.total_earned || 0).toLocaleString('en-IN')}`;
    }
  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

/**
 * Fetch and render campaign assignments currently active
 */
async function loadActiveCampaigns(creatorId) {
  const container = document.getElementById("active-campaigns-container");
  if (!container) return;

  container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">Loading campaigns...</div>`;

  try {
    // Fetch assignments with campaign info
    const { data: assignments, error } = await supabase
      .from('campaign_assignments')
      .select('*, campaigns(*)')
      .eq('creator_id', creatorId)
      .in('status', ['assigned', 'accepted', 'submitted', 'approved']); // approved but not paid

    if (error) throw error;

    if (!assignments || assignments.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-secondary); width: 100%;">
          <p>No active campaigns assigned to you at the moment.</p>
          <p style="font-size: 13px; margin-top: 8px;">The Flexist team will assign you to campaigns when they match your profile.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    assignments.forEach(assignment => {
      const campaign = assignment.campaigns;
      if (!campaign) return;

      const card = document.createElement("div");
      card.className = "campaign-card";
      
      // Format deadline
      const deadlineDate = new Date(campaign.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // Status Badge logic
      let statusBadge = '';
      let actionHtml = '';

      if (assignment.status === 'assigned') {
        statusBadge = `<span class="badge-pending">New Assignment</span>`;
        actionHtml = `
          <button class="neon-button accept-btn" data-id="${assignment.id}" style="width: 100%; margin-top: 10px;">
            Accept Campaign &rarr;
          </button>
        `;
      } else if (assignment.status === 'accepted') {
        statusBadge = `<span class="badge-approved" style="background: rgba(0, 212, 255, 0.15); color: var(--accent-cyan); border-color: rgba(0, 212, 255, 0.3);">Accepted</span>`;
        actionHtml = `
          <form class="submit-proof-form" data-id="${assignment.id}" style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; width: 100%;">
            <div class="field" style="margin-bottom: 12px;">
              <label>Submission Link / Proof URL *</label>
              <input type="url" placeholder="https://x.com/yourpost/status/..." required>
            </div>
            <div class="field" style="margin-bottom: 15px;">
              <label>Notes (Optional)</label>
              <textarea placeholder="Any comments or payment details update..." rows="2" style="resize: none;"></textarea>
            </div>
            <button type="submit" class="neon-button" style="width: 100%; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-green));">
              Submit Proof &rarr;
            </button>
          </form>
        `;
      } else if (assignment.status === 'submitted') {
        statusBadge = `<span class="badge-pending">Awaiting Review</span>`;
        actionHtml = `
          <div style="font-size: 13px; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <strong>Submitted:</strong> <a href="${assignment.submission_url}" target="_blank" style="color: var(--accent-cyan); word-break: break-all;">View Submission</a>
            ${assignment.submission_note ? `<p style="margin-top: 4px; font-style: italic;">"${assignment.submission_note}"</p>` : ''}
          </div>
        `;
      } else if (assignment.status === 'approved') {
        statusBadge = `<span class="badge-approved">Approved — Processing Payment</span>`;
        actionHtml = `
          <div style="font-size: 13px; color: var(--accent-green); background: rgba(0, 255, 136, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(0, 255, 136, 0.1);">
            Task verified! Flexist is processing your payment of ₹${parseFloat(assignment.payment_amount || campaign.budget_per_creator).toLocaleString('en-IN')}.
          </div>
        `;
      }

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <h3 class="campaign-title">${campaign.project_name}</h3>
          ${statusBadge}
        </div>
        <p class="campaign-brief-text">${campaign.project_description}</p>
        
        <div style="font-size: 13px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <strong style="display: block; font-family: var(--font-display); font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px;">Deliverables:</strong>
          <span style="white-space: pre-wrap; line-height: 1.4;">${campaign.deliverables}</span>
        </div>

        <div class="campaign-meta">
          <span>📅 Deadline: <strong>${deadlineDate}</strong></span>
          <span>💰 Budget: <strong style="color: var(--accent-green);">₹${parseFloat(campaign.budget_per_creator).toLocaleString('en-IN')}</strong></span>
        </div>
        
        ${actionHtml}
      `;

      container.appendChild(card);
    });

    // Bind Accept button clicks
    container.querySelectorAll(".accept-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const assignmentId = e.target.dataset.id;
        e.target.disabled = true;
        e.target.textContent = "Accepting...";
        
        try {
          const { error } = await supabase
            .from('campaign_assignments')
            .update({ status: 'accepted' })
            .eq('id', assignmentId);

          if (error) throw error;
          
          // Reload dashboard
          await loadActiveCampaigns(creatorId);
        } catch (err) {
          console.error("Error accepting campaign:", err);
          alert("Could not accept campaign. Please try again.");
          e.target.disabled = false;
          e.target.textContent = "Accept Campaign →";
        }
      });
    });

    // Bind Proof submission forms
    container.querySelectorAll(".submit-proof-form").forEach(form => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const assignmentId = form.dataset.id;
        const submitBtn = form.querySelector("button[type='submit']");
        const urlInput = form.querySelector("input[type='url']");
        const noteInput = form.querySelector("textarea");

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        try {
          const { error } = await supabase
            .from('campaign_assignments')
            .update({
              status: 'submitted',
              submission_url: urlInput.value,
              submission_note: noteInput.value,
              submitted_at: new Date().toISOString()
            })
            .eq('id', assignmentId);

          if (error) throw error;

          // Reload dashboard
          await loadActiveCampaigns(creatorId);
        } catch (err) {
          console.error("Error submitting proof:", err);
          alert("Could not submit proof. Please try again.");
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Proof →";
        }
      });
    });

  } catch (err) {
    console.error("Error loading active campaigns:", err);
    container.innerHTML = `<div style="padding: 20px; text-align: center; color: #ff3c3c;">Failed to load campaigns.</div>`;
  }
}

/**
 * Fetch and render earnings history table
 */
async function loadEarningsHistory(creatorId) {
  const tableBody = document.getElementById("earnings-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">Loading earnings...</td></tr>`;

  try {
    const { data: assignments, error } = await supabase
      .from('campaign_assignments')
      .select('*, campaigns(*)')
      .eq('creator_id', creatorId)
      .eq('status', 'paid')
      .order('paid_at', { ascending: false });

    if (error) throw error;

    if (!assignments || assignments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 24px; color: var(--text-secondary);">
            No payments have been processed yet.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = "";

    assignments.forEach(assignment => {
      const campaign = assignment.campaigns;
      const row = document.createElement("tr");
      
      const paidDate = assignment.paid_at 
        ? new Date(assignment.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '-';

      const amount = assignment.payment_amount || (campaign ? campaign.budget_per_creator : 0);

      row.innerHTML = `
        <td><strong style="color: #fff;">${campaign ? campaign.project_name : 'Deleted Project'}</strong></td>
        <td>Verified Deliverable</td>
        <td style="color: var(--accent-green); font-weight: 500;">₹${parseFloat(amount).toLocaleString('en-IN')}</td>
        <td>${paidDate}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading earnings history:", err);
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ff3c3c;">Failed to load earnings.</td></tr>`;
  }
}
