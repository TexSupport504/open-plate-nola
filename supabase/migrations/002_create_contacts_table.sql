-- Open Plate NOLA - Contacts Table
-- For tracking stakeholders, partners, volunteers, and community connections

-- Create enum for contact categories
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

-- Create enum for contact status
CREATE TYPE contact_status AS ENUM (
  'prospect',
  'contacted',
  'in_discussion',
  'committed',
  'active',
  'inactive',
  'declined'
);

-- Create the contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,

  -- Organization info
  organization TEXT,
  role TEXT,

  -- Categorization
  category contact_category NOT NULL DEFAULT 'other',
  status contact_status NOT NULL DEFAULT 'prospect',

  -- Location (for mapping partnerships)
  address TEXT,
  neighborhood TEXT,

  -- Engagement tracking
  notes TEXT,
  last_contact_date DATE,
  next_followup_date DATE,

  -- What they can offer
  can_provide_food BOOLEAN DEFAULT FALSE,
  can_provide_space BOOLEAN DEFAULT FALSE,
  can_provide_volunteers BOOLEAN DEFAULT FALSE,
  can_provide_funding BOOLEAN DEFAULT FALSE,
  can_provide_tech_help BOOLEAN DEFAULT FALSE,
  can_provide_connections BOOLEAN DEFAULT FALSE,

  -- Metadata
  added_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_contacts_category ON contacts(category);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_organization ON contacts(organization);
CREATE INDEX idx_contacts_next_followup ON contacts(next_followup_date);
CREATE INDEX idx_contacts_name ON contacts(last_name, first_name);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies - contacts should be more restricted than resources
-- Only authenticated users can view contacts
CREATE POLICY "Allow authenticated users to read contacts"
  ON contacts
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Only authenticated users can insert/update
CREATE POLICY "Allow authenticated users to insert contacts"
  ON contacts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to update contacts"
  ON contacts
  FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Only service role can delete
CREATE POLICY "Allow service role to delete contacts"
  ON contacts
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON contacts TO authenticated;

-- Add comments
COMMENT ON TABLE contacts IS 'Stakeholders, partners, volunteers, and community connections for Open Plate NOLA';
COMMENT ON COLUMN contacts.can_provide_food IS 'Can donate or provide food (restaurants, hotels, caterers)';
COMMENT ON COLUMN contacts.can_provide_space IS 'Can provide space for fridges, distributions, or events';
COMMENT ON COLUMN contacts.can_provide_volunteers IS 'Can mobilize volunteers for distributions or maintenance';
COMMENT ON COLUMN contacts.can_provide_funding IS 'Potential donor or sponsor';
COMMENT ON COLUMN contacts.can_provide_tech_help IS 'Can help with app development, hosting, or technical needs';
COMMENT ON COLUMN contacts.can_provide_connections IS 'Well-connected, can make introductions';
