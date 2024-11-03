import { MessageSquare, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <header className="py-4 lg:px-8 h-13 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MessageSquare className="h-12 w-8 mr-2 mt-2" />
          <span className="font-bold text-3xl">Mysivi</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xl font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-xl font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
          <Link className="text-xl font-medium hover:underline underline-offset-4" href="#contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="font-bold tracking-tighter sm:text-4xl pl-24 md:text-6xl lg:text-8xl/none text-white">
                  Chat with AI. Meet New Friends.
                </h1>
                <p className="mx-auto max-w-[700px] text-white pl-24 md:text-2xl">
                  Experience the future of online chatting with AI-powered conversations and real human connections.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2 pl-40">
                  <Link href="/home">
                    <button className="bg-white text-lg rounded-lg p-2 text-purple-600 hover:bg-gray-100" type="submit">
                      Get Started
                    </button>
                  </Link>
                </form>
                <p className="text-xs text-gray-200 pl-20">
                  Start chatting for free. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="font-bold flex justify-center tracking-tighter md:text-6xl text-center mb-12 pl-24">Why Choose AI-Omegle?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pl-24">
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold mb-2">Meet New People</h3>
                <p className="text-gray-600">Connect with individuals from around the world and expand your social circle.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold mb-2">AI-Powered Chats</h3>
                <p className="text-gray-600">Engage in intelligent conversations with our advanced AI when no humans are available.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-12 w-12 mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold mb-2">Safe & Secure</h3>
                <p className="text-gray-600">Your privacy and security are our top priorities. Chat with confidence.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 AI-Omegle. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}