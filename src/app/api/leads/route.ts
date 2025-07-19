import { NextRequest, NextResponse } from 'next/server'
import { supabase, CreateLeadData } from '@/lib/supabase'

// GET /api/leads - Get all leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: leads, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      leads: leads || [],
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Get leads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const body: CreateLeadData = await request.json()
    
    // Validate required fields
    if (!body.name || !body.role || !body.company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, role, company' },
        { status: 400 }
      )
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ lead, success: true })
  } catch (error) {
    console.error('Create lead error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
} 