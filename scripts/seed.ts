/**
 * Seed script for Open Plate NOLA
 *
 * Usage:
 * 1. Set up your .env.local with Supabase credentials
 * 2. Run: npx tsx scripts/seed.ts
 *
 * This script will insert all initial food resources into the database.
 */

import { createClient } from '@supabase/supabase-js';
import type { ResourceInput, OperatingHours } from '../lib/types';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nCreate a .env.local file with your Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to create 24/7 hours
const hours24_7: OperatingHours = {
  is_24_7: true,
  schedule: [],
};

// Helper to create specific hours
function createHours(
  schedule: Array<{ day: string; open: string; close: string }>,
  notes?: string
): OperatingHours {
  return {
    is_24_7: false,
    schedule: schedule.map((s) => ({
      day: s.day as any,
      open: s.open,
      close: s.close,
    })),
    notes,
  };
}

// Community Fridges
const communityFridges: ResourceInput[] = [
  {
    name: 'Recirculating Farms Fridge',
    type: 'fridge',
    address: '1924 Jackson Ave, New Orleans, LA 70113',
    latitude: 29.9330,
    longitude: -90.0815,
    neighborhood: 'Central City',
    hours: hours24_7,
    requirements: 'none',
    notes: 'Located at Recirculating Farms urban garden. Contact: Michael Richard II',
  },
  {
    name: 'Turkey and the Wolf Fridge',
    type: 'fridge',
    address: '739 Jackson Ave, New Orleans, LA 70130',
    latitude: 29.9352,
    longitude: -90.0682,
    neighborhood: 'Lower Garden District',
    hours: hours24_7,
    requirements: 'none',
    notes: 'Outside the restaurant. Customers can donate $8 to support the fridge.',
  },
  {
    name: 'Bethlehem Lutheran Church Fridge',
    type: 'fridge',
    address: '1823 Washington Ave, New Orleans, LA 70113',
    latitude: 29.9315,
    longitude: -90.0785,
    neighborhood: 'Central City',
    hours: hours24_7,
    requirements: 'none',
    notes: 'Solar-powered fridge in wooden structure. Church also serves hot meals Mon/Wed/Thu at noon.',
  },
  {
    name: 'St. Claude Healing Center Fridge',
    type: 'fridge',
    address: '2372 St Claude Ave, New Orleans, LA 70117',
    latitude: 29.9652,
    longitude: -90.0395,
    neighborhood: 'St. Claude',
    hours: createHours([
      { day: 'monday', open: '09:00', close: '21:00' },
      { day: 'tuesday', open: '09:00', close: '21:00' },
      { day: 'wednesday', open: '09:00', close: '21:00' },
      { day: 'thursday', open: '09:00', close: '21:00' },
      { day: 'friday', open: '09:00', close: '21:00' },
      { day: 'saturday', open: '09:00', close: '21:00' },
      { day: 'sunday', open: '09:00', close: '21:00' },
    ]),
    requirements: 'none',
  },
  {
    name: 'Trinity Community Center Fridge',
    type: 'fridge',
    address: '3908 Joliet St, New Orleans, LA 70118',
    latitude: 29.9515,
    longitude: -90.1135,
    neighborhood: 'Hollygrove',
    hours: hours24_7,
    requirements: 'none',
    notes: 'Currently not cooling — may be temporarily closed',
    status: 'temporarily_closed',
  },
  {
    name: 'Touro Street Fridge',
    type: 'fridge',
    address: '1206 Touro St, New Orleans, LA 70116',
    latitude: 29.9675,
    longitude: -90.0608,
    neighborhood: 'Treme',
    hours: hours24_7,
    requirements: 'none',
  },
  {
    name: 'Marigny/St. Roch Fridge',
    type: 'fridge',
    address: '1941 Marigny St, New Orleans, LA 70117',
    latitude: 29.9698,
    longitude: -90.0415,
    neighborhood: 'St. Roch',
    hours: hours24_7,
    requirements: 'none',
    notes: 'Located on North Johnson St side',
  },
  {
    name: 'Algiers Fridge',
    type: 'fridge',
    address: '300 Wagner St, New Orleans, LA 70114',
    latitude: 29.9385,
    longitude: -90.0255,
    neighborhood: 'Algiers',
    hours: hours24_7,
    requirements: 'none',
  },
  {
    name: 'Westwego Fridge',
    type: 'fridge',
    address: '401 Sala Ave, Westwego, LA 70094',
    latitude: 29.9065,
    longitude: -90.1435,
    neighborhood: 'Westwego',
    hours: hours24_7,
    requirements: 'none',
    notes: 'Behind Josh Wingerter Art Gallery',
  },
  {
    name: 'St. Charles Ave Church Fridge',
    type: 'fridge',
    address: '7100 St Charles Ave, New Orleans, LA 70118',
    latitude: 29.9285,
    longitude: -90.1255,
    neighborhood: 'Uptown',
    hours: hours24_7,
    requirements: 'none',
    notes: 'Side of church at corner of Broadway',
  },
  {
    name: 'Bayou St. John Fridge',
    type: 'fridge',
    address: '3016 St Phillip St, New Orleans, LA 70119',
    latitude: 29.9785,
    longitude: -90.0815,
    neighborhood: 'Mid-City',
    hours: hours24_7,
    requirements: 'none',
  },
  {
    name: 'Lapeyrouse Fridge',
    type: 'fridge',
    address: '2528 Lapeyrouse St, New Orleans, LA 70119',
    latitude: 29.9725,
    longitude: -90.0875,
    neighborhood: 'Mid-City',
    hours: hours24_7,
    requirements: 'none',
    notes: 'On Rousselin Dr side',
  },
  {
    name: 'Gentilly Fridge',
    type: 'fridge',
    address: '3400 Clermont Dr, New Orleans, LA 70122',
    latitude: 29.9915,
    longitude: -90.0545,
    neighborhood: 'Gentilly',
    hours: hours24_7,
    requirements: 'none',
  },
  {
    name: 'Desire Fridge',
    type: 'fridge',
    address: '2781 Sage St, New Orleans, LA 70126',
    latitude: 29.9815,
    longitude: -90.0185,
    neighborhood: 'Desire',
    hours: hours24_7,
    requirements: 'none',
  },
  {
    name: 'Port Street Community Garden Fridge',
    type: 'fridge',
    address: '2120 Port St, New Orleans, LA 70117',
    latitude: 29.9685,
    longitude: -90.0355,
    neighborhood: 'St. Claude',
    hours: hours24_7,
    requirements: 'none',
  },
];

