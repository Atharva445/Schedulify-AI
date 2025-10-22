import { Brain, Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              AI Timetable
            </span>
          </Link>
          
          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/generate" className="text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium">
              Generate
            </Link>
            <Link to="/my-timetables" className="text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium">
              My Timetables
            </Link>
            <a href="#about" className="text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium">
              About
            </a>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 bg-slate-800/50 hover:bg-slate-800 rounded-lg flex items-center justify-center transition-all"
            >
              {isDark ? <Moon className="w-5 h-5 text-slate-300" /> : <Sun className="w-5 h-5 text-slate-300" />}
            </button>
            
            {/* Get Started Button */}
            <Link to="/generate">
              <button className="hidden md:block px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                Get Started
              </button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden w-9 h-9 bg-slate-800/50 rounded-lg flex items-center justify-center">
              <Menu className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}