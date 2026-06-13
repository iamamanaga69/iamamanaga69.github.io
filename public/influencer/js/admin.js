/**
 * FLEXIST Influencer Portal - Admin Dashboard Logic
 * 
 * IMPORTANT: This file contains the SUPABASE_SERVICE_KEY placeholder.
 * The service role key bypasses Row-Level Security (RLS) to allow the admin
 * to view and modify all records. This key should never be committed with a real
 * secret key to a public repository.
 */

// Placeholders - Aman will replace these
const SUPABASE_SERVICE_KEY = 'SUPABASE_SERVICE_KEY';

let supabaseAdmin = null;

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Guard page (Only allow FlexistCrypto@gmail.com)
  const session = await requireAdmin();
  if (!session) return;

  // 2. Initialize admin client with service role key
  if (window.supabase) {
    supabaseAdmin = window.supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  } else {
    alert("Supabase script failed to load. Admin panel inactive.");
    return;
  }

  // 3. Initialize admin panel interface
  initAdminPanel();
});

function initAdminPanel() {
  // Logout handler
  document.getElementById("logout-btn").addEventListener("click", signOut);

  // Tab switching
  const tabs = document.querySelectorAll(".admin-tab");
  const sections = document.querySelectorAll(".admin-panel-section");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetSectionId = tab.dataset.section;

      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(targetSectionId).classList.add("active");

      // Load data for the active tab
      loadSectionData(targetSectionId);
    });
  });

  // Default section load
  loadSectionData("creators-section");

  // Bind modals close buttons
  document.querySelectorAll(".modal-close, .modal-overlay").forEach(element => {
    element.addEventListener("click", (e) => {
      // Close modal only if clicking close button or clicking overlay background (not the modal-box)
      if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-close")) {
        closeAllModals();
      }
    });
  });

  // Bind New Campaign form submit
  const newCampaignForm = document.getElementById("new-campaign-form");
  if (newCampaignForm) {
    newCampaignForm.addEventListener("submit", handleCreateCampaign);
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.style.display = "none";
  });
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  }
}

/**
 * Load appropriate data when tab changes
 */
function loadSectionData(sectionId) {
  if (sectionId === "creators-section") {
    loadCreatorsList();
  } else if (sectionId === "campaigns-section") {
    loadCampaignsList();
  } else if (sectionId === "assignments-section") {
    loadAssignmentsList();
  }
}

/* ============================================================================
   TAB 1: CREATORS MANAGEMENT
   ============================================================================ */

let creatorsFilter = "all";

