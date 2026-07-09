-- Partner API PostgreSQL schema. Do not import this into the legacy Laravel/MySQL database; dms2025.sql is the separate MySQL dump for public_html.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE partner_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE partner_activity_type AS ENUM ('hospitality', 'events', 'experiences', 'multi_service');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled');
CREATE TYPE service_status AS ENUM ('draft', 'published', 'paused', 'archived');
CREATE TYPE invoice_status AS ENUM ('unpaid', 'paid', 'overdue', 'cancelled');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'partner')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  user_agent text,
  ip_address inet,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  manager_name text NOT NULL,
  mobile text NOT NULL,
  city text NOT NULL,
  activity_type partner_activity_type NOT NULL,
  expected_monthly_bookings integer NOT NULL DEFAULT 0,
  commercial_record_url text,
  identity_url text,
  logo_url text,
  status partner_status NOT NULL DEFAULT 'pending',
  balance numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz
);

CREATE TABLE permissions (
  key text PRIMARY KEY,
  label text NOT NULL
);

INSERT INTO permissions (key, label) VALUES
  ('create_service', 'Create service'),
  ('view_bookings', 'View bookings'),
  ('view_invoices', 'View invoices'),
  ('manage_services', 'Manage services'),
  ('manage_account', 'Manage account')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE partner_permissions (
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  permission_key text NOT NULL REFERENCES permissions(key) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT true,
  PRIMARY KEY (partner_id, permission_key)
);

CREATE TABLE partner_packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric(12,2) NOT NULL DEFAULT 0,
  billing_cycle text NOT NULL DEFAULT 'monthly',
  commission_percent numeric(5,2) NOT NULL DEFAULT 0,
  service_limit integer NOT NULL DEFAULT 0,
  booking_limit integer NOT NULL DEFAULT 0,
  service_types text[] NOT NULL DEFAULT '{}',
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE partner_package_permissions (
  package_id uuid NOT NULL REFERENCES partner_packages(id) ON DELETE CASCADE,
  permission_key text NOT NULL REFERENCES permissions(key) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT true,
  PRIMARY KEY (package_id, permission_key)
);

CREATE TABLE partner_package_assignments (
  partner_id uuid PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES partner_packages(id),
  assigned_by uuid REFERENCES users(id) ON DELETE SET NULL,
  assigned_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE partner_settings (
  partner_id uuid PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  enabled_features jsonb NOT NULL DEFAULT '{}'::jsonb,
  commission_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  allowed_cities text[] NOT NULL DEFAULT '{}',
  service_types text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  title text NOT NULL,
  service_type text NOT NULL,
  city text NOT NULL,
  base_price numeric(12,2) NOT NULL DEFAULT 0,
  status service_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  booking_number text UNIQUE NOT NULL,
  guest_name text NOT NULL,
  guest_mobile text NOT NULL,
  city text NOT NULL,
  starts_at timestamptz,
  status booking_status NOT NULL DEFAULT 'pending',
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  amount numeric(12,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'unpaid',
  pdf_url text,
  issued_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id, revoked_at, expires_at);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partner_packages_active ON partner_packages(active);
CREATE INDEX idx_services_partner ON services(partner_id, status);
CREATE INDEX idx_bookings_partner ON bookings(partner_id, status);
CREATE INDEX idx_invoices_partner ON invoices(partner_id, status);




