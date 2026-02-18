import { aiService } from '@/lib/ai/service'

describe('AI Service', () => {
  it('should be defined', () => {
    expect(aiService).toBeDefined()
  })

  // Add more tests as needed
  it('should have required methods', () => {
    expect(typeof aiService.chat).toBe('function')
    expect(typeof aiService.parseAppRequest).toBe('function')
    expect(typeof aiService.generateClarifyingQuestions).toBe('function')
  })
})
