import prisma from '../lib/db/prisma'
import { aiService, AIMessage } from '../lib/ai/service'
import { whatsappService } from '../lib/whatsapp/service'
import { codeGenerationService } from '../lib/codegen/service'
import { deploymentService } from '../lib/deployment/service'

export class ConversationService {
  async processMessage(whatsappId: string, messageContent: string): Promise<void> {
    try {
      // Get or create user
      let user = await prisma.user.findUnique({
        where: { whatsappId },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            whatsappId,
            name: whatsappId,
          },
        })
      }

      // Get active conversation or create new one
      let conversation = await prisma.conversation.findFirst({
        where: {
          userId: user.id,
          status: 'active',
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // Last 20 messages for context
          },
          project: true,
        },
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            userId: user.id,
            status: 'active',
          },
          include: {
            messages: true,
            project: true,
          },
        })
      }

      // Save user message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: messageContent,
        },
      })

      // Build conversation history for AI
      const history: AIMessage[] = conversation.messages.map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      }))

      // Determine intent
      const intent = await this.determineIntent(messageContent, conversation.project)

      if (intent === 'new_app') {
        await this.handleNewAppRequest(user.id, conversation.id, whatsappId, messageContent, history)
      } else if (intent === 'modify_app' && conversation.project) {
        await this.handleModifyRequest(
          conversation.id,
          whatsappId,
          messageContent,
          conversation.project,
          history
        )
      } else if (intent === 'help') {
        await this.handleHelpRequest(whatsappId)
      } else {
        // General conversation
        await this.handleGeneralConversation(conversation.id, whatsappId, messageContent, history)
      }
    } catch (error) {
      console.error('Process Message Error:', error)
      await whatsappService.sendTextMessage(
        whatsappId,
        'Sorry, I encountered an error. Please try again.'
      )
    }
  }

  private async determineIntent(
    message: string,
    project: any
  ): Promise<'new_app' | 'modify_app' | 'help' | 'general'> {
    const lowerMessage = message.toLowerCase()

    // Check for help keywords
    if (lowerMessage.includes('help') || lowerMessage.includes('how to')) {
      return 'help'
    }

    // Check for modification keywords if there's an existing project
    if (project) {
      const modifyKeywords = [
        'change',
        'modify',
        'update',
        'edit',
        'fix',
        'add',
        'remove',
        'delete',
        'replace',
      ]
      if (modifyKeywords.some((keyword) => lowerMessage.includes(keyword))) {
        return 'modify_app'
      }
    }

    // Check for new app keywords
    const newAppKeywords = [
      'create',
      'build',
      'make',
      'new app',
      'new application',
      'website',
      'landing page',
      'dashboard',
      'api',
    ]
    if (newAppKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return 'new_app'
    }

    return 'general'
  }

  private async handleNewAppRequest(
    userId: string,
    conversationId: string,
    whatsappId: string,
    message: string,
    history: AIMessage[]
  ): Promise<void> {
    // Try to parse app specification
    const appSpec = await aiService.parseAppRequest(message, history)

    if (!appSpec) {
      // Need clarification
      const questions = await aiService.generateClarifyingQuestions(message, history)
      
      if (questions.length > 0) {
        const responseText = `I'd like to help you build that! Let me ask a few questions:\n\n${questions
          .map((q, i) => `${i + 1}. ${q}`)
          .join('\n')}`
        
        await whatsappService.sendTextMessage(whatsappId, responseText)
        
        await prisma.message.create({
          data: {
            conversationId,
            role: 'assistant',
            content: responseText,
          },
        })
      } else {
        await whatsappService.sendTextMessage(
          whatsappId,
          'Could you tell me more about what you want to build?'
        )
      }
      return
    }

    // We have a spec, let's build it!
    await whatsappService.sendTextMessage(
      whatsappId,
      `Great! I'm going to build "${appSpec.name}" for you. This will take a few moments...`
    )

    await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: `Building ${appSpec.name}...`,
      },
    })

    // Create project record
    const project = await prisma.project.create({
      data: {
        userId,
        name: appSpec.name,
        description: appSpec.description,
        type: appSpec.type,
        status: 'generating',
        techStack: appSpec.techStack,
      },
    })

    // Link conversation to project
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { projectId: project.id },
    })

    try {
      // Generate code
      const generatedApp = await codeGenerationService.generateApp(appSpec)

      // Deploy
      const deployment = await deploymentService.fullDeploy(
        appSpec.name,
        appSpec.description || 'Generated with ConvoToBuild',
        generatedApp
      )

      // Update project with deployment info
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: 'deployed',
          githubRepo: deployment.repoUrl,
          deploymentUrl: deployment.deploymentUrl,
          vercelProjectId: deployment.vercelProjectId,
        },
      })

      // Create deployment record
      await prisma.deployment.create({
        data: {
          projectId: project.id,
          deploymentUrl: deployment.deploymentUrl,
          vercelDeployId: deployment.vercelProjectId,
          status: 'ready',
        },
      })

      // Create version
      await prisma.projectVersion.create({
        data: {
          projectId: project.id,
          version: 1,
          changes: 'Initial creation',
        },
      })

      // Send success message
      const successMessage = `🎉 Your app "${appSpec.name}" is ready!\n\n🌐 Live URL: ${deployment.deploymentUrl}\n📁 GitHub: ${deployment.repoUrl}\n\nYou can now make changes by telling me what you'd like to modify!`
      
      await whatsappService.sendTextMessage(whatsappId, successMessage)
      
      await prisma.message.create({
        data: {
          conversationId,
          role: 'assistant',
          content: successMessage,
        },
      })
    } catch (error) {
      console.error('App Generation Error:', error)

      await prisma.project.update({
        where: { id: project.id },
        data: { status: 'failed' },
      })

      await whatsappService.sendTextMessage(
        whatsappId,
        'Sorry, I encountered an error while building your app. Please try again.'
      )
    }
  }

  private async handleModifyRequest(
    conversationId: string,
    whatsappId: string,
    message: string,
    project: any,
    history: AIMessage[]
  ): Promise<void> {
    await whatsappService.sendTextMessage(
      whatsappId,
      'I understand you want to modify your app. Let me analyze what changes are needed...'
    )

    // Analyze modification request
    const modification = await aiService.analyzeModificationRequest(message, project, history)

    if (!modification) {
      await whatsappService.sendTextMessage(
        whatsappId,
        'Could you please be more specific about what you want to change?'
      )
      return
    }

    await whatsappService.sendTextMessage(
      whatsappId,
      `I'll ${modification.description}. This feature will be available in the next update!`
    )

    await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: `Modification requested: ${modification.description}`,
      },
    })
  }

  private async handleHelpRequest(whatsappId: string): Promise<void> {
    const helpMessage = `🤖 ConvoToBuild - AI App Builder

Here's how I can help:

1️⃣ *Create New Apps*
Tell me what you want to build:
• "Create a landing page for my business"
• "Build a todo list app"
• "Make a dashboard for analytics"

2️⃣ *Modify Existing Apps*
Request changes to your current app:
• "Change the color to blue"
• "Add a contact form"
• "Fix the navigation menu"

3️⃣ *View Your Apps*
Say "show my apps" to see all your projects

4️⃣ *Get Help*
Type "help" anytime for assistance

Just chat naturally - I'll understand! 😊`

    await whatsappService.sendTextMessage(whatsappId, helpMessage)
  }

  private async handleGeneralConversation(
    conversationId: string,
    whatsappId: string,
    message: string,
    history: AIMessage[]
  ): Promise<void> {
    const response = await aiService.chat([
      {
        role: 'system',
        content:
          'You are a helpful AI assistant for ConvoToBuild, an app builder platform. Help users with their questions about building apps via WhatsApp. Be friendly and conversational.',
      },
      ...history,
      { role: 'user', content: message },
    ])

    await whatsappService.sendTextMessage(whatsappId, response)
    
    await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: response,
      },
    })
  }
}

export const conversationService = new ConversationService()
