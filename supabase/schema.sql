-- ==========================================================================
-- ATELIER CAFÉ LOYALTY CLUB — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==========================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  tier TEXT DEFAULT 'Gold Member',
  membership_id TEXT UNIQUE NOT NULL,
  favorite_drink TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memberships (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  current_stamps INTEGER NOT NULL DEFAULT 7,
  max_stamps INTEGER NOT NULL DEFAULT 10,
  lifetime_visits INTEGER NOT NULL DEFAULT 27,
  points INTEGER NOT NULL DEFAULT 420,
  current_streak INTEGER NOT NULL DEFAULT 4,
  rewards_redeemed_count INTEGER NOT NULL DEFAULT 3,
  card_skin TEXT DEFAULT 'espresso',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id),
  product_id TEXT,
  product_name TEXT NOT NULL,
  amount_spent NUMERIC NOT NULL,
  points_earned INTEGER NOT NULL,
  stamps_added INTEGER DEFAULT 0,
  staff_id TEXT,
  receipt_number TEXT NOT NULL,
  location TEXT DEFAULT 'Bandra West Flagship, Mumbai',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id TEXT,
  ip_address TEXT,
  status TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed Initial Administrative Settings & PIN Hash
INSERT INTO public.settings (key, value)
VALUES 
  ('owner_pin_hash', '1a8f9c042971eb0579178e2e28a520bf:81b49048a609d023b7e28b80b06b24d16d6499a0937a44f50937c44df703c15ca85be23b89b4f62bf078c1825fa775796df3f3885d53952ba532599268d06b6b'),
  ('rupees_per_point', '1'),
  ('daily_stamp_limit', '6')
ON CONFLICT (key) DO NOTHING;

-- 3. Seed Demo Users
INSERT INTO public.users (id, email, password_hash, role, first_name, last_name, phone, tier, membership_id, favorite_drink)
VALUES 
  ('usr_arjun_9842', 'arjun.mehta@atelier-coffee.com', 'salt_sec_8942:81b49048a609d023b7e28b80b06b24d16d6499a0937a44f50937c44df703c15ca85be23b89b4f62bf078c1825fa775796df3f3885d53952ba532599268d06b6b', 'customer', 'Arjun', 'Mehta', '+91 98201 44829', 'Gold Member', 'AT-48291', 'Chikmagalur Pour Over (Attikan Estate)'),
  ('staff_lead_01', 'owner@atelier-coffee.com', 'salt_sec_8942:81b49048a609d023b7e28b80b06b24d16d6499a0937a44f50937c44df703c15ca85be23b89b4f62bf078c1825fa775796df3f3885d53952ba532599268d06b6b', 'owner', 'Vikram', 'Rathore', '+91 98200 11223', 'Head Roaster', 'AT-STAFF01', 'Double Espresso')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.memberships (user_id, current_stamps, max_stamps, lifetime_visits, points, current_streak, rewards_redeemed_count, card_skin)
VALUES 
  ('usr_arjun_9842', 7, 10, 27, 420, 4, 3, 'espresso')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Seed Product Catalog
INSERT INTO public.products (id, name, price, category, description, icon)
VALUES
  ('prod_cappuccino', 'Cappuccino', 180, 'Coffee', 'Double espresso pulled over silky textured microfoam with dusted dark cocoa.', '☕'),
  ('prod_kaapi', 'Artisan South Indian Kaapi', 280, 'Specialty Kaapi', 'Slow-dripped brass dabara extraction with estate chicory and frothed A2 milk.', '🏺'),
  ('prod_v60', 'Chikmagalur Single-Estate V60', 360, 'Brew Bar', 'Light roast hand-pour from Attikan Estate (notes of nectarine & raw honey).', '🧪'),
  ('prod_cold_drip', 'Araku Valley Cold Drip Reserve', 390, 'Brew Bar', '14-hour chilled Kyoto drip tower extraction from organic Eastern Ghats micro-lot.', '🧊'),
  ('prod_cortado', 'Coorg Sun-Dried Cortado', 320, 'Coffee', '1:1 ratio of rich espresso and steamed milk cut with green cardamom bitters.', '☕'),
  ('prod_flat_white', 'Oat Flat White', 340, 'Coffee', 'Velvety microfoam over a double ristretto shot with Swedish Oatly Barista edition.', '🥛'),
  ('prod_saffron_brioche', 'Cardamom & Saffron Morning Brioche', 260, 'Bakery', 'Hand-laminated flaky brioche bun with cultured butter and Kashmiri saffron syrup.', '🥐'),
  ('prod_aeropress', 'Monsooned Malabar Aeropress', 310, 'Brew Bar', 'Low-acid monsoon-cured beans brewed inverted with sweet earthy finish.', '☕'),
  ('prod_tartine', 'Avocado & Zaatar Sourdough Tartine', 420, 'Provisions', 'Crushed Hass avocado on toasted country loaf with house dukkah & olive oil.', '🥑'),
  ('prod_beans', 'Araku Valley Micro-Lot Beans (250g)', 650, 'Retail', 'Whole-bean coffee bag from tribal farmer collective, freshly roasted in Bandra.', '🫘')
ON CONFLICT (id) DO NOTHING;

-- 5. Enable Row Level Security (RLS) & Public Policies for App Server
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon/service role access through Backend API
CREATE POLICY "Allow public read and write" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.memberships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.security_audit_logs FOR ALL USING (true) WITH CHECK (true);
