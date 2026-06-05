import React from 'react';
import { Sparkles, Plus, BookOpen, User, Star } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userCredits: number;
  onOpenOfferModal: () => void;
}

export default function Header({ currentPage, setCurrentPage, userCredits, onOpenOfferModal }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-indigo-50/80 shadow-xs" id="skillsync-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')} id="logo-container">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SkillSync
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest font-mono">
                Campus Exchange
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'home'
                  ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('browse')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'browse'
                  ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Browse Skills
            </button>
            <button
              onClick={() => setCurrentPage('feedback')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'feedback'
                  ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Rate & Review Tutors
            </button>
          </nav>

          {/* Interactive controls */}
          <div className="flex items-center gap-3" id="header-controls">
            
            {/* Student Exchange Credits Balance */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/50 text-amber-800 shadow-2xs font-medium text-xs animate-bounce"
              title="Your current Skill Credits. Earn credits by tutoring others or use them to book sessions!"
            >
              <span className="text-amber-500 font-bold">⚡</span>
              <span className="font-mono font-bold">{userCredits} Credits</span>
            </div>

            {/* Offer a Skill Button */}
            <button
              onClick={onOpenOfferModal}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              id="offer-skill-button"
            >
              <Plus className="w-3.5 h-3.5" />
              Offer a Skill
            </button>

            {/* Simulated User Avatar profile tab */}
            <div 
              onClick={() => setCurrentPage('profile')}
              className="flex items-center gap-2 text-left pl-2 py-1 pr-1 hover:bg-slate-50 border border-indigo-50 hover:border-indigo-100 rounded-lg cursor-pointer transition-all active:scale-95"
              title="My Student Profile"
              id="user-profile-button"
            >
              <div className="hidden lg:block text-right">
                <span className="block text-xs font-bold text-slate-700 leading-tight">Me (You)</span>
                <span className="block text-[10px] text-slate-400 font-mono leading-none">ID: 2042013</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=96&h=96" 
                alt="My Profile Picture"
                className="w-8 h-8 rounded-full border-2 border-indigo-600/30 object-cover"
              />
            </div>

          </div>

        </div>
      </div>

      {/* Mobile nav indicator bar / fallback for smaller layouts */}
      <div className="md:hidden flex space-x-1 justify-around border-t border-indigo-50 p-2 bg-slate-50/50 text-xs">
        <button 
          onClick={() => setCurrentPage('home')}
          className={`flex-1 text-center py-1 font-medium transition ${currentPage === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentPage('browse')}
          className={`flex-1 text-center py-1 font-medium transition ${currentPage === 'browse' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Browse Skills
        </button>
        <button 
          onClick={() => setCurrentPage('feedback')}
          className={`flex-1 text-center py-1 font-medium transition ${currentPage === 'feedback' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Reviews
        </button>
      </div>
    </header>
  );
}
