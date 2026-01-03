import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  TrendingUpIcon,
  ZapIcon,
  RocketIcon,
} from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { SignUpButton } from '@clerk/nextjs';
import { Navbar } from '@/components/Navbar';
import { GeminiBackground } from '@/components/GeminiBackground';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen text-gray-100 overflow-hidden pt-20 relative selection:bg-emerald-500/30">
      <GeminiBackground />
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 animate-float opacity-20 pointer-events-none">
          <SparklesIcon className="w-12 h-12 text-emerald-400" />
        </div>
        <div className="absolute top-40 right-20 animate-float animation-delay-2000 opacity-20 pointer-events-none">
          <ZapIcon className="w-16 h-16 text-cyan-400" />
        </div>

        {/* Hero Section */}
        <div className="text-center py-24 lg:py-40 relative">
          <div className="inline-flex items-center justify-center p-2 px-4 mb-8 rounded-full bg-gray-800/50 backdrop-blur-md border border-gray-700/50 animate-fade-in-up">
            <RocketIcon className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="text-sm text-gray-300 font-medium">Supercharge your social growth</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight animate-fade-in-up animation-delay-200">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-600">
              AI-Powered Social Media
            </span>
            <br />
            <span className="text-white">Content Generator</span>
          </h1>
          
          <p className="text-xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Create engaging content for X, Instagram, and LinkedIn with
            cutting-edge AI technology. Stop staring at a blank screen.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up animation-delay-600">
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-10 py-7 rounded-full text-lg font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
            >
              <Link href="/generate">Start Creating Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-2 border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-400 px-10 py-7 rounded-full text-lg font-medium transition-all duration-300"
            >
              <Link href="#features">How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 relative" id="features">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/5 to-transparent pointer-events-none" />
          
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Supercharge Your <span className="text-emerald-400">Social Media</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Unlock the power of AI to create content that resonates with your audience across all major platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Twitter Threads',
                icon: <TwitterIcon className="w-8 h-8 text-sky-400" />,
                description: 'Generate compelling Twitter threads that engage your audience and boost your reach.',
                gradient: 'from-sky-500/10 to-transparent',
                border: 'group-hover:border-sky-500/50'
              },
              {
                title: 'Instagram Captions',
                icon: <InstagramIcon className="w-8 h-8 text-pink-400" />,
                description: 'Create catchy captions for your Instagram posts that increase engagement and followers.',
                gradient: 'from-pink-500/10 to-transparent',
                border: 'group-hover:border-pink-500/50'
              },
              {
                title: 'LinkedIn Posts',
                icon: <LinkedinIcon className="w-8 h-8 text-blue-500" />,
                description: 'Craft professional content for your LinkedIn network to establish thought leadership.',
                gradient: 'from-blue-500/10 to-transparent',
                border: 'group-hover:border-blue-500/50'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl bg-gray-900/40 backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.border}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-24 relative" id="benefits">
          <div className="bg-gray-900/40 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <svg className="w-full h-full" width="100%" height="100%">
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-500/30" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white leading-tight">
                  Why Creators Choose <br />
                  <span className="text-emerald-400">Captify AI</span>
                </h2>
                <div className="space-y-6">
                  {[
                    'Save time and effort on content creation',
                    'Consistently produce high-quality posts',
                    'Increase engagement across all platforms',
                    'Stay ahead of social media trends',
                    'Customize content to match your brand voice',
                    'Scale your social media presence effortlessly'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-4 group">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-gray-300 text-lg group-hover:text-white transition-colors">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                <div className="relative bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                   <div className="flex items-center space-x-4 mb-6">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center">
                       <SparklesIcon className="w-6 h-6 text-white" />
                     </div>
                     <div>
                       <div className="h-2 w-24 bg-gray-700 rounded mb-2" />
                       <div className="h-2 w-16 bg-gray-700 rounded" />
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="h-2 w-full bg-gray-800 rounded" />
                     <div className="h-2 w-full bg-gray-800 rounded" />
                     <div className="h-2 w-3/4 bg-gray-800 rounded" />
                   </div>
                   <div className="mt-6 flex justify-between items-center">
                     <div className="h-8 w-24 bg-emerald-500/20 rounded-lg" />
                     <div className="h-8 w-8 bg-gray-800 rounded-full" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 text-center relative overflow-hidden rounded-[3rem] my-12">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
              Ready to revolutionize your <br />
              <span className="text-emerald-400">social strategy?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of creators who are saving time and growing faster with AI.
            </p>
            
            {userId ? (
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-100 px-12 py-8 rounded-full text-xl font-bold shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105"
              >
                <Link href="/generate">
                  Generate Content Now <ArrowRightIcon className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button className="bg-white text-black hover:bg-gray-100 px-12 py-8 rounded-full text-xl font-bold shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
                  Get Started Free <ArrowRightIcon className="ml-2 h-6 w-6" />
                </Button>
              </SignUpButton>
            )}
            <p className="mt-6 text-sm text-gray-500 font-medium tracking-wide uppercase">
              No credit card required • Free plan available
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
