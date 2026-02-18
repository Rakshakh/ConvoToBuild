import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">ConvoToBuild</div>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Build Apps Through
          <span className="block text-blue-600 mt-2">WhatsApp Conversation</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Just chat about what you want to build. Our AI understands, generates code, and deploys your application—all automatically.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#how-it-works"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-3">WhatsApp Integration</h3>
              <p className="text-gray-600">
                Build apps through natural conversation on WhatsApp. No coding knowledge required.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Generation</h3>
              <p className="text-gray-600">
                GPT-4 understands your requirements and generates production-ready code automatically.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Instant Deployment</h3>
              <p className="text-gray-600">
                Your app is deployed to Vercel automatically with a live URL ready in minutes.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-xl font-bold mb-3">Iterative Editing</h3>
              <p className="text-gray-600">
                Request changes anytime through WhatsApp. Updates are applied and redeployed automatically.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Project Dashboard</h3>
              <p className="text-gray-600">
                Manage all your apps, view analytics, and access source code from one place.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Secure & Scalable</h3>
              <p className="text-gray-600">
                Built with security best practices and designed to scale with your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
                <p className="text-gray-600">
                  Message our WhatsApp number and describe what you want to build. Be as casual as you like!
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">AI Understands & Clarifies</h3>
                <p className="text-gray-600">
                  Our AI analyzes your request and asks clarifying questions if needed to ensure we build exactly what you want.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">App Gets Built & Deployed</h3>
                <p className="text-gray-600">
                  We generate the code, create a GitHub repository, and deploy your app to Vercel automatically.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Get Your Live URL</h3>
                <p className="text-gray-600">
                  Receive a live URL to your working application. Share it, test it, and request changes anytime!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported App Types */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">What You Can Build</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold">Web Apps</h3>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-semibold">Landing Pages</h3>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold">CRUD Apps</h3>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold">APIs</h3>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold">Dashboards</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your App?</h2>
          <p className="text-xl mb-8 opacity-90">Start chatting with our AI on WhatsApp today</p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl font-bold mb-4">ConvoToBuild</div>
          <p className="text-gray-400 mb-4">AI-Powered Application Builder via WhatsApp</p>
          <div className="flex gap-6 justify-center text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
