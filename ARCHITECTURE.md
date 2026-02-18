# ConvoToBuild - Architecture Documentation

## Overview

ConvoToBuild is an AI-powered application builder that enables users to create full-stack web applications through natural conversation via WhatsApp. The system automatically generates code, creates GitHub repositories, and deploys applications to production.

## System Architecture

### High-Level Architecture

```
┌─────────────┐
│   WhatsApp  │
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│          WhatsApp Business API              │
└──────┬──────────────────────────────────────┘
       │ Webhook
       ▼
┌─────────────────────────────────────────────┐
│         ConvoToBuild Backend                │
│  ┌──────────────────────────────────────┐   │
│  │   Webhook Handler (Next.js API)      │   │
│  └────────────┬─────────────────────────┘   │
│               ▼                              │
│  ┌──────────────────────────────────────┐   │
│  │   Conversation Service               │   │
│  │  - Intent Detection                  │   │
│  │  - Context Management                │   │
│  │  - Message Processing                │   │
│  └────────────┬─────────────────────────┘   │
│               ▼                              │
│  ┌──────────────────────────────────────┐   │
│  │      AI Service (OpenAI GPT-4)       │   │
│  │  - Requirement Analysis              │   │
│  │  - Specification Parsing             │   │
│  │  - Clarifying Questions              │   │
│  └────────────┬─────────────────────────┘   │
│               ▼                              │
│  ┌──────────────────────────────────────┐   │
│  │   Code Generation Service            │   │
│  │  - Template Selection                │   │
│  │  - File Generation                   │   │
│  │  - Package Configuration             │   │
│  └────────────┬─────────────────────────┘   │
│               ▼                              │
│  ┌──────────────────────────────────────┐   │
│  │    Deployment Service                │   │
│  │  - GitHub Repo Creation              │   │
│  │  - Code Push                         │   │
│  │  - Vercel Deployment                 │   │
│  └────────────┬─────────────────────────┘   │
│               ▼                              │
│  ┌──────────────────────────────────────┐   │
│  │   Database (PostgreSQL + Prisma)     │   │
│  │  - User Management                   │   │
│  │  - Conversation History              │   │
│  │  - Project Metadata                  │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
       │                           │
       ▼                           ▼
┌─────────────┐            ┌─────────────┐
│   GitHub    │            │   Vercel    │
│ Repositories│            │ Deployments │
└─────────────┘            └─────────────┘
```

## Component Details

### 1. WhatsApp Integration Layer

**Purpose:** Handle incoming messages and send responses via WhatsApp Business API

**Key Files:**
- `lib/whatsapp/service.ts` - WhatsApp service implementation
- `app/api/webhook/route.ts` - Webhook endpoint

**Responsibilities:**
- Webhook verification for WhatsApp
- Receiving user messages
- Sending text, media, and interactive messages
- Message queue management
- Session tracking

**API Methods:**
```typescript
sendTextMessage(to: string, message: string)
sendInteractiveMessage(to, header, body, buttons)
verifyWebhook(mode, token, challenge)
extractMessageFromWebhook(payload)
markAsRead(messageId)
```

### 2. AI Conversation Engine

**Purpose:** Understand user intent and generate application specifications

**Key Files:**
- `lib/ai/service.ts` - AI service with OpenAI integration
- `services/conversation.ts` - Conversation orchestration

**Responsibilities:**
- Natural language understanding
- Intent classification (new app, modify, help)
- App specification parsing
- Generating clarifying questions
- Context management across conversation turns
- Modification request analysis

**AI Models:**
- GPT-4 for understanding and generation
- Custom prompts for different tasks

**Key Methods:**
```typescript
chat(messages: AIMessage[]): Promise<string>
parseAppRequest(userMessage, history): Promise<AppSpecification>
generateClarifyingQuestions(userMessage, history): Promise<string[]>
analyzeModificationRequest(userMessage, projectContext, history)
```

### 3. Code Generation Engine

**Purpose:** Generate complete application code based on specifications

