# ConvoToBuild 🚀

AI-Powered Application Builder via WhatsApp

Build complete web applications through casual conversation on WhatsApp. Our AI understands your requirements, generates production-ready code, and deploys your app automatically.

## 🌟 Features

- **💬 WhatsApp Integration**: Build apps through natural conversation
- **🤖 AI-Powered Generation**: GPT-4 understands and generates code
- **🚀 Instant Deployment**: Automatic deployment to Vercel with GitHub integration
- **✏️ Iterative Editing**: Request changes anytime through WhatsApp
- **📊 Project Dashboard**: Manage all your apps from a web interface
- **🔒 Secure & Scalable**: Built with security best practices

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Next.js 14+ (App Router)
- Node.js
- Prisma ORM
- PostgreSQL
- Redis (for queue management)

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Server Components

**Services:**
- OpenAI GPT-4 for AI conversations
- WhatsApp Business API for messaging
- GitHub API for repository management
- Vercel API for deployment

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 16+
- Redis (optional, for production)
- WhatsApp Business API credentials
- OpenAI API key
- GitHub Personal Access Token
- Vercel API Token

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Rakshakh/ConvoToBuild.git
cd ConvoToBuild
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/convotobuild

# WhatsApp Business API
WHATSAPP_API_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# OpenAI
OPENAI_API_KEY=your_openai_key

# GitHub & Vercel
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token

# NextAuth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Set up the database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🐳 Docker Setup

### Using Docker Compose (Recommended for Development)

```bash
# Start all services (PostgreSQL, Redis, App)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Build Docker Image

```bash
docker build -t convotobuild:latest .
docker run -p 3000:3000 convotobuild:latest
```

## 📱 WhatsApp Business API Setup

1. Create a Facebook Developer Account
2. Create a new app and select "Business" type
3. Add WhatsApp product to your app
4. Get your Phone Number ID and Access Token
5. Configure webhook:
   - URL: `https://your-domain.com/api/webhook`
   - Verify Token: (set in your .env)
   - Subscribe to `messages` webhook field

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

### WhatsApp Webhook
```
GET  /api/webhook  # Webhook verification
POST /api/webhook  # Receive messages
```

### Projects
```
GET /api/projects?userId={userId}  # List user projects
```

## 📊 Project Structure

```
ConvoToBuild/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── webhook/         # WhatsApp webhook
│   │   ├── projects/        # Project management
│   │   └── health/          # Health check
│   ├── dashboard/           # Dashboard page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── lib/                     # Core libraries
│   ├── ai/                  # AI service (OpenAI)
│   ├── whatsapp/            # WhatsApp service
│   ├── codegen/             # Code generation
│   ├── deployment/          # Deployment service
│   └── db/                  # Database client
├── services/                # Business logic
│   └── conversation.ts      # Conversation handler
├── prisma/                  # Database
│   └── schema.prisma        # Database schema
├── components/              # React components
├── types/                   # TypeScript types
├── templates/               # App templates
├── tests/                   # Test files
├── .github/                 # GitHub Actions
├── docker-compose.yml       # Docker Compose config
├── Dockerfile               # Docker config
└── README.md               # This file
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint
```

## 📝 Usage

### Creating a New App

1. Send a message to the WhatsApp number:
   ```
   "Create a landing page for my coffee shop"
   ```

2. The AI will ask clarifying questions if needed:
   ```
   "What sections would you like on your landing page?"
   "What colors should I use?"
   ```

3. Once confirmed, the app is generated and deployed:
   ```
   🎉 Your app is ready!
   🌐 Live URL: https://your-app.vercel.app
   📁 GitHub: https://github.com/user/repo
   ```

### Modifying an Existing App

Send modification requests:
```
"Change the background color to blue"
"Add a contact form to the homepage"
"Fix the navigation menu"
```

### Getting Help

```
"help"
```

## 🛠️ Development

### Running Prisma Studio

```bash
npm run prisma:studio
```

### Creating Database Migrations

```bash
npx prisma migrate dev --name migration_name
```

### Generating Prisma Client

```bash
npm run prisma:generate
```

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- All variables from `.env.example`
- Set `NODE_ENV=production`

## 🔒 Security

- API keys stored in environment variables
- Webhook signature verification
- SQL injection prevention (Prisma)
- XSS protection
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization

## 📈 Monitoring

The application includes:
- Health check endpoint (`/api/health`)
- Structured logging with Winston
- Error tracking (integrate Sentry in production)
- Request/response logging

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for deployment platform
- WhatsApp Business API
- Next.js team for the amazing framework

## 📞 Support

For support, email support@convotobuild.com or join our community chat.

## 🗺️ Roadmap

- [ ] Support for Anthropic Claude
- [ ] Multi-language support
- [ ] Voice message support on WhatsApp
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Custom domain management
- [ ] Database migration tools
- [ ] A/B testing support
- [ ] Monitoring and alerting
- [ ] User authentication portal

---

Made with ❤️ by ConvoToBuild Team
