import { Brain, Calendar, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-teal-500/20"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="flex flex-col items-center text-center space-y-8 pt-20 pb-20">
            
            {/* AI Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-2xl opacity-50"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <Brain className="w-20 h-20 text-indigo-400" />
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-slate-100 via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Generate Your Perfect
              </span>
              <br/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                AI-Powered Timetable
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-slate-400 max-w-2xl">
              Transform chaos into clarity. Let AI create personalized study and work schedules 
              tailored to your productivity style. 🚀
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/generate">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-semibold text-lg text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <button className="px-8 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl font-semibold text-lg text-slate-200 hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Sync with Google Calendar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-slate-950 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Intelligent Scheduling, Simplified
          </h2>
          <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
            Our AI analyzes your workload and creates the perfect balance between productivity and rest
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-indigo-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-100 mb-3">AI-Powered Intelligence</h3>
                <p className="text-slate-400">
                  Advanced algorithms analyze your workload, priorities, and energy levels to create optimal schedules.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 rounded-3xl transition-all"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-100 mb-3">Smart Sync</h3>
                <p className="text-slate-400">
                  One-click integration with Google Calendar. Your perfect schedule, everywhere you need it.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-3xl transition-all"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-100 mb-3">Multiple Suggestions</h3>
                <p className="text-slate-400">
                  Get several timetable options and choose what fits your style. Flexibility meets intelligence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}