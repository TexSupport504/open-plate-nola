import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import type { ContactCategory, ContactStatus } from '@/lib/types';

// GET /api/contacts - Query contacts with filters
export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const category = searchParams.get('category') as ContactCategory | null;
  const status = searchParams.get('status') as ContactStatus | null;
  const organization = searchParams.get('organization');
  const needsFollowup = searchParams.get('needs_followup') === 'true';
  const canProvide = searchParams.get('can_provide'); // food, space, volunteers, funding, tech_help, connections

  // Build query
  let query = supabase.from('contacts').select('*');

  // Apply filters
  if (category) {
    query = query.eq('category', category);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (organization) {
    query = query.ilike('organization', `%${organization}%`);
  }

  if (needsFollowup) {
    const today = new Date().toISOString().split('T')[0];
    query = query.lte('next_followup_date', today);
  }

  if (canProvide) {
    const field = `can_provide_${canProvide}`;
    query = query.eq(field, true);
  }

  // Execute query
  const { data, error } = await query.order('last_name').order('first_name');

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data, error: null });
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('contacts')
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
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
