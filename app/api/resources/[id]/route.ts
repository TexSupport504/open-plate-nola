import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/resources/[id] - Get a single resource
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        { data: null, error: 'Resource not found' },
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

// PUT /api/resources/[id] - Update a resource
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('resources')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Resource not found' },
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

// PATCH /api/resources/[id] - Partial update (e.g., status update)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  try {
    const rawBody = await request.json();

    // If updating status, also record who made the update
    const body = { ...rawBody };
    if (rawBody.status && rawBody.updated_by) {
      body.status_updated_by = rawBody.updated_by;
      delete body.updated_by;
    }

    const { data, error } = await supabase
      .from('resources')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Resource not found' },
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

// DELETE /api/resources/[id] - Delete a resource
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('resources').delete().eq('id', id);

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { deleted: true }, error: null });
}
