import { whatsappService } from '@/lib/whatsapp/service'

describe('WhatsApp Service', () => {
  it('should be defined', () => {
    expect(whatsappService).toBeDefined()
  })

  it('should have required methods', () => {
    expect(typeof whatsappService.sendTextMessage).toBe('function')
    expect(typeof whatsappService.verifyWebhook).toBe('function')
    expect(typeof whatsappService.extractMessageFromWebhook).toBe('function')
  })

  describe('verifyWebhook', () => {
    it('should return challenge for valid verification', () => {
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = 'test-token'
      const result = whatsappService.verifyWebhook('subscribe', 'test-token', 'test-challenge')
      expect(result).toBe('test-challenge')
    })

    it('should return null for invalid verification', () => {
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = 'test-token'
      const result = whatsappService.verifyWebhook('subscribe', 'wrong-token', 'test-challenge')
      expect(result).toBeNull()
    })
  })
})
