import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/contacts/[id] - Get a single contact
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        { data: null, error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data, error: null });
}

// PUT /api/contacts/[id] - Update a contact
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('contacts')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Contact not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/contacts/[id] - Delete a contact
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('contacts').delete().eq('id', id);

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { deleted: true }, error: null });
}