// Hot Meal Programs
const hotMealPrograms: ResourceInput[] = [
  {
    name: 'Bethlehem Lutheran Church Hot Meals',
    type: 'hot_meal',
    address: '1823 Washington Ave, New Orleans, LA 70113',
    latitude: 29.9315,
    longitude: -90.0785,
    neighborhood: 'Central City',
    hours: createHours([
      { day: 'monday', open: '12:00', close: '13:00' },
      { day: 'wednesday', open: '12:00', close: '13:00' },
      { day: 'thursday', open: '12:00', close: '13:00' },
    ]),
    requirements: 'none',
    phone: '(504) 895-7050',
    notes: 'Serves 500-600 meals per week. Monday meals provided by Molly\'s Rise and Shine.',
  },
  {
    name: 'Crescent City Cafe',
    type: 'hot_meal',
    address: '3900 St. Charles Ave, New Orleans, LA 70115',
    latitude: 29.9265,
    longitude: -90.1025,
    neighborhood: 'Uptown',
    hours: createHours([
      { day: 'saturday', open: '08:00', close: '09:30' },
    ], '1st & 3rd Saturday only'),
    requirements: 'none',
    website: 'crescentcitycafe.com',
    notes: 'Volunteer-run cafe at Rayne Memorial United Methodist Church',
  },
  {
    name: 'Duncan Plaza Hot Meals (Commie Kitsch)',
    type: 'hot_meal',
    address: 'Duncan Plaza (between City Hall and Main Library), New Orleans, LA 70112',
    latitude: 29.9535,
    longitude: -90.0765,
    neighborhood: 'Central Business District',
    hours: createHours([
      { day: 'tuesday', open: '15:00', close: '16:00' },
    ]),
    requirements: 'none',
    phone: '(504) 383-3349',
    website: 'commiekitsch.org',
    notes: 'Volunteers serving free meals outdoors',
  },
];

