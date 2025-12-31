// Resource Types for Open Plate NOLA

export type ResourceType = 'fridge' | 'pantry' | 'hot_meal' | 'mobile_distribution';

export type ResourceRequirement =
  | 'none'
  | 'id_required'
  | 'proof_of_address'
  | 'income_verification';

export type ResourceStatus =
  | 'operational'
  | 'low_stock'
  | 'empty'
  | 'temporarily_closed'
  | 'permanently_closed';

// Day of week for hours
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Operating hours for a single day
export interface DayHours {
  day: DayOfWeek;
  open: string;  // 24-hour format, e.g., "09:00"
  close: string; // 24-hour format, e.g., "17:00"
}

// Full hours structure
export interface OperatingHours {
  is_24_7: boolean;
  schedule: DayHours[];
  notes?: string; // e.g., "1st & 3rd Saturday only"
}

// Main Resource interface
export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  address: string;
  latitude: number;
  longitude: number;
  neighborhood: string | null;
  hours: OperatingHours;
  requirements: ResourceRequirement;
  phone: string | null;
  website: string | null;
  notes: string | null;
  status: ResourceStatus;
  status_updated_at: string | null;
  status_updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// Form input type (for creating/updating resources)
export interface ResourceInput {
  name: string;
  type: ResourceType;
  address: string;
  latitude: number;
  longitude: number;
  neighborhood?: string | null;
  hours: OperatingHours;
  requirements: ResourceRequirement;
  phone?: string | null;
  website?: string | null;
  notes?: string | null;
  status?: ResourceStatus;
}

// API Query parameters
export interface ResourceQueryParams {
  type?: ResourceType;
  neighborhood?: string;
  requirements?: ResourceRequirement;
  status?: ResourceStatus;
  open_now?: boolean;
}

// Status update input
export interface StatusUpdate {
  status: ResourceStatus;
  updated_by?: string;
}

// Database row type (as stored in Supabase)
export interface ResourceRow {
  id: string;
  name: string;
  type: ResourceType;
  address: string;
  latitude: number;
  longitude: number;
  neighborhood: string | null;
  hours: OperatingHours;
  requirements: ResourceRequirement;
  phone: string | null;
  website: string | null;
  notes: string | null;
  status: ResourceStatus;
  status_updated_at: string | null;
  status_updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// Helper type for Supabase database schema
export type Database = {
  public: {
    Tables: {
      resources: {
        Row: ResourceRow;
        Insert: Omit<ResourceRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ResourceRow, 'id' | 'created_at'>>;
      };
    };
  };
};

// Utility type for API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Display helpers
export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  fridge: 'Community Fridge',
  pantry: 'Food Pantry',
  hot_meal: 'Hot Meal Program',
  mobile_distribution: 'Mobile Distribution',
};

export const REQUIREMENT_LABELS: Record<ResourceRequirement, string> = {
  none: 'No Requirements',
  id_required: 'ID Required',
  proof_of_address: 'Proof of Address Required',
  income_verification: 'Income Verification Required',
};

export const STATUS_LABELS: Record<ResourceStatus, string> = {
  operational: 'Operational',
  low_stock: 'Low Stock',
  empty: 'Empty',
  temporarily_closed: 'Temporarily Closed',
  permanently_closed: 'Permanently Closed',
};

export const STATUS_COLORS: Record<ResourceStatus, string> = {
  operational: 'bg-green-500',
  low_stock: 'bg-yellow-500',
  empty: 'bg-red-500',
  temporarily_closed: 'bg-gray-500',
  permanently_closed: 'bg-gray-800',
};

// ============================================
// Contact Types for Stakeholder Management
// ============================================

export type ContactCategory =
  | 'restaurant'
  | 'hotel'
  | 'catering'
  | 'grocery'
  | 'food_bank'
  | 'volunteer'
  | 'tech_partner'
  | 'city_official'
  | 'nonprofit'
  | 'donor'
  | 'media'
  | 'community_leader'
  | 'other';

export type ContactStatus =
  | 'prospect'
  | 'contacted'
  | 'in_discussion'
  | 'committed'
  | 'active'
  | 'inactive'
  | 'declined';

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  organization: string | null;
  role: string | null;
  category: ContactCategory;
  status: ContactStatus;
  address: string | null;
  neighborhood: string | null;
  notes: string | null;
  last_contact_date: string | null;
  next_followup_date: string | null;
  can_provide_food: boolean;
  can_provide_space: boolean;
  can_provide_volunteers: boolean;
  can_provide_funding: boolean;
  can_provide_tech_help: boolean;
  can_provide_connections: boolean;
  added_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactInput {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  organization?: string | null;
  role?: string | null;
  category: ContactCategory;
  status?: ContactStatus;
  address?: string | null;
  neighborhood?: string | null;
  notes?: string | null;
  last_contact_date?: string | null;
  next_followup_date?: string | null;
  can_provide_food?: boolean;
  can_provide_space?: boolean;
  can_provide_volunteers?: boolean;
  can_provide_funding?: boolean;
  can_provide_tech_help?: boolean;
  can_provide_connections?: boolean;
  added_by?: string | null;
}

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  catering: 'Catering Company',
  grocery: 'Grocery Store',
  food_bank: 'Food Bank',
  volunteer: 'Volunteer',
  tech_partner: 'Tech Partner',
  city_official: 'City Official',
  nonprofit: 'Nonprofit',
  donor: 'Donor/Sponsor',
  media: 'Media',
  community_leader: 'Community Leader',
  other: 'Other',
};

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  prospect: 'Prospect',
  contacted: 'Contacted',
  in_discussion: 'In Discussion',
  committed: 'Committed',
  active: 'Active Partner',
  inactive: 'Inactive',
  declined: 'Declined',
};

export const CONTACT_STATUS_COLORS: Record<ContactStatus, string> = {
  prospect: 'bg-gray-400',
  contacted: 'bg-blue-400',
  in_discussion: 'bg-yellow-500',
  committed: 'bg-green-400',
  active: 'bg-green-600',
  inactive: 'bg-gray-500',
  declined: 'bg-red-400',
};
