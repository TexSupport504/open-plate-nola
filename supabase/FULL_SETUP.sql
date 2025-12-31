-- ==============================================
-- OPEN PLATE NOLA - FULL DATABASE SETUP
-- Copy this entire file and paste into Supabase SQL Editor
-- ==============================================

-- ============ RESOURCES TABLE ============

CREATE TYPE resource_type AS ENUM (
  'fridge',
  'pantry',
  'hot_meal',
  'mobile_distribution'
);

CREATE TYPE resource_requirement AS ENUM (
  'none',
  'id_required',
  'proof_of_address',
  'income_verification'
);

CREATE TYPE resource_status AS ENUM (
  'operational',
  'low_stock',
  'empty',
  'temporarily_closed',
  'permanently_closed'
);

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type resource_type NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  neighborhood TEXT,
  hours JSONB NOT NULL DEFAULT '{"is_24_7": false, "schedule": [], "notes": null}'::jsonb,
  requirements resource_requirement NOT NULL DEFAULT 'none',
  phone TEXT,
  website TEXT,
  notes TEXT,
  status resource_status NOT NULL DEFAULT 'operational',
  status_updated_at TIMESTAMPTZ,
  status_updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_neighborhood ON resources(neighborhood);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_requirements ON resources(requirements);
CREATE INDEX idx_resources_location ON resources(latitude, longitude);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resources_status_timestamp
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_status_timestamp();

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON resources FOR SELECT USING (true);

CREATE POLICY "Allow all insert"
  ON resources FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update"
  ON resources FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow all delete"
  ON resources FOR DELETE USING (true);

-- ============ CONTACTS TABLE ============

CREATE TYPE contact_category AS ENUM (
  'restaurant',
  'hotel',
  'catering',
  'grocery',
  'food_bank',
  'volunteer',
  'tech_partner',
  'city_official',
  'nonprofit',
  'donor',
  'media',
  'community_leader',
  'other'
);

CREATE TYPE contact_status AS ENUM (
  'prospect',
  'contacted',
  'in_discussion',
  'committed',
  'active',
  'inactive',
  'declined'
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  organization TEXT,
  role TEXT,
  category contact_category NOT NULL DEFAULT 'other',
  status contact_status NOT NULL DEFAULT 'prospect',
  address TEXT,
  neighborhood TEXT,
  notes TEXT,
  last_contact_date DATE,
  next_followup_date DATE,
  can_provide_food BOOLEAN DEFAULT FALSE,
  can_provide_space BOOLEAN DEFAULT FALSE,
  can_provide_volunteers BOOLEAN DEFAULT FALSE,
  can_provide_funding BOOLEAN DEFAULT FALSE,
  can_provide_tech_help BOOLEAN DEFAULT FALSE,
  can_provide_connections BOOLEAN DEFAULT FALSE,
  added_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_category ON contacts(category);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_organization ON contacts(organization);
CREATE INDEX idx_contacts_next_followup ON contacts(next_followup_date);

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read contacts"
  ON contacts FOR SELECT USING (true);

CREATE POLICY "Allow all insert contacts"
  ON contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update contacts"
  ON contacts FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow all delete contacts"
  ON contacts FOR DELETE USING (true);

-- ============ DONE! ============
