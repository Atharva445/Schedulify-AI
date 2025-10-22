import { Brain, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-100">AI Timetable</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Generate intelligent, personalized schedules with AI-powered technology.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center transition-all group">
                <Github className="w-5 h-5 text-slate-400 group-hover:text-slate-100" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center transition-all group">
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-slate-100" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center transition-all group">
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-slate-100" />
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">API</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Integrations</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Support</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Community</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2025 AI Timetable. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}