// Food Pantries
const foodPantries: ResourceInput[] = [
  {
    name: 'Culture Aid NOLA - Wednesday',
    type: 'pantry',
    address: '3501 N. Miro St (St. Mary of the Angels Catholic Church), New Orleans, LA',
    latitude: 29.9825,
    longitude: -90.0545,
    neighborhood: 'Gentilly',
    hours: createHours([
      { day: 'wednesday', open: '17:00', close: '18:00' },
    ]),
    requirements: 'none',
    website: 'cultureaidnola.org',
    notes: 'No ID required, no proof of income, no questions asked',
  },
  {
    name: 'Culture Aid NOLA - Saturday',
    type: 'pantry',
    address: '2022 St. Bernard Ave (Corpus Christi-Epiphany Church), New Orleans, LA',
    latitude: 29.9745,
    longitude: -90.0545,
    neighborhood: 'St. Roch',
    hours: createHours([
      { day: 'saturday', open: '09:00', close: '10:00' },
    ]),
    requirements: 'none',
    website: 'cultureaidnola.org',
  },
  {
    name: 'Common Ground Relief Free Pantry',
    type: 'pantry',
    address: '1804 Deslonde St, New Orleans, LA 70117',
    latitude: 29.9615,
    longitude: -90.0145,
    neighborhood: 'Lower 9th Ward',
    hours: createHours([
      { day: 'saturday', open: '10:00', close: '14:00' },
    ]),
    requirements: 'none',
    website: 'commongroundrelief.org',
    notes: 'No intake paperwork, just sign in. Emphasis on fresh produce.',
  },
];

// Combine all resources
const allResources: ResourceInput[] = [
  ...communityFridges,
  ...hotMealPrograms,
  ...foodPantries,
];

async function seed() {
  console.log('🍽️  Open Plate NOLA - Seeding Database\n');
  console.log(`Inserting ${allResources.length} resources...`);

  // Clear existing data (optional - comment out if you want to preserve existing data)
  console.log('\nClearing existing resources...');
  const { error: deleteError } = await supabase
    .from('resources')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    console.error('Error clearing existing data:', deleteError);
    // Continue anyway - table might be empty
  }

  // Insert all resources
  console.log('\nInserting new resources...');

  for (const resource of allResources) {
    const { data, error } = await supabase
      .from('resources')
      .insert({
        name: resource.name,
        type: resource.type,
        address: resource.address,
        latitude: resource.latitude,
        longitude: resource.longitude,
        neighborhood: resource.neighborhood || null,
        hours: resource.hours,
        requirements: resource.requirements,
        phone: resource.phone || null,
        website: resource.website || null,
        notes: resource.notes || null,
        status: resource.status || 'operational',
      })
      .select();

    if (error) {
      console.error(`❌ Failed to insert "${resource.name}":`, error.message);
    } else {
      console.log(`✅ Inserted: ${resource.name}`);
    }
  }

  console.log('\n🎉 Seeding complete!');

  // Print summary
  const { data: countData, error: countError } = await supabase
    .from('resources')
    .select('type', { count: 'exact' });

  if (!countError && countData) {
    console.log(`\n📊 Summary:`);
    console.log(`   Total resources: ${countData.length}`);

    const fridges = countData.filter(r => r.type === 'fridge').length;
    const pantries = countData.filter(r => r.type === 'pantry').length;
    const hotMeals = countData.filter(r => r.type === 'hot_meal').length;
    const mobile = countData.filter(r => r.type === 'mobile_distribution').length;

    console.log(`   - Community Fridges: ${fridges}`);
    console.log(`   - Food Pantries: ${pantries}`);
    console.log(`   - Hot Meal Programs: ${hotMeals}`);
    console.log(`   - Mobile Distributions: ${mobile}`);
  }
}

// Run the seed function
seed().catch(console.error);
