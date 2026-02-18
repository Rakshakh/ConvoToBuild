export interface User {
  id: string
  whatsappId: string
  name: string | null
  email: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  userId: string
  name: string
  description: string | null
  type: 'web' | 'landing-page' | 'crud' | 'api' | 'dashboard'
  status: 'generating' | 'deployed' | 'failed' | 'archived'
  githubRepo: string | null
  deploymentUrl: string | null
  vercelProjectId: string | null
  techStack: Record<string, any> | null
  envVariables: Record<string, any> | null
  createdAt: Date
  updatedAt: Date
}

export interface Conversation {
  id: string
  userId: string
  projectId: string | null
  status: 'active' | 'completed' | 'archived'
  context: Record<string, any> | null
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: Record<string, any> | null
  createdAt: Date
}

export interface Deployment {
  id: string
  projectId: string
  deploymentUrl: string
  vercelDeployId: string | null
  status: 'building' | 'ready' | 'error' | 'canceled'
  buildLogs: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProjectVersion {
  id: string
  projectId: string
  version: number
  commitHash: string | null
  changes: string
  fileChanges: Record<string, any> | null
  createdAt: Date
}
