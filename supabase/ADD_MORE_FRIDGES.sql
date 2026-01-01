-- Additional NOLA Community Fridges
-- Paste into Supabase SQL Editor to add these fridges

INSERT INTO resources (name, type, address, latitude, longitude, neighborhood, hours, requirements, notes, status) VALUES

('Delery St Fridge', 'fridge', '1609 Delery St, New Orleans, LA 70117', 29.9642, -90.0060, 'Lower 9th Ward', '{"is_24_7": true, "schedule": []}', 'none', 'NOLA Community Fridges network', 'operational'),

('Alvar St Fridge', 'fridge', '1801 Alvar St, New Orleans, LA 70117', 29.9690, -90.0430, 'St. Roch', '{"is_24_7": true, "schedule": []}', 'none', 'NOLA Community Fridges network', 'operational'),

('Kentucky St Fridge', 'fridge', '1020 Kentucky St, New Orleans, LA 70117', 29.9275, -90.0620, 'Irish Channel', '{"is_24_7": true, "schedule": []}', 'none', 'NOLA Community Fridges network', 'operational'),

('N. Villere St Fridge', 'fridge', '1522 N. Villere St, New Orleans, LA 70116', 29.9710, -90.0670, 'Treme', '{"is_24_7": true, "schedule": []}', 'none', 'NOLA Community Fridges network', 'operational'),

('Oretha Castle Haley Fridge', 'fridge', '1809 Oretha Castle Haley Blvd, New Orleans, LA 70113', 29.9340, -90.0830, 'Central City', '{"is_24_7": true, "schedule": []}', 'none', 'NOLA Community Fridges network', 'operational'),

('Third St Fridge', 'fridge', '1915 Third St, New Orleans, LA 70113', 29.9295, -90.0780, 'Central City', '{"is_24_7": true, "schedule": []}', 'none', 'NOLA Community Fridges network', 'operational'),

('N. Claiborne Fridge (NOLA Writers Residency)', 'fridge', '2117 N. Claiborne Ave, New Orleans, LA 70116', 29.9720, -90.0640, 'Treme', '{"is_24_7": true, "schedule": []}', 'none', 'Located at NOLA Writers Residency. NOLA Community Fridges network', 'operational');
