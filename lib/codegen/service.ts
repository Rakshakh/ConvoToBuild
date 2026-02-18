import * as fs from 'fs'
import * as path from 'path'
import { AppSpecification } from '../ai/service'

export interface GeneratedFile {
  path: string
  content: string
}

export interface GeneratedApp {
  files: GeneratedFile[]
  packageJson: any
  readme: string
}

export class CodeGenerationService {
  async generateApp(spec: AppSpecification): Promise<GeneratedApp> {
    const files: GeneratedFile[] = []

    // Generate package.json
    const packageJson = this.generatePackageJson(spec)
    files.push({
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
    })

    // Generate Next.js configuration
    files.push({
      path: 'next.config.js',
      content: this.generateNextConfig(),
    })

    // Generate TypeScript config
    files.push({
      path: 'tsconfig.json',
      content: this.generateTsConfig(),
    })

    // Generate Tailwind config
    files.push({
      path: 'tailwind.config.ts',
      content: this.generateTailwindConfig(),
    })

    // Generate PostCSS config
    files.push({
      path: 'postcss.config.js',
      content: this.generatePostCssConfig(),
    })

    // Generate .gitignore
    files.push({
      path: '.gitignore',
      content: this.generateGitignore(),
    })

    // Generate app structure based on type
    const appFiles = await this.generateAppFiles(spec)
    files.push(...appFiles)

    // Generate README
    const readme = this.generateReadme(spec)

    return {
      files,
      packageJson,
      readme,
    }
  }

  private generatePackageJson(spec: AppSpecification): any {
    return {
      name: spec.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '^14.2.0',
        react: '^18.3.0',
        'react-dom': '^18.3.0',
        ...(spec.type === 'crud' || spec.type === 'api'
          ? {
              '@prisma/client': '^5.18.0',
              zod: '^3.23.8',
            }
          : {}),
      },
      devDependencies: {
        typescript: '^5.5.4',
        '@types/node': '^22.5.0',
        '@types/react': '^18.3.4',
        '@types/react-dom': '^18.3.0',
        tailwindcss: '^3.4.10',
        postcss: '^8.4.41',
        autoprefixer: '^10.4.20',
        eslint: '^8.57.0',
        'eslint-config-next': '^14.2.0',
        ...(spec.type === 'crud' || spec.type === 'api'
          ? {
              prisma: '^5.18.0',
            }
          : {}),
      },
    }
  }

  private generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`
  }

  private generateTsConfig(): string {
    return JSON.stringify(
      {
        compilerOptions: {
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [
            {
              name: 'next',
            },
          ],
          paths: {
            '@/*': ['./*'],
          },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2
    )
  }

  private generateTailwindConfig(): string {
    return `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
`
  }

  private generatePostCssConfig(): string {
    return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  }

  private generateGitignore(): string {
    return `# dependencies
node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`
  }

  private async generateAppFiles(spec: AppSpecification): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = []

    // Generate global styles
    files.push({
      path: 'app/globals.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
    })

    // Generate layout
    files.push({
      path: 'app/layout.tsx',
      content: this.generateLayout(spec),
    })

    // Generate main page based on type
    switch (spec.type) {
      case 'landing-page':
        files.push({
          path: 'app/page.tsx',
          content: this.generateLandingPage(spec),
        })
        break
      case 'dashboard':
        files.push({
          path: 'app/page.tsx',
          content: this.generateDashboard(spec),
        })
        break
      case 'crud':
        files.push(...this.generateCrudApp(spec))
        break
      case 'api':
        files.push(...this.generateApiApp(spec))
        break
      default:
        files.push({
          path: 'app/page.tsx',
          content: this.generateDefaultPage(spec),
        })
    }

    return files
  }

  private generateLayout(spec: AppSpecification): string {
    return `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${spec.name}",
  description: "${spec.description || 'Generated with ConvoToBuild'}",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
  }

  private generateLandingPage(spec: AppSpecification): string {
    return `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            ${spec.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ${spec.description || 'Welcome to your new application'}
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          ${spec.features
            .slice(0, 6)
            .map(
              (feature) => `
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">${feature}</h3>
            <p className="text-gray-600">Discover the power of ${feature.toLowerCase()}</p>
          </div>`
            )
            .join('')}
        </div>
      </div>
    </main>
  );
}
`
  }

  private generateDashboard(spec: AppSpecification): string {
    return `export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">${spec.name}</h1>
          <nav>
            <button className="text-gray-600 hover:text-gray-900">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">$12,345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Active Projects</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">56</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Tasks</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-gray-600">Your dashboard content goes here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
`
  }

  private generateCrudApp(spec: AppSpecification): GeneratedFile[] {
    const files: GeneratedFile[] = []

    // Main page
    files.push({
      path: 'app/page.tsx',
      content: `export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">${spec.name}</h1>
        <p className="text-gray-600 mb-8">${spec.description || 'CRUD Application'}</p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <p className="text-gray-600">Your CRUD operations will appear here.</p>
        </div>
      </div>
    </div>
  );
}
`,
    })

    // API route example
    files.push({
      path: 'app/api/items/route.ts',
      content: `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: Fetch items from database
  return NextResponse.json({ items: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: Create item in database
  return NextResponse.json({ success: true, item: body });
}
`,
    })

    return files
  }

  private generateApiApp(spec: AppSpecification): GeneratedFile[] {
    const files: GeneratedFile[] = []

    // Main page
    files.push({
      path: 'app/page.tsx',
      content: `export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${spec.name} API</h1>
        <p className="text-gray-600">${spec.description || 'API Service'}</p>
        <div className="mt-8">
          <a href="/api/health" className="text-blue-600 hover:underline">
            Check API Health
          </a>
        </div>
      </div>
    </div>
  );
}
`,
    })

    // Health check endpoint
    files.push({
      path: 'app/api/health/route.ts',
      content: `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
`,
    })

    // Generate API endpoints from spec
    if (spec.apiEndpoints && spec.apiEndpoints.length > 0) {
      spec.apiEndpoints.forEach((endpoint) => {
        const cleanPath = endpoint.replace('/api/', '')
        files.push({
          path: `app/api/${cleanPath}/route.ts`,
          content: `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'GET ${endpoint}' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: 'POST ${endpoint}', data: body });
}
`,
        })
      })
    }

    return files
  }

  private generateDefaultPage(spec: AppSpecification): string {
    return `export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ${spec.name}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          ${spec.description || 'Welcome to your new application'}
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
`
  }

  private generateReadme(spec: AppSpecification): string {
    return `# ${spec.name}

${spec.description || 'Generated with ConvoToBuild'}

## Features

${spec.features.map((f) => `- ${f}`).join('\n')}

## Tech Stack

${spec.techStack.frontend ? `- Frontend: ${spec.techStack.frontend.join(', ')}` : ''}
${spec.techStack.backend ? `- Backend: ${spec.techStack.backend.join(', ')}` : ''}
${spec.techStack.database ? `- Database: ${spec.techStack.database}` : ''}

## Getting Started

First, install dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy

Deploy this application using [Vercel](https://vercel.com):

\`\`\`bash
vercel
\`\`\`

---

Generated by ConvoToBuild - AI-powered app builder via WhatsApp
`
  }
}

export const codeGenerationService = new CodeGenerationService()
