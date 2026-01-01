-- Open Plate NOLA - Initial Contacts (Placeholders)
-- Paste into Supabase SQL Editor

INSERT INTO contacts (first_name, last_name, organization, role, category, status, notes, can_provide_food, can_provide_space, can_provide_volunteers, can_provide_funding, can_provide_tech_help, can_provide_connections) VALUES

-- Tech Partners
('TBD', 'Innovation Manager', 'City of New Orleans', 'Innovation Manager', 'tech_partner', 'prospect', 'Colleague contact - can help with tech community support and connections to local tech volunteers', false, false, true, false, true, true),

-- City Officials
('TBD', 'Director of People Services', 'NOMCC', 'Director of People Services', 'city_official', 'prospect', 'Key contact for community connections and outreach to people experiencing food insecurity', false, false, true, false, false, true),

-- Restaurant Partners (Placeholders for outreach)
('TBD', 'Restaurant Partner 1', 'Local Restaurant', 'Owner/Manager', 'restaurant', 'prospect', 'Potential partner for scheduled food drop-offs - surplus food donation', true, false, false, false, false, false),

('TBD', 'Hotel Partner 1', 'Local Hotel', 'Food & Beverage Director', 'hotel', 'prospect', 'Potential partner for kitchen surplus and event leftovers', true, false, false, false, false, false),

('TBD', 'Chef Partner 1', 'Independent', 'Chef', 'catering', 'prospect', 'Potential partner for prepared meals or cooking volunteer events', true, false, true, false, false, true),

-- Community Leaders
('Michael', 'Richard II', 'Recirculating Farms', 'Founder', 'community_leader', 'active', 'Manages Recirculating Farms Fridge at 1924 Jackson Ave. Key community fridge contact.', true, true, true, false, false, true),

-- Food Organizations
('TBD', 'Culture Aid NOLA', 'Culture Aid NOLA', 'Coordinator', 'food_bank', 'prospect', 'Runs Wednesday and Saturday food pantries. No ID required philosophy aligns with Open Plate.', true, false, true, false, false, true),

('TBD', 'Common Ground Relief', 'Common Ground Relief', 'Coordinator', 'nonprofit', 'prospect', 'Free pantry in Lower 9th Ward. Emphasis on fresh produce. Potential data sharing partner.', true, false, true, false, false, true);