**Key Files:**
- `lib/codegen/service.ts` - Code generation service
- `templates/` - App templates directory

**Responsibilities:**
- Template selection based on app type
- File structure generation
- Package.json configuration
- Next.js app generation
- Component generation
- API route creation
- Database schema generation (when needed)

**Supported App Types:**
- Landing Pages
- Web Applications
- CRUD Applications
- APIs
- Dashboards

**Generation Process:**
1. Select template based on app type
2. Generate base configuration files
3. Generate app-specific files
4. Create README documentation
5. Package everything for deployment

### 4. Deployment Service

**Purpose:** Deploy generated applications to production

**Key Files:**
- `lib/deployment/service.ts` - Deployment orchestration
- Integration with GitHub and Vercel APIs

**Responsibilities:**
- GitHub repository creation
- Code push via GitHub API
- Vercel project creation
- Deployment triggering
- Build status monitoring
- Environment variable management

**Deployment Flow:**
1. Create GitHub repository
2. Push generated code to repository
3. Create Vercel project linked to GitHub
4. Trigger initial deployment
5. Monitor build status
6. Return live URL to user

### 5. Database Layer

**Purpose:** Persist user data, conversations, and project metadata

**Key Files:**
- `prisma/schema.prisma` - Database schema
- `lib/db/prisma.ts` - Prisma client

**Data Models:**

**User:**
- WhatsApp ID (unique identifier)
- Profile information
- Created/updated timestamps

**Conversation:**
- Links to User
- Links to Project (optional)
- Status (active, completed, archived)
- Context storage (JSON)

**Message:**
- Links to Conversation
- Role (user, assistant, system)
- Content
- Metadata (for media, etc.)

**Project:**
- Links to User
- App metadata (name, description, type)
- Status (generating, deployed, failed)
- GitHub repository URL
- Deployment URL
- Vercel project ID
- Tech stack configuration
- Environment variables (encrypted)

**ProjectVersion:**
- Version history
- Commit hashes
- Change descriptions
- File diffs

**Deployment:**
- Deployment history
- Build logs
- Status tracking

### 6. Frontend Dashboard

**Purpose:** Web interface for managing generated applications

**Key Files:**
- `app/page.tsx` - Landing page
- `app/dashboard/page.tsx` - Dashboard
- `app/layout.tsx` - Root layout

**Features:**
- Project listing with status
- Deployment URLs and GitHub links
- Real-time status updates
- Project statistics
- Responsive design

## Data Flow

### New Application Creation Flow

1. **User Message → WhatsApp API → Webhook Handler**
   - User sends: "Create a landing page for my coffee shop"

2. **Webhook Handler → Conversation Service**
   - Extract message content
   - Identify user (create if new)
   - Load conversation context

3. **Conversation Service → AI Service**
   - Pass message with conversation history
   - Request intent classification and parsing

4. **AI Service Analysis**
   - Classify intent: "new_app"
   - Parse requirements
   - If clear: return AppSpecification
   - If unclear: generate clarifying questions

5. **If Specification Ready:**
   - Conversation Service → Code Generation Service
   - Generate full application code

6. **Code Generation → Deployment Service**
   - Create GitHub repository
   - Push code
   - Deploy to Vercel

7. **Update Database**
   - Save project metadata
   - Create deployment record
   - Update conversation

8. **Send Response to User**
   - WhatsApp message with live URL and GitHub link

### Modification Flow

1. **User:** "Change the background color to blue"
2. **System:** Identifies existing project context
3. **AI Service:** Analyzes modification request
4. **Code Generation:** Applies changes (future implementation)
5. **Deployment:** Redeploy updated code
6. **Response:** Confirmation with updated URL

## Security Considerations

### Implemented Security Measures:

1. **Webhook Verification**
   - Token-based verification for WhatsApp webhooks
   - Prevents unauthorized webhook calls

2. **Environment Variables**
   - Sensitive credentials in environment variables
   - No hardcoded secrets

3. **Database Security**
   - Prisma ORM prevents SQL injection
   - Parameterized queries

