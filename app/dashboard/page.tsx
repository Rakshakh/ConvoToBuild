'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description: string
  type: string
  status: string
  deploymentUrl: string
  githubRepo: string
  createdAt: string
  deployments: Array<{
    deploymentUrl: string
    status: string
  }>
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would use authentication
    // For demo purposes, we're using a placeholder userId
    fetchProjects('demo-user')
  }, [])

  const fetchProjects = async (userId: string) => {
    try {
      const response = await fetch(`/api/projects?userId=${userId}`)
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-800'
      case 'generating':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'landing-page':
        return '📄'
      case 'dashboard':
        return '📊'
      case 'crud':
        return '📝'
      case 'api':
        return '⚡'
      default:
        return '🌐'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                ConvoToBuild
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            <button className="text-gray-600 hover:text-gray-900">
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Projects</h3>
            <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Deployed</h3>
            <p className="text-3xl font-bold text-green-600">
              {projects.filter((p) => p.status === 'deployed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Generating</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {projects.filter((p) => p.status === 'generating').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Failed</h3>
            <p className="text-3xl font-bold text-red-600">
              {projects.filter((p) => p.status === 'failed').length}
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <p className="text-gray-600 mt-1">Manage and monitor all your generated applications</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                Start by messaging our WhatsApp bot to create your first app!
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Get Started on WhatsApp
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="text-4xl">{getTypeIcon(project.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {project.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-gray-600 mb-3">{project.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          {project.deploymentUrl && (
                            <a
                              href={project.deploymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              🌐 Live App
                            </a>
                          )}
                          {project.githubRepo && (
                            <a
                              href={project.githubRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              📁 GitHub Repo
                            </a>
                          )}
                          <span className="text-gray-500">
                            Created {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Make Changes to Your Apps
          </h3>
          <p className="text-blue-800">
            Want to modify any of your apps? Just message our WhatsApp bot with your request and
            we'll update it automatically!
          </p>
        </div>
      </main>
    </div>
  )
}
