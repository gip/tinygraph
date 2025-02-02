import { NextResponse } from 'next/server'




export const POST = async (request: Request) => {
  try {
    const { prompt, blocks } = await request.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt parameter' }, { status: 400 })
    }

    if (!Array.isArray(blocks)) {
      return NextResponse.json({ error: 'Blocks must be an array' }, { status: 400 })
    }

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data)
    return NextResponse.json({ response: data.content[0].text })
  } catch (error) {
    console.error('Error generating response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
