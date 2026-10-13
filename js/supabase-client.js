/* ==========================================================================
   ATELIER SPECIALTY COFFEE — DIRECT SUPABASE CLIENT & AUTH ENGINE
   Full REST v1 Supabase Cloud Client with PBKDF2 Cryptography,
   Real-Time Data Persistence, Profile Management & Audit Trails.
   Zero External NPM Dependencies (Native Browser Fetch & Web Crypto API).
   ========================================================================== */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://dxcguohrlybyjovlxqjy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Y2d1b2hybHlieWpvdmx4cWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDUyNzIsImV4cCI6MjEwNzEyMTI3Mn0.Rm-4-1tt2WheskT3_5OW8HTo7IfT7wQC-MCig8xN3Zs';
  const SESSION_KEY = 'atelier_supabase_session_v1';

  class SupabaseClient {
    constructor() {
      this.url = SUPABASE_URL.replace(/\/$/, '');
      this.key = SUPABASE_ANON_KEY;
      this.isConfigured = Boolean(this.url && this.key);
      this.syncListeners = [];
    }

    // --------------------------------------------------------------------------
    // Headers & REST Communication
    // --------------------------------------------------------------------------
    getHeaders(extra = {}) {
      return {
        'apikey': this.key,
        'Authorization': `Bearer ${this.key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...extra
      };
    }

    async select(table, queryParams = {}) {
      let endpoint = `${this.url}/rest/v1/${table}`;
      const params = new URLSearchParams();

      if (!queryParams.select) params.append('select', '*');
      for (const [k, v] of Object.entries(queryParams)) {
        params.append(k, v);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Supabase select error [${table}]: ${errText}`);
      }

      return await res.json();
    }

    async insert(table, records) {
      const endpoint = `${this.url}/rest/v1/${table}`;
      const body = Array.isArray(records) ? records : [records];

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Supabase insert error [${table}]: ${errText}`);
      }

      return await res.json();
    }

    async update(table, updates, matchColumn, matchValue) {
      const endpoint = `${this.url}/rest/v1/${table}?${matchColumn}=eq.${encodeURIComponent(matchValue)}`;

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: this.getHeaders({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Supabase update error [${table}]: ${errText}`);
      }

      return await res.json();
    }

    // --------------------------------------------------------------------------
    // Cryptography: PBKDF2-SHA512 & SHA-256 Compatibility
    // --------------------------------------------------------------------------
    generateRandomSalt(bytes = 16) {
      const arr = new Uint8Array(bytes);
      crypto.getRandomValues(arr);
      return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async hashPasswordPBKDF2(secret, salt) {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(String(secret).trim()),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      const saltBuf = enc.encode(salt);
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuf,
          iterations: 100000,
          hash: 'SHA-512'
        },
        keyMaterial,
        512 // 512 bits = 64 bytes
      );
      return Array.from(new Uint8Array(derivedBits))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    async hashPassword(password) {
      const salt = this.generateRandomSalt(16);
      const hash = await this.hashPasswordPBKDF2(password, salt);
      return `${salt}:${hash}`;
    }

    async verifyPassword(password, storedHash) {
      if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
        return false;
      }
      const [salt, expectedHash] = storedHash.split(':');
      if (!salt || !expectedHash) return false;

      // 1. Primary: PBKDF2-SHA512 with 100,000 iterations
      try {
        const computed = await this.hashPasswordPBKDF2(password, salt);
        if (computed.toLowerCase() === expectedHash.toLowerCase()) return true;
      } catch (e) {
        console.warn('PBKDF2 check failed:', e);
      }

      // 2. Fallback: Salted SHA-256 for legacy seed format
      try {
        const enc = new TextEncoder();
        const saltedData = enc.encode(`${salt}:${String(password).trim()}`);
        const hashBuf = await crypto.subtle.digest('SHA-256', saltedData);
        const sha256Hex = Array.from(new Uint8Array(hashBuf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        if (sha256Hex.toLowerCase() === expectedHash.toLowerCase()) return true;
      } catch (e) {}

      return false;
    }

    // --------------------------------------------------------------------------
    // Session State in Browser
    // --------------------------------------------------------------------------
    getSession() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    }

    setSession(sessionData) {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      } catch (e) {}
    }

    clearSession() {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (e) {}
    }

    // --------------------------------------------------------------------------
    // Authentication Operations
    // --------------------------------------------------------------------------
    async signUp({ firstName, lastName, email, phone = '', dob = '', password }) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!normalizedEmail || !password) {
        throw new Error('Email and password are required.');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      // 1. Check existing user
      const existing = await this.select('users', {
        email: `eq.${normalizedEmail}`,
        select: 'id,email'
      });

      if (existing && existing.length > 0) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }

      // 2. Generate secure credentials & IDs
      const passwordHash = await this.hashPassword(password);
      const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const memberNum = Math.floor(10000 + Math.random() * 90000);
      const membershipId = `AT-${memberNum}`;

      const userRecord = {
        id: userId,
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'customer',
        first_name: firstName.trim() || 'New',
        last_name: lastName.trim() || 'Connoisseur',
        phone: phone.trim() || null,
        tier: 'Gold Member',
        membership_id: membershipId,
        favorite_drink: 'Chikmagalur Pour Over (Attikan Estate)'
      };

      // 3. Insert User into Supabase
      const createdUsers = await this.insert('users', userRecord);
      const user = createdUsers[0] || userRecord;

      // 4. Insert Membership into Supabase
      const membershipRecord = {
        user_id: userId,
        current_stamps: 1, // 1st Complimentary welcome stamp!
        max_stamps: 10,
        lifetime_visits: 1,
        points: 100, // 100 Welcome points!
        current_streak: 1,
        rewards_redeemed_count: 0,
        card_skin: 'espresso'
      };

      const createdMemberships = await this.insert('memberships', membershipRecord);
      const membership = createdMemberships[0] || membershipRecord;

      // 5. Insert Welcome Activity Transaction
      const welcomeTx = {
        id: 'tx_welcome_' + Date.now(),
        user_id: userId,
        product_name: 'Welcome Gift: 100 Bonus Points & 1st Visit Stamp',
        amount_spent: 0,
        points_earned: 100,
        stamps_added: 1,
        receipt_number: `RCP-${memberNum}`,
        location: 'Bandra West Flagship, Mumbai'
      };
      await this.insert('transactions', welcomeTx).catch(e => console.warn('Welcome tx log error:', e));

      // 6. Log Security Event
      this.logSecurityEvent('AUTH_SIGNUP', userId, 'SUCCESS', `User created: ${normalizedEmail}`);

      // 7. Store Session
      this.setSession({
        userId: user.id,
        email: user.email,
        membershipId: user.membership_id,
        timestamp: Date.now()
      });

      return {
        user,
        membership,
        transactions: [welcomeTx]
      };
    }

    async signIn(email, password) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!normalizedEmail || !password) {
        throw new Error('Please enter both email and password.');
      }

      // 1. Fetch user from Supabase
      const users = await this.select('users', {
        email: `eq.${normalizedEmail}`
      });

      if (!users || users.length === 0) {
        this.logSecurityEvent('AUTH_LOGIN_FAILED', normalizedEmail, 'DENIED', 'Email not found in database');
        throw new Error('No account found with this email. Please check your spelling or sign up.');
      }

      const user = users[0];

      // 2. Verify password hash
      const isValid = await this.verifyPassword(password, user.password_hash);
      if (!isValid) {
        this.logSecurityEvent('AUTH_LOGIN_FAILED', user.id, 'DENIED', 'Incorrect password attempt');
        throw new Error('Incorrect password. Please verify and try again.');
      }

      // 3. Fetch membership from Supabase
      let memberships = await this.select('memberships', {
        user_id: `eq.${user.id}`
      });

      let membership = null;
      if (!memberships || memberships.length === 0) {
        // Auto-initialize membership if missing
        const newMembership = {
          user_id: user.id,
          current_stamps: 1,
          max_stamps: 10,
          lifetime_visits: 1,
          points: 100,
          current_streak: 1,
          rewards_redeemed_count: 0,
          card_skin: 'espresso'
        };
        const created = await this.insert('memberships', newMembership);
        membership = created[0] || newMembership;
      } else {
        membership = memberships[0];
      }

      // 4. Fetch recent transactions from Supabase
      let transactions = [];
      try {
        transactions = await this.select('transactions', {
          user_id: `eq.${user.id}`,
          order: 'created_at.desc',
          limit: '30'
        });
      } catch (e) {
        console.warn('Could not load transactions:', e);
      }

      // 5. Log Security Event & Save Session
      this.logSecurityEvent('AUTH_LOGIN_SUCCESS', user.id, 'SUCCESS', `User ${user.email} signed in`);
      this.setSession({
        userId: user.id,
        email: user.email,
        membershipId: user.membership_id,
        timestamp: Date.now()
      });

      return {
        user,
        membership,
        transactions
      };
    }

    async signOut() {
      const session = this.getSession();
      if (session) {
        this.logSecurityEvent('AUTH_SIGNOUT', session.userId, 'SUCCESS', 'User signed out');
      }
      this.clearSession();
    }

    // --------------------------------------------------------------------------
    // Supabase Data Sync Operations
    // --------------------------------------------------------------------------
    async fetchUserData(userId) {
      if (!userId) return null;
      const users = await this.select('users', { id: `eq.${userId}` });
      if (!users || users.length === 0) return null;

      const user = users[0];
      const memberships = await this.select('memberships', { user_id: `eq.${userId}` });
      const membership = memberships?.[0] || null;

      let transactions = [];
      try {
        transactions = await this.select('transactions', {
          user_id: `eq.${userId}`,
          order: 'created_at.desc',
          limit: '30'
        });
      } catch (e) {}

      return { user, membership, transactions };
    }

    async syncMembership(userId, updates) {
      if (!userId || !this.isConfigured) return null;
      try {
        const payload = {
          ...updates,
          updated_at: new Date().toISOString()
        };
        return await this.update('memberships', payload, 'user_id', userId);
      } catch (e) {
        console.warn('Supabase syncMembership error:', e);
        return null;
      }
    }

    async recordTransaction(txData) {
      if (!this.isConfigured) return null;
      try {
        return await this.insert('transactions', txData);
      } catch (e) {
        console.warn('Supabase recordTransaction error:', e);
        return null;
      }
    }

    async updateProfile(userId, updates) {
      if (!userId || !this.isConfigured) return null;
      try {
        return await this.update('users', updates, 'id', userId);
      } catch (e) {
        console.warn('Supabase updateProfile error:', e);
        return null;
      }
    }

    async logSecurityEvent(eventType, userId, status, details = '') {
      if (!this.isConfigured) return;
      try {
        await this.insert('security_audit_logs', {
          event_type: eventType,
          user_id: userId || 'anonymous',
          status: status,
          details: details,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        // Silently tolerate audit logging errors
      }
    }
  }

  // Export to global scope
  window.AtelierSupabase = new SupabaseClient();
})();
