import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import type {
  Resource,
  ResourceType,
  ResourceRequirement,
  ResourceStatus,
  OperatingHours,
  DayOfWeek,
} from '@/lib/types';

// GET /api/resources - Query resources with filters
export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const type = searchParams.get('type') as ResourceType | null;
  const neighborhood = searchParams.get('neighborhood');
  const requirements = searchParams.get('requirements') as ResourceRequirement | null;
  const status = searchParams.get('status') as ResourceStatus | null;
  const openNow = searchParams.get('open_now') === 'true';

  // Build query
  let query = supabase.from('resources').select('*');

  // Apply filters
  if (type) {
    query = query.eq('type', type);
  }

  if (neighborhood) {
    query = query.ilike('neighborhood', `%${neighborhood}%`);
  }

  if (requirements) {
    query = query.eq('requirements', requirements);
  }

  if (status) {
    query = query.eq('status', status);
  } else {
    // By default, exclude permanently closed resources
    query = query.neq('status', 'permanently_closed');
  }

  // Execute query
  const { data, error } = await query.order('name');

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }

  // Filter by "open now" if requested
  let resources = data as Resource[];

  if (openNow) {
    resources = filterOpenNow(resources);
  }

  return NextResponse.json({ data: resources, error: null });
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('resources')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { data: null, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// Helper function to check if a resource is open now
function isOpenNow(hours: OperatingHours): boolean {
  // 24/7 resources are always open
  if (hours.is_24_7) {
    return true;
  }

  // If no schedule, assume closed
  if (!hours.schedule || hours.schedule.length === 0) {
    return false;
  }

  // Get current time in New Orleans timezone
  const now = new Date();
  const nolaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  );

  const dayOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ][nolaTime.getDay()] as DayOfWeek;

  const currentTime = `${nolaTime.getHours().toString().padStart(2, '0')}:${nolaTime
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  // Check if there's a schedule entry for today
  const todaySchedule = hours.schedule.find((s) => s.day === dayOfWeek);

  if (!todaySchedule) {
    return false;
  }

  // Check if current time is within open hours
  return currentTime >= todaySchedule.open && currentTime < todaySchedule.close;
}

// Filter resources that are open now
function filterOpenNow(resources: Resource[]): Resource[] {
  return resources.filter((resource) => {
    // Only consider operational resources
    if (resource.status !== 'operational') {
      return false;
    }

    return isOpenNow(resource.hours);
  });
}
