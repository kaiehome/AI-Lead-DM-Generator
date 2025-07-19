import { NextRequest, NextResponse } from 'next/server'
import { generateMessage, GenerateMessageParams } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateMessageParams = await request.json()
    
    // Validate required fields
    if (!body.name || !body.role || !body.company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, role, company' },
        { status: 400 }
      )
    }

    // Generate message using OpenAI
    const message = await generateMessage(body)
    
    return NextResponse.json({ message, success: true })
  } catch (error) {
    console.error('Generate message error:', error)
    return NextResponse.json(
      { error: 'Failed to generate message', success: false },
      { status: 500 }
    )
  }
} 