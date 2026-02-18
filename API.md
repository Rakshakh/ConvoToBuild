# API Documentation

## Overview

ConvoToBuild provides several API endpoints for webhook handling, health checks, and project management.

## Base URL

Development: `http://localhost:3000`
Production: `https://your-domain.com`

## Authentication

Currently, API endpoints use basic authentication through environment variables. Future versions will implement JWT-based authentication for user-facing endpoints.

## Endpoints

### Health Check

#### GET /api/health

Check the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-18T13:47:14.592Z",
  "service": "ConvoToBuild API"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### WhatsApp Webhook

#### GET /api/webhook

Verify WhatsApp webhook configuration.

**Query Parameters:**
- `hub.mode` (string, required) - Subscription mode, should be "subscribe"
- `hub.verify_token` (string, required) - Verification token
- `hub.challenge` (string, required) - Challenge string to return

**Response:**
- Returns the challenge string if verification succeeds

**Example Request:**
```
GET /api/webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=challenge_string
```

**Status Codes:**
- `200 OK` - Verification successful
- `403 Forbidden` - Verification failed
- `400 Bad Request` - Missing parameters

#### POST /api/webhook

Receive incoming WhatsApp messages.

**Request Body:**
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "PHONE_NUMBER_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "PHONE_NUMBER",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "contacts": [
              {
                "profile": {
                  "name": "NAME"
                },
                "wa_id": "WHATSAPP_ID"
              }
            ],
            "messages": [
              {
                "from": "SENDER_WHATSAPP_ID",
                "id": "MESSAGE_ID",
                "timestamp": "TIMESTAMP",
                "text": {
                  "body": "MESSAGE_CONTENT"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Message received and processed
- `500 Internal Server Error` - Processing error

**Notes:**
- Message processing happens asynchronously
- Responses are sent via WhatsApp, not HTTP response

---

### Projects

#### GET /api/projects

List all projects for a user.

**Query Parameters:**
- `userId` (string, required) - User ID to fetch projects for

**Response:**
```json
{
  "projects": [
    {
      "id": "clxxxxx",
      "userId": "clxxxxx",
      "name": "My Landing Page",
      "description": "A beautiful landing page for my business",
      "type": "landing-page",
      "status": "deployed",
      "githubRepo": "https://github.com/user/repo",
      "deploymentUrl": "https://my-landing-page.vercel.app",
      "vercelProjectId": "prj_xxxxx",
      "techStack": {
        "frontend": ["React", "Next.js", "Tailwind CSS"],
        "backend": ["Next.js API Routes"]
      },
      "createdAt": "2026-02-18T12:00:00.000Z",
      "updatedAt": "2026-02-18T12:05:00.000Z",
      "deployments": [
        {
          "id": "clxxxxx",
          "projectId": "clxxxxx",
          "deploymentUrl": "https://my-landing-page.vercel.app",
          "vercelDeployId": "dpl_xxxxx",
          "status": "ready",
          "buildLogs": null,
          "createdAt": "2026-02-18T12:05:00.000Z",
          "updatedAt": "2026-02-18T12:05:30.000Z"
        }
      ],
      "versions": [
        {
          "id": "clxxxxx",
          "projectId": "clxxxxx",
          "version": 1,
          "commitHash": "abc123",
          "changes": "Initial creation",
          "fileChanges": null,
          "createdAt": "2026-02-18T12:05:00.000Z"
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Projects retrieved successfully
- `400 Bad Request` - Missing userId parameter
- `500 Internal Server Error` - Database error

---

## Data Models

### User

```typescript
{
  id: string              // Unique user ID
  whatsappId: string      // WhatsApp ID (unique)
  name: string | null     // User's name
  email: string | null    // User's email
  createdAt: Date         // Account creation date
  updatedAt: Date         // Last update date
}
```

### Project

```typescript
{
  id: string                          // Unique project ID
  userId: string                      // Owner user ID
  name: string                        // Project name
  description: string | null          // Project description
  type: 'web' | 'landing-page' | 'crud' | 'api' | 'dashboard'
  status: 'generating' | 'deployed' | 'failed' | 'archived'
  githubRepo: string | null           // GitHub repository URL
  deploymentUrl: string | null        // Live deployment URL
  vercelProjectId: string | null      // Vercel project ID
  techStack: object | null            // Technology stack details
  envVariables: object | null         // Environment variables (encrypted)
  createdAt: Date                     // Creation date
  updatedAt: Date                     // Last update date
}
```

### Conversation

```typescript
{
  id: string                          // Unique conversation ID
  userId: string                      // User ID
  projectId: string | null            // Associated project (if any)
  status: 'active' | 'completed' | 'archived'
  context: object | null              // Conversation context data
  createdAt: Date                     // Start date
  updatedAt: Date                     // Last message date
}
```

### Message

```typescript
{
  id: string                          // Unique message ID
  conversationId: string              // Parent conversation ID
  role: 'user' | 'assistant' | 'system'
  content: string                     // Message content
  metadata: object | null             // Additional data (media URLs, etc.)
  createdAt: Date                     // Message timestamp
}
```

### Deployment

```typescript
{
  id: string                          // Unique deployment ID
  projectId: string                   // Project ID
  deploymentUrl: string               // Deployment URL
  vercelDeployId: string | null       // Vercel deployment ID
  status: 'building' | 'ready' | 'error' | 'canceled'
  buildLogs: string | null            // Build logs
  createdAt: Date                     // Deployment start
  updatedAt: Date                     // Status update date
}
```

### ProjectVersion

```typescript
{
  id: string                          // Unique version ID
  projectId: string                   // Project ID
  version: number                     // Version number
  commitHash: string | null           // Git commit hash
  changes: string                     // Change description
  fileChanges: object | null          // File diffs
  createdAt: Date                     // Version creation date
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

Common error status codes:
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

## Rate Limiting

Currently not implemented. Recommended limits for production:

- WhatsApp Webhook: 1000 requests per minute
- Public API Endpoints: 100 requests per minute per IP
- Authenticated Endpoints: 1000 requests per hour per user

## Webhook Security

### WhatsApp Webhook Verification

The WhatsApp webhook endpoint uses token-based verification. The verification flow:

1. WhatsApp sends GET request with verification parameters
2. Server checks if `hub.verify_token` matches `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
3. If valid, returns `hub.challenge`
4. If invalid, returns 403 error

### Request Signature Verification

For production, implement webhook signature verification:

```typescript
import crypto from 'crypto'

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

## API Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch user's projects
const response = await fetch('https://api.convotobuild.com/api/projects?userId=clxxxxx', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})

const data = await response.json()
console.log(data.projects)
```

### cURL

```bash
# Health check
curl https://api.convotobuild.com/api/health

# Get user projects
curl "https://api.convotobuild.com/api/projects?userId=clxxxxx"

# Webhook verification (called by WhatsApp)
curl "https://api.convotobuild.com/api/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE_STRING"
```

### Python

```python
import requests

# Fetch projects
response = requests.get(
    'https://api.convotobuild.com/api/projects',
    params={'userId': 'clxxxxx'}
)

projects = response.json()['projects']
for project in projects:
    print(f"{project['name']}: {project['deploymentUrl']}")
```

## WebSocket Support (Future)

Future versions will support WebSocket connections for real-time updates:

```typescript
const ws = new WebSocket('wss://api.convotobuild.com/ws')

ws.on('message', (data) => {
  const event = JSON.parse(data)
  
  switch (event.type) {
    case 'project.generating':
      console.log('Project generation started')
      break
    case 'project.deployed':
      console.log('Project deployed:', event.url)
      break
    case 'build.log':
      console.log('Build log:', event.message)
      break
  }
})
```

## SDK Support (Future)

Official SDKs will be provided for:
- JavaScript/TypeScript
- Python
- Go
- Ruby

Example usage:

```typescript
import { ConvoToBuildClient } from 'convotobuild-sdk'

const client = new ConvoToBuildClient({
  apiKey: process.env.CONVOTOBUILD_API_KEY,
})

// List projects
const projects = await client.projects.list({ userId: 'clxxxxx' })

// Get project details
const project = await client.projects.get('project_id')

// Subscribe to project events
client.projects.subscribe('project_id', (event) => {
  console.log('Project event:', event)
})
```

## Support

For API support:
- Documentation: https://docs.convotobuild.com
- Email: api@convotobuild.com
- GitHub Issues: https://github.com/Rakshakh/ConvoToBuild/issues

## Changelog

### v0.1.0 (2026-02-18)
- Initial API release
- WhatsApp webhook integration
- Health check endpoint
- Projects listing endpoint
- Basic project management