async function loadCreatorsList() {
  const tableBody = document.getElementById("creators-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Loading creators...</td></tr>`;

  // Bind filter buttons if not already bound
  const filterContainer = document.getElementById("creators-filters");
  if (filterContainer && !filterContainer.dataset.bound) {
    filterContainer.dataset.bound = "true";
    filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        creatorsFilter = e.target.dataset.filter;
        loadCreatorsList();
      });
    });
  }

  try {
    let query = supabaseAdmin.from('creators').select('*').order('created_at', { ascending: false });

    if (creatorsFilter !== "all") {
      query = query.eq('status', creatorsFilter);
    }

    const { data: creators, error } = await query;
    if (error) throw error;

    if (!creators || creators.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-secondary);">No creators found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    creators.forEach(creator => {
      const appliedDate = new Date(creator.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // Platform details
      let primaryPlatform = creator.primary_platform;
      let followers = creator.follower_count;

      const tr = document.createElement("tr");
      
      let statusBadge = "";
      if (creator.status === 'pending') statusBadge = `<span class="badge-pending">Pending</span>`;
      else if (creator.status === 'approved') statusBadge = `<span class="badge-approved">Approved</span>`;
      else if (creator.status === 'rejected') statusBadge = `<span class="badge-rejected">Rejected</span>`;

      // Actions html
      let actionButtons = "";
      if (creator.status === 'pending') {
        actionButtons = `
          <button class="neon-button approve-creator-btn" data-id="${creator.id}" style="padding: 4px 10px; font-size: 11px; margin-right: 4px; background: rgba(0, 255, 136, 0.15); border-color: var(--accent-green); color: var(--accent-green);">Approve</button>
          <button class="ghost-button reject-creator-btn" data-id="${creator.id}" style="padding: 4px 10px; font-size: 11px; color: #ff3c3c; border-color: rgba(255,60,60,0.3);">Reject</button>
        `;
      } else {
        actionButtons = `
          <button class="ghost-button view-creator-btn" data-id="${creator.id}" style="padding: 4px 10px; font-size: 11px;">View Profile</button>
        `;
      }

      tr.innerHTML = `
        <td><strong style="color: #fff;">${creator.name}</strong><br><small style="color: var(--text-secondary);">${creator.email}</small></td>
        <td>${primaryPlatform}</td>
        <td>${followers}</td>
        <td>${creator.language_primary}</td>
        <td>${statusBadge}</td>
        <td>${appliedDate}</td>
        <td>${actionButtons}</td>
      `;

      tableBody.appendChild(tr);
    });

    // Bind action events
    tableBody.querySelectorAll(".approve-creator-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        e.target.disabled = true;
        try {
          const { error } = await supabaseAdmin.from('creators').update({ status: 'approved' }).eq('id', id);
          if (error) throw error;
          loadCreatorsList();
        } catch (err) {
          console.error("Error approving:", err);
          alert("Action failed.");
        }
      });
    });

    tableBody.querySelectorAll(".reject-creator-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        e.target.disabled = true;
        try {
          const { error } = await supabaseAdmin.from('creators').update({ status: 'rejected' }).eq('id', id);
          if (error) throw error;
          loadCreatorsList();
        } catch (err) {
          console.error("Error rejecting:", err);
          alert("Action failed.");
        }
      });
    });

    tableBody.querySelectorAll(".view-creator-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const creatorData = creators.find(c => c.id === id);
        if (creatorData) showCreatorProfileModal(creatorData);
      });
    });

  } catch (err) {
    console.error("Error loading creators:", err);
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ff3c3c; padding: 20px;">Failed to load.</td></tr>`;
  }
}

