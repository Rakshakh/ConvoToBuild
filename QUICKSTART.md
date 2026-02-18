# Quick Start Guide

Get ConvoToBuild up and running in 5 minutes!

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Git

## Installation

```bash
# Clone the repository
git clone https://github.com/Rakshakh/ConvoToBuild.git
cd ConvoToBuild

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations (ensure PostgreSQL is running)
npm run prisma:migrate
```

## Quick Development Setup

### Using Docker (Recommended)

```bash
# Start all services (PostgreSQL, Redis, App)
docker-compose up -d

# View logs
docker-compose logs -f app

# Access the application
open http://localhost:3000
```

### Manual Setup

```bash
# Start PostgreSQL and Redis (if not using Docker)
# macOS with Homebrew:
brew services start postgresql@16
brew services start redis

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio

# Testing
npm test                 # Run tests
npm run lint             # Lint code

# Docker
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

## Minimal Configuration

For local development, only these environment variables are required:

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/convotobuild

# Optional for basic testing (features won't work without these)
OPENAI_API_KEY=sk-...
WHATSAPP_API_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=any_random_string
GITHUB_TOKEN=ghp_...
VERCEL_TOKEN=your_token
```

## Test the Application

### 1. Check Health

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-18T13:47:14.592Z",
  "service": "ConvoToBuild API"
}
```

### 2. View Landing Page

Open http://localhost:3000 in your browser

### 3. View Dashboard

Open http://localhost:3000/dashboard in your browser

## Next Steps

1. **Set up WhatsApp:**
   - Follow [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) to configure WhatsApp Business API

2. **Configure Services:**
   - Get OpenAI API key from https://platform.openai.com/api-keys
   - Get GitHub token from https://github.com/settings/tokens
   - Get Vercel token from https://vercel.com/account/tokens

3. **Test Full Flow:**
   - Send a WhatsApp message to your bot
   - Watch it create and deploy an app
   - Receive the live URL

## Common Issues

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If not running, start it
# macOS: brew services start postgresql@16
# Linux: sudo systemctl start postgresql
# Docker: docker-compose up -d postgres
```

### Port Already in Use

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Prisma Client Not Generated

```bash
# Regenerate Prisma client
npm run prisma:generate
```

## Project Structure at a Glance

```
ConvoToBuild/
├── app/                 # Next.js pages and API routes
├── lib/                 # Core services (AI, WhatsApp, etc.)
├── services/            # Business logic
├── prisma/              # Database schema
├── components/          # React components
├── tests/               # Test files
└── Documentation:
    ├── README.md              # Main documentation
    ├── ARCHITECTURE.md        # System design
    ├── API.md                 # API reference
    └── WHATSAPP_SETUP.md      # WhatsApp setup
```

## Useful Links

- **Documentation:** [README.md](README.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Docs:** [API.md](API.md)
- **WhatsApp Setup:** [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md)
- **GitHub:** https://github.com/Rakshakh/ConvoToBuild

## Development Workflow

1. Start with a feature branch
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Build: `npm run build`
6. Commit and push
7. CI/CD will run automatically

## Need Help?

- Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Check [API.md](API.md) for API documentation
- Check [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) for WhatsApp integration
- Open an issue on GitHub
- Check the logs: `docker-compose logs -f` or `npm run dev`

## Production Deployment

```bash
# Deploy to Vercel
vercel

# Or use Docker
docker build -t convotobuild:latest .
docker run -p 3000:3000 --env-file .env convotobuild:latest
```

---

**You're all set!** Start building apps through WhatsApp conversation! 🚀
