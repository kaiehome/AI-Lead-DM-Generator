import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateMessageParams {
  name: string
  role: string
  company: string
  linkedin_url?: string
}

export async function generateMessage(params: GenerateMessageParams): Promise<string> {
  const { name, role, company } = params
  
  const prompt = `Write a short, friendly LinkedIn outreach message to ${name}, who is a ${role} at ${company}. Make it casual and under 500 characters.`
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional networking expert who writes personalized LinkedIn outreach messages."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'Failed to generate message'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate message')
  }
} 