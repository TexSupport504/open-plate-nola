-- OPEN PLATE NOLA - SEED DATA
-- Paste this into Supabase SQL Editor after running FULL_SETUP.sql

INSERT INTO resources (name, type, address, latitude, longitude, neighborhood, hours, requirements, phone, website, notes, status) VALUES

-- Community Fridges
('Recirculating Farms Fridge', 'fridge', '1924 Jackson Ave, New Orleans, LA 70113', 29.9330, -90.0815, 'Central City', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'Located at Recirculating Farms urban garden. Contact: Michael Richard II', 'operational'),

('Turkey and the Wolf Fridge', 'fridge', '739 Jackson Ave, New Orleans, LA 70130', 29.9352, -90.0682, 'Lower Garden District', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'Outside the restaurant. Customers can donate $8 to support the fridge.', 'operational'),

('Bethlehem Lutheran Church Fridge', 'fridge', '1823 Washington Ave, New Orleans, LA 70113', 29.9315, -90.0785, 'Central City', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'Solar-powered fridge in wooden structure. Church also serves hot meals Mon/Wed/Thu at noon.', 'operational'),

('St. Claude Healing Center Fridge', 'fridge', '2372 St Claude Ave, New Orleans, LA 70117', 29.9652, -90.0395, 'St. Claude', '{"is_24_7": false, "schedule": [{"day": "monday", "open": "09:00", "close": "21:00"}, {"day": "tuesday", "open": "09:00", "close": "21:00"}, {"day": "wednesday", "open": "09:00", "close": "21:00"}, {"day": "thursday", "open": "09:00", "close": "21:00"}, {"day": "friday", "open": "09:00", "close": "21:00"}, {"day": "saturday", "open": "09:00", "close": "21:00"}, {"day": "sunday", "open": "09:00", "close": "21:00"}]}', 'none', NULL, NULL, NULL, 'operational'),

('Trinity Community Center Fridge', 'fridge', '3908 Joliet St, New Orleans, LA 70118', 29.9515, -90.1135, 'Hollygrove', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'Currently not cooling — may be temporarily closed', 'temporarily_closed'),

('Touro Street Fridge', 'fridge', '1206 Touro St, New Orleans, LA 70116', 29.9675, -90.0608, 'Treme', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, NULL, 'operational'),

('Marigny/St. Roch Fridge', 'fridge', '1941 Marigny St, New Orleans, LA 70117', 29.9698, -90.0415, 'St. Roch', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'Located on North Johnson St side', 'operational'),

('Algiers Fridge', 'fridge', '300 Wagner St, New Orleans, LA 70114', 29.9385, -90.0255, 'Algiers', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, NULL, 'operational'),

('Westwego Fridge', 'fridge', '401 Sala Ave, Westwego, LA 70094', 29.9065, -90.1435, 'Westwego', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'Behind Josh Wingerter Art Gallery', 'operational'),

('St. Charles Ave Church Fridge', 'fridge', '7100 St Charles Ave, New Orleans, LA 70118', 29.9285, -90.1255, 'Uptown', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'Side of church at corner of Broadway', 'operational'),

('Bayou St. John Fridge', 'fridge', '3016 St Phillip St, New Orleans, LA 70119', 29.9785, -90.0815, 'Mid-City', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, NULL, 'operational'),

('Lapeyrouse Fridge', 'fridge', '2528 Lapeyrouse St, New Orleans, LA 70119', 29.9725, -90.0875, 'Mid-City', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, 'On Rousselin Dr side', 'operational'),

('Gentilly Fridge', 'fridge', '3400 Clermont Dr, New Orleans, LA 70122', 29.9915, -90.0545, 'Gentilly', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, NULL, 'operational'),

('Desire Fridge', 'fridge', '2781 Sage St, New Orleans, LA 70126', 29.9815, -90.0185, 'Desire', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, NULL, 'operational'),

('Port Street Community Garden Fridge', 'fridge', '2120 Port St, New Orleans, LA 70117', 29.9685, -90.0355, 'St. Claude', '{"is_24_7": true, "schedule": []}', 'none', NULL, NULL, NULL, 'operational'),

-- Hot Meal Programs
('Bethlehem Lutheran Church Hot Meals', 'hot_meal', '1823 Washington Ave, New Orleans, LA 70113', 29.9315, -90.0785, 'Central City', '{"is_24_7": false, "schedule": [{"day": "monday", "open": "12:00", "close": "13:00"}, {"day": "wednesday", "open": "12:00", "close": "13:00"}, {"day": "thursday", "open": "12:00", "close": "13:00"}]}', 'none', '(504) 895-7050', NULL, 'Serves 500-600 meals per week. Monday meals provided by Molly''s Rise and Shine.', 'operational'),

('Crescent City Cafe', 'hot_meal', '3900 St. Charles Ave, New Orleans, LA 70115', 29.9265, -90.1025, 'Uptown', '{"is_24_7": false, "schedule": [{"day": "saturday", "open": "08:00", "close": "09:30"}], "notes": "1st & 3rd Saturday only"}', 'none', NULL, 'crescentcitycafe.com', 'Volunteer-run cafe at Rayne Memorial United Methodist Church', 'operational'),

('Duncan Plaza Hot Meals (Commie Kitsch)', 'hot_meal', 'Duncan Plaza (between City Hall and Main Library), New Orleans, LA 70112', 29.9535, -90.0765, 'Central Business District', '{"is_24_7": false, "schedule": [{"day": "tuesday", "open": "15:00", "close": "16:00"}]}', 'none', '(504) 383-3349', 'commiekitsch.org', 'Volunteers serving free meals outdoors', 'operational'),

-- Food Pantries
('Culture Aid NOLA - Wednesday', 'pantry', '3501 N. Miro St (St. Mary of the Angels Catholic Church), New Orleans, LA', 29.9825, -90.0545, 'Gentilly', '{"is_24_7": false, "schedule": [{"day": "wednesday", "open": "17:00", "close": "18:00"}]}', 'none', NULL, 'cultureaidnola.org', 'No ID required, no proof of income, no questions asked', 'operational'),

('Culture Aid NOLA - Saturday', 'pantry', '2022 St. Bernard Ave (Corpus Christi-Epiphany Church), New Orleans, LA', 29.9745, -90.0545, 'St. Roch', '{"is_24_7": false, "schedule": [{"day": "saturday", "open": "09:00", "close": "10:00"}]}', 'none', NULL, 'cultureaidnola.org', NULL, 'operational'),

('Common Ground Relief Free Pantry', 'pantry', '1804 Deslonde St, New Orleans, LA 70117', 29.9615, -90.0145, 'Lower 9th Ward', '{"is_24_7": false, "schedule": [{"day": "saturday", "open": "10:00", "close": "14:00"}]}', 'none', NULL, 'commongroundrelief.org', 'No intake paperwork, just sign in. Emphasis on fresh produce.', 'operational');
