import { NextRequest, NextResponse } from 'next/server'
import { supabase, CreateMessageData } from '@/lib/supabase'

// GET /api/messages - Get all messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('lead_id')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('messages')
      .select(`
        *,
        leads (
          id,
          name,
          role,
          company
        )
      `, { count: 'exact' })
      .order('generated_at', { ascending: false })

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: messages, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      messages: messages || [],
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create new message
export async function POST(request: NextRequest) {
  try {
    const body: CreateMessageData = await request.json()
    
    // Validate required fields
    if (!body.lead_id || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: lead_id, content' },
        { status: 400 }
      )
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert([body])
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
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
} 