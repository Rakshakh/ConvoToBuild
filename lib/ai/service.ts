import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AppSpecification {
  name: string
  description: string
  type: 'web' | 'landing-page' | 'crud' | 'api' | 'dashboard'
  features: string[]
  techStack: {
    frontend?: string[]
    backend?: string[]
    database?: string
  }
  pages?: string[]
  apiEndpoints?: string[]
}

export class AIService {
  async chat(messages: AIMessage[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI Chat Error:', error)
      throw new Error('Failed to get AI response')
    }
  }

  async parseAppRequest(userMessage: string, conversationHistory: AIMessage[] = []): Promise<AppSpecification | null> {
    const systemPrompt = `You are an expert app specification analyzer. Your job is to understand user requests for building applications and extract structured information.

When a user describes an app they want to build, extract:
1. App name (infer if not explicitly stated)
2. App type: web, landing-page, crud, api, or dashboard
3. Key features they want
4. Technology preferences if mentioned
5. Pages/screens needed
6. API endpoints if it's an API project

If the request is unclear or you need more information, return null.

Respond ONLY with valid JSON in this format:
{
  "name": "App Name",
  "description": "Brief description",
  "type": "web|landing-page|crud|api|dashboard",
  "features": ["feature1", "feature2"],
  "techStack": {
    "frontend": ["React", "Next.js"],
    "backend": ["Node.js"],
    "database": "PostgreSQL"
  },
  "pages": ["home", "about"],
  "apiEndpoints": ["/api/users", "/api/posts"]
}`

    try {
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]

      const response = await this.chat(messages)
      
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return null

      const spec = JSON.parse(jsonMatch[0]) as AppSpecification
      return spec
    } catch (error) {
      console.error('Error parsing app request:', error)
      return null
    }
  }

  async generateClarifyingQuestions(userMessage: string, conversationHistory: AIMessage[] = []): Promise<string[]> {
    const systemPrompt = `You are a helpful AI assistant helping users build applications via WhatsApp. 
    
When a user's app request is unclear or missing important details, ask 2-3 clarifying questions.

Focus on:
- App purpose and target users
- Key features and functionality
- Design preferences (if applicable)
- Data requirements
- Authentication needs

Respond with a JSON array of questions: ["Question 1?", "Question 2?", "Question 3?"]`

    try {
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]

      const response = await this.chat(messages)
      
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (!jsonMatch) return []

      return JSON.parse(jsonMatch[0]) as string[]
    } catch (error) {
      console.error('Error generating questions:', error)
      return []
    }
  }

  async analyzeModificationRequest(
    userMessage: string,
    projectContext: any,
    conversationHistory: AIMessage[] = []
  ): Promise<{
    type: 'ui' | 'feature' | 'bug' | 'content' | 'schema'
    description: string
    files: string[]
    changes: string
  } | null> {
    const systemPrompt = `You are analyzing a modification request for an existing application.

Given the user's request and project context, determine:
1. Type of change: ui, feature, bug, content, or schema
2. Description of what needs to change
3. Which files will be affected
4. Detailed changes needed

Project Context: ${JSON.stringify(projectContext)}

Respond ONLY with valid JSON:
{
  "type": "ui|feature|bug|content|schema",
  "description": "What needs to change",
  "files": ["path/to/file1.tsx", "path/to/file2.ts"],
  "changes": "Detailed description of changes"
}`

    try {
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]

      const response = await this.chat(messages)
      
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return null

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error analyzing modification:', error)
      return null
    }
  }
}

export const aiService = new AIService()