function showCreatorProfileModal(creator) {
  const detailsContainer = document.getElementById("creator-detail-content");
  if (!detailsContainer) return;

  const notesText = creator.notes || "";
  const languages = creator.language_primary;
  const contentTypes = Array.isArray(creator.content_type) ? creator.content_type.join(", ") : creator.content_type;

  detailsContainer.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px;">
      <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-green)); display:flex; align-items:center; justify-content:center; font-size: 24px; font-weight:bold; color:var(--bg-primary);">${creator.name.charAt(0).toUpperCase()}</div>
      <div>
        <h2 style="font-family:var(--font-display); margin:0; font-size: 22px;">${creator.name}</h2>
        <p style="color:var(--text-secondary); margin:4px 0 0 0; font-size:14px;">${creator.email}</p>
      </div>
    </div>
    
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 24px;">
      <div>
        <small style="display:block; text-transform:uppercase; font-family:var(--font-mono); color:var(--text-secondary); font-size:10px;">Primary Platform</small>
        <strong>${creator.primary_platform}</strong>
      </div>
      <div>
        <small style="display:block; text-transform:uppercase; font-family:var(--font-mono); color:var(--text-secondary); font-size:10px;">Followers</small>
        <strong>${creator.follower_count}</strong>
      </div>
      <div>
        <small style="display:block; text-transform:uppercase; font-family:var(--font-mono); color:var(--text-secondary); font-size:10px;">Language</small>
        <strong>${languages}</strong>
      </div>
      <div>
        <small style="display:block; text-transform:uppercase; font-family:var(--font-mono); color:var(--text-secondary); font-size:10px;">Content Formats</small>
        <strong>${contentTypes}</strong>
      </div>
    </div>

    <h4 style="font-family:var(--font-display); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Social Handles</h4>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom: 24px; font-size: 13px;">
      <div>📱 Telegram: <strong>${creator.telegram_handle || '-'}</strong></div>
      <div>🐦 X/Twitter: <strong>${creator.twitter_handle || '-'}</strong></div>
      <div>🎥 YouTube: <strong>${creator.youtube_channel ? `<a href="${creator.youtube_channel}" target="_blank" style="color:var(--accent-cyan);">Link</a>` : '-'}</strong></div>
      <div>📸 Instagram: <strong>${creator.instagram_handle || '-'}</strong></div>
    </div>

    <h4 style="font-family:var(--font-display); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Payment Info</h4>
    <div style="margin-bottom: 24px; font-size: 13px;">
      <div>Preference: <strong>${creator.payment_preference}</strong></div>
      ${creator.payment_upi ? `<div style="margin-top:6px;">UPI ID: <strong style="color: var(--accent-cyan); font-family:var(--font-mono);">${creator.payment_upi}</strong></div>` : ''}
      ${creator.payment_crypto_address ? `<div style="margin-top:6px;">USDT ERC20/TRC20 Address: <strong style="color: var(--accent-green); font-family:var(--font-mono); word-break:break-all;">${creator.payment_crypto_address}</strong></div>` : ''}
    </div>

    <h4 style="font-family:var(--font-display); margin-bottom: 8px; font-size: 14px;">Internal Notes</h4>
    <div class="field" style="margin-bottom: 16px;">
      <textarea id="creator-notes-textarea" placeholder="Add private feedback, campaign performance, conversion rates..." rows="3" style="width: 100%; resize: vertical;">${notesText}</textarea>
    </div>
    <button id="save-creator-notes-btn" class="neon-button" data-id="${creator.id}" style="width: 100%; padding: 10px;">
      Save Notes
    </button>
  `;

  showModal("creator-detail-modal");

  // Notes save binding
  document.getElementById("save-creator-notes-btn").addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const notesValue = document.getElementById("creator-notes-textarea").value;
    e.target.disabled = true;
    e.target.textContent = "Saving...";

    try {
      const { error } = await supabaseAdmin.from('creators').update({ notes: notesValue }).eq('id', id);
      if (error) throw error;
      
      // Update creator note locally and refresh UI
      creator.notes = notesValue;
      alert("Notes updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save notes.");
    } finally {
      e.target.disabled = false;
      e.target.textContent = "Save Notes";
    }
  });
}


/* ============================================================================
   TAB 2: CAMPAIGNS MANAGEMENT
   ============================================================================ */

async function loadCampaignsList() {
  const tableBody = document.getElementById("campaigns-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">Loading campaigns...</td></tr>`;

  // Bind New Campaign button if not bound
  const newCampaignBtn = document.getElementById("new-campaign-btn");
  if (newCampaignBtn && !newCampaignBtn.dataset.bound) {
    newCampaignBtn.dataset.bound = "true";
    newCampaignBtn.addEventListener("click", () => {
      document.getElementById("new-campaign-form").reset();
      showModal("new-campaign-modal");
    });
  }

  try {
    // Fetch campaigns
    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch assignments to count how many creators assigned
    const { data: assignments, error: assError } = await supabaseAdmin
      .from('campaign_assignments')
      .select('campaign_id');
    
    if (assError) throw assError;

    if (!campaigns || campaigns.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-secondary);">No campaigns created yet. Click "+ New Campaign" to start.</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    campaigns.forEach(campaign => {
      // Calculate assigned creators count
      const creatorCount = assignments ? assignments.filter(a => a.campaign_id === campaign.id).length : 0;
      
      const deadlineDate = new Date(campaign.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const tr = document.createElement("tr");

      let statusBadge = "";
      if (campaign.status === 'draft') statusBadge = `<span class="badge-pending" style="background:rgba(255,255,255,0.05); color:var(--text-secondary); border-color:rgba(255,255,255,0.1);">Draft</span>`;
      else if (campaign.status === 'active') statusBadge = `<span class="badge-approved" style="background:rgba(0, 212, 255, 0.15); color:var(--accent-cyan); border-color:rgba(0, 212, 255, 0.3);">Active</span>`;
      else if (campaign.status === 'completed') statusBadge = `<span class="badge-approved">Completed</span>`;
      else if (campaign.status === 'cancelled') statusBadge = `<span class="badge-rejected">Cancelled</span>`;

      // Actions
      let actionButtons = `
        <button class="ghost-button assign-creators-btn" data-id="${campaign.id}" data-name="${campaign.project_name}" style="padding: 4px 10px; font-size: 11px; margin-right: 4px;">Assign</button>
      `;
      if (campaign.status === 'active') {
        actionButtons += `
          <button class="neon-button complete-campaign-btn" data-id="${campaign.id}" style="padding: 4px 10px; font-size: 11px;">Complete</button>
        `;
      }

      tr.innerHTML = `
        <td><strong style="color: #fff;">${campaign.project_name}</strong></td>
        <td>${statusBadge}</td>
        <td>${deadlineDate}</td>
        <td style="color: var(--accent-green); font-weight: 500;">₹${parseFloat(campaign.budget_per_creator).toLocaleString('en-IN')}</td>
        <td><span style="font-weight:bold; color: #fff;">${creatorCount}</span> assigned</td>
        <td>${actionButtons}</td>
      `;

      tableBody.appendChild(tr);
    });

    // Bind Assign Creators click
    tableBody.querySelectorAll(".assign-creators-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        showAssignCreatorsModal(id, name);
      });
    });

    // Bind Complete Campaign click
    tableBody.querySelectorAll(".complete-campaign-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        e.target.disabled = true;
        if (!confirm("Are you sure you want to mark this campaign as complete?")) {
          e.target.disabled = false;
          return;
        }

        try {
          // Update campaign status
          const { error } = await supabaseAdmin
            .from('campaigns')
            .update({ status: 'completed' })
            .eq('id', id);

          if (error) throw error;
          
          loadCampaignsList();
        } catch (err) {
          console.error("Error completing campaign:", err);
          alert("Action failed.");
          e.target.disabled = false;
        }
      });
    });

  } catch (err) {
    console.error("Error loading campaigns:", err);
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ff3c3c; padding: 20px;">Failed to load.</td></tr>`;
  }
}

