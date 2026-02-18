import axios from 'axios'

export interface WhatsAppMessage {
  from: string
  id: string
  timestamp: string
  text?: {
    body: string
  }
  type: 'text' | 'image' | 'video' | 'document'
  image?: {
    id: string
    mime_type: string
  }
}

export interface WhatsAppWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: WhatsAppMessage[]
      }
      field: string
    }>
  }>
}

export class WhatsAppService {
  private apiUrl: string
  private phoneNumberId: string
  private accessToken: string

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0'
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
    this.accessToken = process.env.WHATSAPP_API_TOKEN || ''
  }

  async sendTextMessage(to: string, message: string): Promise<void> {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`
      
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: {
            preview_url: true,
            body: message,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error('WhatsApp Send Error:', error.response?.data || error.message)
      throw new Error('Failed to send WhatsApp message')
    }
  }

  async sendTemplateMessage(to: string, templateName: string, components?: any[]): Promise<void> {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`
      
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'en_US',
            },
            components: components || [],
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error('WhatsApp Template Error:', error.response?.data || error.message)
      throw new Error('Failed to send template message')
    }
  }

  async sendInteractiveMessage(
    to: string,
    headerText: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<void> {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`
      
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'button',
            header: {
              type: 'text',
              text: headerText,
            },
            body: {
              text: bodyText,
            },
            action: {
              buttons: buttons.map((btn) => ({
                type: 'reply',
                reply: {
                  id: btn.id,
                  title: btn.title,
                },
              })),
            },
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error('WhatsApp Interactive Error:', error.response?.data || error.message)
      throw new Error('Failed to send interactive message')
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`
      
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error('WhatsApp Mark Read Error:', error.response?.data || error.message)
    }
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || ''
    
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge
    }
    
    return null
  }

  extractMessageFromWebhook(payload: WhatsAppWebhookPayload): WhatsAppMessage | null {
    try {
      const entry = payload.entry?.[0]
      const changes = entry?.changes?.[0]
      const value = changes?.value
      const message = value?.messages?.[0]
      
      return message || null
    } catch (error) {
      console.error('Error extracting message:', error)
      return null
    }
  }
}

export const whatsappService = new WhatsAppService()
