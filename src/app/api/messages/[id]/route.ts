import { NextRequest, NextResponse } from 'next/server'
import { supabase, UpdateMessageData } from '@/lib/supabase'

// GET /api/messages/[id] - Get single message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: message, error } = await supabase
      .from('messages')
      .select(`
        *,
        leads (
          id,
          name,
          role,
          company
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Get message error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    )
  }
}

// PUT /api/messages/[id] - Update message
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: UpdateMessageData = await request.json()
    const { id } = await params
    
    const { data: message, error } = await supabase
      .from('messages')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        leads (
          id,
          name,
          role,
          company
        )
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ message, success: true })
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

// DELETE /api/messages/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
} 