import { NextRequest, NextResponse } from 'next/server'
import { generateMessage } from '@/lib/openai'
import { GenerateMessageParams, GeneratedMessage } from '@/types/message'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateMessageParams = await request.json()
    
    // Validate required fields
    if (!body.name || !body.role || !body.company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, role, company', success: false },
        { status: 400 }
      )
    }

    // Validate optional fields
    if (body.style && !['professional', 'friendly', 'casual', 'formal', 'enthusiastic'].includes(body.style)) {
      return NextResponse.json(
        { error: 'Invalid style parameter', success: false },
        { status: 400 }
      )
    }

    if (body.target && !['connection', 'business', 'recruitment', 'networking', 'event', 'collaboration'].includes(body.target)) {
      return NextResponse.json(
        { error: 'Invalid target parameter', success: false },
        { status: 400 }
      )
    }

    if (body.length && !['short', 'standard', 'detailed'].includes(body.length)) {
      return NextResponse.json(
        { error: 'Invalid length parameter', success: false },
        { status: 400 }
      )
    }

    // Generate message using OpenAI
    const result: GeneratedMessage = await generateMessage(body)
    
    return NextResponse.json({ 
      message: result.message,
      style: result.style,
      target: result.target,
      length: result.length,
      character_count: result.character_count,
      confidence_score: result.confidence_score,
      success: true 
    })
  } catch (error) {
    console.error('Generate message error:', error)
    return NextResponse.json(
      { error: 'Failed to generate message', success: false },
      { status: 500 }
    )
  }
} 