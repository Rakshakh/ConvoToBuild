import { NextRequest, NextResponse } from 'next/server'
import { whatsappService } from '@/lib/whatsapp/service'
import { conversationService } from '@/services/conversation'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (!mode || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const verificationChallenge = whatsappService.verifyWebhook(mode, token, challenge || '')

  if (verificationChallenge) {
    return new NextResponse(verificationChallenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract message from webhook payload
    const message = whatsappService.extractMessageFromWebhook(body)

    if (!message) {
      return NextResponse.json({ status: 'no message' }, { status: 200 })
    }

    // Mark message as read
    await whatsappService.markAsRead(message.id)

    // Process text messages only for now
    if (message.type === 'text' && message.text?.body) {
      const whatsappId = message.from
      const messageContent = message.text.body

      // Process message asynchronously (don't wait for completion)
      conversationService.processMessage(whatsappId, messageContent).catch((error) => {
        console.error('Error processing message:', error)
      })
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
