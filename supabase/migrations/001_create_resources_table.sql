-- Open Plate NOLA Database Schema
-- Run this in your Supabase SQL Editor to create the resources table

-- Create enum types for better data integrity
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

-- Create the main resources table
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

-- Create indexes for common queries
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_neighborhood ON resources(neighborhood);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_requirements ON resources(requirements);
CREATE INDEX idx_resources_location ON resources(latitude, longitude);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update status_updated_at when status changes
CREATE OR REPLACE FUNCTION update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update status_updated_at
CREATE TRIGGER update_resources_status_timestamp
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_status_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access"
  ON resources
  FOR SELECT
  USING (true);

-- Create policy for authenticated users to update status
-- (In production, you'd want more granular control)
CREATE POLICY "Allow authenticated users to update"
  ON resources
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy for service role to insert/delete
CREATE POLICY "Allow service role full access"
  ON resources
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT ON resources TO anon;
GRANT SELECT, UPDATE ON resources TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE resources IS 'Food resources in New Orleans area including fridges, pantries, hot meals, and mobile distributions';
COMMENT ON COLUMN resources.hours IS 'JSON object containing is_24_7 boolean, schedule array of {day, open, close}, and optional notes';
COMMENT ON COLUMN resources.status_updated_by IS 'Identifier for who last updated the status (could be anonymous or volunteer ID)';