/**
 * Handle new campaign creation form submit
 */
async function handleCreateCampaign(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  const newCampaign = {
    project_name: document.getElementById("campaign-project").value,
    project_description: document.getElementById("campaign-description").value,
    campaign_brief: document.getElementById("campaign-brief").value,
    deliverables: document.getElementById("campaign-deliverables").value,
    deadline: document.getElementById("campaign-deadline").value,
    budget_per_creator: parseFloat(document.getElementById("campaign-budget").value),
    status: document.getElementById("campaign-status").value
  };

  try {
    const { error } = await supabaseAdmin
      .from('campaigns')
      .insert([newCampaign]);

    if (error) throw error;

    closeAllModals();
    loadCampaignsList();
  } catch (err) {
    console.error("Error creating campaign:", err);
    alert("Could not create campaign. Check date format or inputs.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Campaign";
  }
}

/**
 * Show list of approved creators with checkboxes to assign
 */
async function showAssignCreatorsModal(campaignId, projectName) {
  const container = document.getElementById("assign-creators-list");
  if (!container) return;

  document.getElementById("assign-modal-title").textContent = `Assign Creators: ${projectName}`;
  container.innerHTML = `<p style="color:var(--text-secondary);">Loading approved creators...</p>`;
  showModal("assign-creators-modal");

  try {
    // 1. Fetch approved creators
    const { data: creators, error: cError } = await supabaseAdmin
      .from('creators')
      .select('id, name, primary_platform, follower_count')
      .eq('status', 'approved');

    if (cError) throw cError;

    // 2. Fetch already assigned creators for this campaign
    const { data: existingAssignments, error: eError } = await supabaseAdmin
      .from('campaign_assignments')
      .select('creator_id')
      .eq('campaign_id', campaignId);

    if (eError) throw eError;

    const assignedIds = existingAssignments ? existingAssignments.map(a => a.creator_id) : [];

    if (!creators || creators.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-secondary);">No approved creators found. You must approve creators in the "Creators" tab first.</p>`;
      return;
    }

    container.innerHTML = "";

    creators.forEach(creator => {
      const isAssigned = assignedIds.includes(creator.id);

      const div = document.createElement("div");
      div.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.03);";
      
      div.innerHTML = `
        <label class="checkbox-item" style="width: 100%;">
          <input type="checkbox" data-id="${creator.id}" ${isAssigned ? 'checked disabled' : ''}>
          <span>
            <strong style="color:#fff;">${creator.name}</strong> 
            <small style="color:var(--text-secondary); margin-left: 8px;">(${creator.primary_platform} - ${creator.follower_count})</small>
            ${isAssigned ? '<span style="font-size:10px; color: var(--accent-green); margin-left: 10px;">[Already Assigned]</span>' : ''}
          </span>
        </label>
      `;

      container.appendChild(div);
    });

    // Save assignments button click binding
    const saveBtn = document.getElementById("save-assignments-btn");
    
    // Remove old event listeners
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener("click", async (e) => {
      e.target.disabled = true;
      e.target.textContent = "Assigning...";

      const selectedCreatorIds = [];
      container.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        if (!checkbox.disabled) { // Do not assign already assigned ones
          selectedCreatorIds.push(checkbox.dataset.id);
        }
      });

      if (selectedCreatorIds.length === 0) {
        closeAllModals();
        return;
      }

      const assignmentsToInsert = selectedCreatorIds.map(creatorId => ({
        campaign_id: campaignId,
        creator_id: creatorId,
        status: 'assigned'
      }));

      try {
        const { error } = await supabaseAdmin
          .from('campaign_assignments')
          .insert(assignmentsToInsert);

        if (error) throw error;

        closeAllModals();
        loadCampaignsList();
      } catch (err) {
        console.error("Error creating assignments:", err);
        alert("Failed to assign creators.");
        e.target.disabled = false;
        e.target.textContent = "Assign Selected Creators";
      }
    });

  } catch (err) {
    console.error("Error loading assign modal data:", err);
    container.innerHTML = `<p style="color:#ff3c3c;">Failed to load creators list.</p>`;
  }
}