4. **Input Validation**
   - Sanitization utilities
   - Type checking with TypeScript

5. **API Rate Limiting**
   - Structure ready for rate limiting middleware

### Additional Security Recommendations:

1. Implement API key rotation
2. Add request signature verification
3. Encrypt sensitive data at rest
4. Add CORS configuration
5. Implement authentication for dashboard
6. Add webhook IP whitelisting
7. Implement audit logging

## Scalability Considerations

### Current Architecture:

- **Serverless Deployment:** Next.js on Vercel scales automatically
- **Database:** PostgreSQL can scale vertically
- **Queue System:** Redis ready for background job processing

### Future Enhancements:

1. **Horizontal Scaling:**
   - Separate API server from frontend
   - Multiple worker instances for code generation
   - Load balancing

2. **Queue System:**
   - BullMQ for job processing
   - Separate workers for generation and deployment
   - Priority queues for different request types

3. **Caching:**
   - Redis caching for frequent queries
   - CDN for static assets
   - Cache generated code templates

4. **Database:**
   - Connection pooling
   - Read replicas for dashboard queries
   - Database sharding for scale

## Monitoring and Observability

### Implemented:

1. **Logging:**
   - Winston logger with file and console transports
   - Structured logging format
   - Error tracking

2. **Health Checks:**
   - `/api/health` endpoint
   - Database connection status

### Recommended Additions:

1. **Error Tracking:**
   - Sentry integration
   - Error alerting

2. **Performance Monitoring:**
   - Application Performance Monitoring (APM)
   - Database query performance
   - API endpoint metrics

3. **Business Metrics:**
   - Apps generated per day
   - Deployment success rate
   - Average generation time
   - User engagement metrics

4. **Alerting:**
   - Failed deployments
   - High error rates
   - Service downtime

## Development Workflow

### Local Development:

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### Docker Development:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Testing:

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build
```

## Deployment

### Environment Setup:

1. **Database:**
   - PostgreSQL 16+
   - Run migrations: `npx prisma migrate deploy`

2. **Environment Variables:**
   - Set all variables from `.env.example`
   - Use platform-specific secret management

3. **Vercel Deployment:**
   ```bash
   vercel
   ```

4. **Docker Deployment:**
   ```bash
   docker build -t convotobuild:latest .
   docker run -p 3000:3000 convotobuild:latest
   ```

## API Documentation

### Public Endpoints:

**GET /api/health**
- Returns service health status

**GET /api/webhook**
- WhatsApp webhook verification

**POST /api/webhook**
- Receives WhatsApp messages

**GET /api/projects?userId={userId}**
- Lists user's projects

## Future Enhancements

### Phase 2 Features:

1. **Advanced Code Generation:**
   - Real AST manipulation for modifications
   - Intelligent merge strategies
   - Preview changes before applying

2. **Multi-Platform Support:**
   - Anthropic Claude integration
   - Alternative deployment platforms
   - Mobile app generation

3. **Enhanced Dashboard:**
   - Real-time build logs
   - Analytics and metrics
   - Environment variable management UI
   - Custom domain setup

4. **Collaboration:**
   - Team workspaces
   - Shared projects
   - Role-based access control

5. **Advanced Features:**
   - Database migrations through chat
   - API testing tools
   - Performance optimization suggestions
   - Security scanning

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check environment variables
   - Verify Prisma client is generated
   - Check dependency versions

2. **WhatsApp Webhook Not Working:**
   - Verify webhook URL is publicly accessible
   - Check verify token matches
   - Ensure HTTPS is enabled

3. **Deployment Fails:**
   - Verify GitHub token has repository creation permissions
   - Check Vercel token is valid
   - Ensure API rate limits not exceeded

4. **Database Connection Issues:**
   - Verify DATABASE_URL is correct
   - Check PostgreSQL is running
   - Ensure database exists and is accessible

## Contributing

See the main README.md for contribution guidelines.

## License

MIT License - see LICENSE file for details.
