/* ==========================================================================
   ATELIER CUSTOMER PROFILE & SETTINGS
   Member details, coffee brewing preferences, notification toggles, sign out
   ========================================================================== */

function renderProfilePage() {
  const store = window.AtelierStore;
  const state = store.getState();
  const user = state.user || {
    firstName: 'Member',
    lastName: '',
    tier: 'Gold Member',
    email: '',
    memberSince: '2026',
    membershipId: 'AT-00000',
    favoriteDrink: 'Chikmagalur Pour Over',
    milkPreference: 'Oat Milk / A2 Milk',
    roastPreference: 'Medium-Light'
  };
  const membership = state.membership || {
    lifetimeVisits: 0,
    rewardsRedeemedCount: 0,
    points: 0
  };

  const initials = ((user.firstName || 'M')[0] + ((user.lastName || '')[0] || '')).toUpperCase();

  return `
    <div class="profile-page-root" style="padding: 2.5rem 0 5rem;">
      <div class="container container-narrow">
        
        <!-- Header -->
        <div style="margin-bottom: 1.5rem;">
          <h1 style="margin-bottom: 0.3rem; font-size: clamp(1.8rem, 4vw, 2.3rem);">Profile</h1>
        </div>

        <!-- 1. Hero Identity Card -->
        <div class="double-bezel" style="margin-bottom: 2rem;">
          <div class="double-bezel-inner" style="padding: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1.4rem;">
              <!-- Monogram Avatar -->
              <div style="width: 4.5rem; height: 4.5rem; border-radius: 50%; background: var(--color-espresso); color: #FAF6ED; display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 1.8rem; border: 2px solid var(--color-gold-foil);">
                ${initials}
              </div>

              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <h2 style="font-size: 1.6rem; margin-bottom: 0;">${user.firstName} ${user.lastName}</h2>
                  <span class="card-tier-pill" style="background: var(--color-gold-foil-light); color: var(--color-espresso); border-color: var(--color-gold-foil); font-size: 0.65rem;">
                    ${user.tier}
                  </span>
                </div>
                <div style="font-size: 0.85rem; color: var(--color-roast-medium); margin-top: 3px;">
                  ${user.email} • Member since ${user.memberSince}
                </div>
                <div class="font-mono" style="font-size: 0.78rem; color: var(--color-gold-foil); margin-top: 4px; letter-spacing: 0.08em;">
                  ID: ${user.membershipId}
                </div>
              </div>
            </div>

            <!-- Stats Badge -->
            <div style="display: flex; gap: 1.5rem; text-align: right;">
              <div>
                <div class="font-serif" style="font-size: 1.6rem; font-weight: 600;">${membership.lifetimeVisits}</div>
                <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Visits</div>
              </div>
              <div>
                <div class="font-serif" style="font-size: 1.6rem; font-weight: 600;">${membership.rewardsRedeemedCount}</div>
                <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Rewards</div>
              </div>
            </div>
          </div>
        </div>


        <!-- 3. Account Information & Actions -->
        <div style="background: var(--bg-surface); border: 1px solid var(--color-cream-border); border-radius: 20px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.35rem; margin-bottom: 1.2rem;">Account & Security</h3>
          
          <div style="display: flex; flex-direction: column; gap: 1.2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--color-cream-border-subtle);">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">Contact Phone</div>
                <div style="font-size: 0.85rem; color: var(--color-roast-medium);">${user.phone || 'Not set'}</div>
              </div>
              <button class="btn-text" id="edit-phone-btn">Edit</button>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--color-cream-border-subtle);">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">Date of Birth</div>
                <div style="font-size: 0.85rem; color: var(--color-roast-medium);">
                  ${user.dob ? `${user.dob} • Birthday perk active` : 'Not set • Add for birthday perk'}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                ${user.dob ? '<span class="badge" style="font-size: 0.72rem; background: rgba(200, 157, 75, 0.15); color: #C89D4B; border-radius: 999px; padding: 2px 8px;">Active</span>' : ''}
                <button class="btn-text" id="edit-dob-btn">${user.dob ? 'Edit' : 'Add DOB'}</button>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--color-cream-border-subtle);">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">Password</div>
                <div style="font-size: 0.85rem; color: var(--color-roast-medium);">••••••••••••</div>
              </div>
              <button class="btn-text" id="change-pwd-btn">Update</button>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">Membership ID</div>
                <div style="font-size: 0.85rem; color: var(--color-roast-medium);">${user.membershipId}</div>
              </div>
              <button class="btn-secondary" id="copy-card-id-btn" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
                <span>Copy ID</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sign Out Action -->
        <div style="text-align: center;">
          <button id="profile-signout-btn" class="btn-secondary" style="border-color: #E27B7B; color: #B33939; padding: 0.65rem 1.8rem; cursor: pointer;">
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

function initProfileEvents() {
  document.getElementById('edit-dob-btn')?.addEventListener('click', () => {
    if (window.openEditDobModal) {
      window.openEditDobModal();
    }
  });

  document.getElementById('edit-phone-btn')?.addEventListener('click', () => {
    if (window.openEditPhoneModal) {
      window.openEditPhoneModal();
    }
  });

  document.getElementById('copy-card-id-btn')?.addEventListener('click', () => {
    const id = window.AtelierStore.getState().user.membershipId;
    navigator.clipboard?.writeText(id);
    window.showToast(`Copied Member ID ${id} to clipboard!`);
  });

  document.getElementById('change-pwd-btn')?.addEventListener('click', () => {
    window.openForgotPasswordModal();
  });

  document.getElementById('profile-signout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.AtelierStore.logout();
    window.showToast('You have been signed out. Come back soon! ☕');
    window.location.hash = '#home';
    if (window.router) {
      window.router.currentRoute = 'home';
      window.router.handleRoute();
    }
  });
}

window.renderProfilePage = renderProfilePage;
window.initProfileEvents = initProfileEvents;