/* ============================================================================
   TAB 3: ASSIGNMENTS & PAYOUTS
   ============================================================================ */

let assignmentsFilter = "all";

async function loadAssignmentsList() {
  const tableBody = document.getElementById("assignments-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Loading tasks...</td></tr>`;

  // Bind filter buttons if not already bound
  const filterContainer = document.getElementById("assignments-filters");
  if (filterContainer && !filterContainer.dataset.bound) {
    filterContainer.dataset.bound = "true";
    filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        assignmentsFilter = e.target.dataset.filter;
        loadAssignmentsList();
      });
    });
  }

  try {
    let query = supabaseAdmin
      .from('campaign_assignments')
      .select('*, creators(*), campaigns(*)');

    // Apply status filter
    if (assignmentsFilter === "submitted") {
      query = query.eq('status', 'submitted');
    } else if (assignmentsFilter === "approved") {
      query = query.eq('status', 'approved');
    } else if (assignmentsFilter === "paid") {
      query = query.eq('status', 'paid');
    }

    const { data: assignments, error } = await query;
    if (error) throw error;

    if (!assignments || assignments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-secondary);">No assignments found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    assignments.forEach(assignment => {
      const creator = assignment.creators;
      const campaign = assignment.campaigns;
      
      if (!creator || !campaign) return;

      const submissionDate = assignment.submitted_at 
        ? new Date(assignment.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })
        : '-';

      const tr = document.createElement("tr");

      let statusBadge = "";
      if (assignment.status === 'assigned') statusBadge = `<span class="badge-pending" style="background:rgba(255,255,255,0.05); color:var(--text-secondary); border-color:rgba(255,255,255,0.1);">Assigned</span>`;
      else if (assignment.status === 'accepted') statusBadge = `<span class="badge-approved" style="background:rgba(0, 212, 255, 0.15); color:var(--accent-cyan); border-color:rgba(0, 212, 255, 0.3);">Accepted</span>`;
      else if (assignment.status === 'submitted') statusBadge = `<span class="badge-pending">Submitted</span>`;
      else if (assignment.status === 'approved') statusBadge = `<span class="badge-approved" style="background: rgba(0,255,136,0.08); border-color: var(--accent-green); color: var(--accent-green);">Approved</span>`;
      else if (assignment.status === 'paid') statusBadge = `<span class="badge-paid">Paid ✓</span>`;

      // Submission link column
      let submissionLinkHtml = '-';
      if (assignment.submission_url) {
        submissionLinkHtml = `
          <a href="${assignment.submission_url}" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">Open Link</a>
          ${assignment.submission_note ? `<br><small style="color:var(--text-secondary); font-style:italic;">"${assignment.submission_note}"</small>` : ''}
        `;
      }

      // Action column logic
      let actionButtons = "";
      if (assignment.status === 'submitted') {
        actionButtons = `
          <button class="neon-button approve-submission-btn" data-id="${assignment.id}" style="padding: 4px 10px; font-size: 11px; margin-right: 4px; background: rgba(0, 255, 136, 0.15); border-color: var(--accent-green); color: var(--accent-green);">Verify</button>
          <button class="ghost-button reject-submission-btn" data-id="${assignment.id}" style="padding: 4px 10px; font-size: 11px; color: #ff3c3c; border-color: rgba(255,60,60,0.3);">Reject</button>
        `;
      } else if (assignment.status === 'approved') {
        actionButtons = `
          <button class="neon-button payout-btn" data-id="${assignment.id}" data-creator-id="${creator.id}" data-amount="${campaign.budget_per_creator}" data-creator-name="${creator.name}" data-payment-pref="${creator.payment_preference}" style="padding: 4px 10px; font-size: 11px; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-green));">Mark Paid</button>
        `;
      }

      tr.innerHTML = `
        <td><strong style="color: #fff;">${creator.name}</strong></td>
        <td><strong>${campaign.project_name}</strong></td>
        <td>${statusBadge}</td>
        <td>${submissionDate}</td>
        <td>${submissionLinkHtml}</td>
        <td style="color: var(--accent-green); font-weight: 500;">₹${parseFloat(assignment.payment_amount || campaign.budget_per_creator).toLocaleString('en-IN')}</td>
        <td>${actionButtons}</td>
      `;

      tableBody.appendChild(tr);
    });

    // Bind Approve submission click
    tableBody.querySelectorAll(".approve-submission-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        e.target.disabled = true;
        try {
          const { error } = await supabaseAdmin
            .from('campaign_assignments')
            .update({ status: 'approved' })
            .eq('id', id);

          if (error) throw error;
          loadAssignmentsList();
        } catch (err) {
          console.error("Error verifying submission:", err);
          alert("Action failed.");
          e.target.disabled = false;
        }
      });
    });

    // Bind Reject submission click
    tableBody.querySelectorAll(".reject-submission-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        e.target.disabled = true;
        if (!confirm("Reject submission? This resets the task back to 'accepted' so the creator can re-submit proof.")) {
          e.target.disabled = false;
          return;
        }

        try {
          const { error } = await supabaseAdmin
            .from('campaign_assignments')
            .update({ 
              status: 'accepted',
              submission_url: null,
              submission_note: null,
              submitted_at: null
            })
            .eq('id', id);

          if (error) throw error;
          loadAssignmentsList();
        } catch (err) {
          console.error("Error rejecting submission:", err);
          alert("Action failed.");
          e.target.disabled = false;
        }
      });
    });

    // Bind Mark Paid click
    tableBody.querySelectorAll(".payout-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const ds = e.target.dataset;
        showPayoutModal(ds.id, ds.creatorId, ds.creatorName, ds.amount, ds.paymentPref);
      });
    });

  } catch (err) {
    console.error("Error loading assignments:", err);
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ff3c3c; padding: 20px;">Failed to load.</td></tr>`;
  }
}

