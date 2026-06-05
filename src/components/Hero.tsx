import React, { useState } from 'react';
import { Search, Sparkles, Code, Palette, BookOpen, Languages, TrendingUp } from 'lucide-react';
import { Category } from '../types';

interface HeroProps {
  categories: Category[];
  onSearchSubmit: (keyword: string) => void;
  onSelectCategory: (categoryName: string) => void;
}

export default function Hero({ categories, onSearchSubmit, onSelectCategory }: HeroProps) {
  const [localKeyword, setLocalKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localKeyword);
  };

  // Helper to map Lucide category icons
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-6 h-6 text-blue-600" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-purple-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-indigo-600" />;
      case 'Languages':
        return <Languages className="w-6 h-6 text-rose-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="relative py-12 md:py-16 bg-gradient-to-b from-indigo-50/70 via-white to-[#fcfbfe] overflow-hidden" id="skillsync-hero">
      
      {/* Decorative background shapes for the Fiverr/Airbnb tech modern vibe */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-100/30 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-100/30 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Hot Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6 text-xs text-indigo-700 animate-fade-in font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          Skill Exchange for Students, By Students
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
          Find Peer Tutors. Swap Skills.<br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Build Your Campus Profile.
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Need calculus help before midterms? Swap 1 hour of your React or French fluency for physics instruction! Jointly study and build live projects with other peers.
        </p>

        {/* Dynamic Search Bar */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12" id="hero-search-form">
          <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-white shadow-xl shadow-indigo-100/45 border border-indigo-50/80">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search for peer skills (e.g. Figma, Python, Excel...)"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                className="w-full py-2 bg-transparent focus:outline-hidden text-sm text-slate-800 placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              Find Tutors
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Popular:</span>
            {['Figma', 'React', 'Calculus', 'VBA'].map((pop) => (
              <button
                key={pop}
                type="button"
                onClick={() => {
                  setLocalKeyword(pop);
                  onSearchSubmit(pop);
                }}
                className="px-2 py-0.5 rounded-md hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition"
              >
                {pop}
              </button>
            ))}
          </div>
        </form>

        {/* Quick Stats Panel */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16 border-t border-b border-indigo-50/50 py-4 font-display">
          <div>
            <span className="block text-2xl font-black text-slate-800">450+</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">Peer Tutors</span>
          </div>
          <div className="border-l border-indigo-50/50">
            <span className="block text-2xl font-black text-slate-800">1,200+</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">Lessons Swapped</span>
          </div>
          <div className="border-l border-indigo-50/50">
            <span className="block text-2xl font-black text-slate-800">5.0 ★</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">Average Rating</span>
          </div>
        </div>

        {/* Categories Section */}
        <div className="text-left" id="categories-section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-lg text-slate-800">Browse by Department & Skill Track</h2>
              <p className="text-xs text-slate-500">Find exactly what you need in standard collegiate fields</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group p-5 bg-white rounded-2xl border border-indigo-50/50 hover:border-indigo-200/80 shadow-xs hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 active:scale-95"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center mb-4 transition-all">
                  {renderCategoryIcon(cat.iconName)}
                </div>
                <h3 className="font-display font-semibold text-sm text-slate-800 group-hover:text-indigo-600 transition">
                  {cat.name}
                </h3>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  {cat.skillsCount} skills listed
                </span>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
