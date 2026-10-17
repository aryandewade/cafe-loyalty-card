import fs from 'node:fs';
import path from 'node:path';

function loadEnvFallback() {
  if (process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY)) return;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  } catch (e) {}
}
loadEnvFallback();

const DEFAULT_SUPABASE_URL = 'https://dxcguohrlybyjovlxqjy.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Y2d1b2hybHlieWpvdmx4cWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDUyNzIsImV4cCI6MjEwNzEyMTI3Mn0.Rm-4-1tt2WheskT3_5OW8HTo7IfT7wQC-MCig8xN3Zs';

const SUPABASE_URL = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

class SupabaseClient {
  constructor(url, key) {
    this.url = url.replace(/\/$/, '');
    this.key = key;
  }

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
      const err = await res.text();
      throw new Error(`Supabase select error on ${table}: ${err}`);
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
      const err = await res.text();
      throw new Error(`Supabase insert error on ${table}: ${err}`);
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
      const err = await res.text();
      throw new Error(`Supabase update error on ${table}: ${err}`);
    }

    return await res.json();
  }

  async delete(table, matchColumn, matchValue) {
    const endpoint = `${this.url}/rest/v1/${table}?${matchColumn}=eq.${encodeURIComponent(matchValue)}`;

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.getHeaders({ 'Prefer': 'return=representation' })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase delete error on ${table}: ${err}`);
    }

    return await res.json();
  }
}

export const supabase = isSupabaseConfigured
  ? new SupabaseClient(SUPABASE_URL, SUPABASE_KEY)
  : null;