/**
 * Show payout confirmation modal
 */
async function showPayoutModal(assignmentId, creatorId, creatorName, defaultAmount, paymentPref) {
  const container = document.getElementById("payout-detail-content");
  if (!container) return;

  // Fetch creator payout details to display
  try {
    const { data: creator, error } = await supabaseAdmin
      .from('creators')
      .select('payment_upi, payment_crypto_address')
      .eq('id', creatorId)
      .single();

    if (error) throw error;

    container.innerHTML = `
      <p style="margin-bottom: 15px;">You are recording a payment to <strong>${creatorName}</strong> for this campaign task.</p>
      
      <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; font-family: var(--font-display); font-size: 13px; text-transform: uppercase; color: var(--text-secondary);">Creator Payout Details</h4>
        <div style="font-size: 13px;">
          <div>Preference: <strong style="color:#fff;">${paymentPref}</strong></div>
          ${creator.payment_upi ? `<div style="margin-top: 6px;">UPI ID: <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${creator.payment_upi}</strong></div>` : ''}
          ${creator.payment_crypto_address ? `<div style="margin-top: 6px; word-break: break-all;">USDT Wallet: <strong style="color:var(--accent-green); font-family:var(--font-mono);">${creator.payment_crypto_address}</strong></div>` : ''}
        </div>
      </div>

      <div class="field" style="margin-bottom: 20px;">
        <label>Verify Payout Amount (INR / ₹) *</label>
        <input type="number" id="payout-final-amount" value="${defaultAmount}" required style="width: 100%;">
      </div>

      <button id="confirm-payout-btn" class="neon-button" style="width: 100%; padding: 12px; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-green));">
        Confirm Payout &amp; Mark Paid ✓
      </button>
    `;

    showModal("payout-modal");

    // Bind confirmation click
    const confirmBtn = document.getElementById("confirm-payout-btn");
    confirmBtn.addEventListener("click", async (e) => {
      e.target.disabled = true;
      e.target.textContent = "Processing...";

      const finalAmount = parseFloat(document.getElementById("payout-final-amount").value);

      if (isNaN(finalAmount) || finalAmount <= 0) {
        alert("Please enter a valid amount.");
        e.target.disabled = false;
        e.target.textContent = "Confirm Payout & Mark Paid ✓";
        return;
      }

      try {
        // 1. Fetch creator's current total_earned
        const { data: creatorProfile, error: cError } = await supabaseAdmin
          .from('creators')
          .select('total_earned')
          .eq('id', creatorId)
          .single();

        if (cError) throw cError;

        const currentEarned = parseFloat(creatorProfile.total_earned || 0);
        const newEarned = currentEarned + finalAmount;

        // 2. Update creator total_earned in DB
        const { error: creatorUpdateError } = await supabaseAdmin
          .from('creators')
          .update({ total_earned: newEarned })
          .eq('id', creatorId);

        if (creatorUpdateError) throw creatorUpdateError;

        // 3. Update assignment status to 'paid'
        const { error: assignmentUpdateError } = await supabaseAdmin
          .from('campaign_assignments')
          .update({
            status: 'paid',
            payment_status: 'paid',
            payment_amount: finalAmount,
            paid_at: new Date().toISOString()
          })
          .eq('id', assignmentId);

        if (assignmentUpdateError) throw assignmentUpdateError;

        // Success
        closeAllModals();
        loadAssignmentsList();
        alert(`Payout of ₹${finalAmount.toLocaleString('en-IN')} confirmed for ${creatorName}!`);
      } catch (err) {
        console.error("Error confirming payout:", err);
        alert("Action failed. Creator total_earned was not updated.");
      } finally {
        e.target.disabled = false;
      }
    });

  } catch (err) {
    console.error("Error preparing payout details:", err);
    alert("Could not load creator payout details.");
  }
}
