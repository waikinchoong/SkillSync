import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, Award, Clock, ArrowRight, User, GraduationCap } from 'lucide-react';
import { Skill, Tutor } from '../types';

interface BrowseViewProps {
  skills: Skill[];
  tutors: Tutor[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onBookSkill: (skill: Skill) => void;
  onViewTutorProfile: (tutorId: string) => void;
}

export default function BrowseView({
  skills,
  tutors,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onBookSkill,
  onViewTutorProfile,
}: BrowseViewProps) {
  
  // Local Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rating');

  // Computed skills list based on active filters
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // 1. Text Search matching title, category, description, or tutor name
      const matchesSearch = searchQuery
        ? skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.tutorName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // 2. Category matching
      const matchesCategory = selectedCategory && selectedCategory !== 'All'
        ? skill.category === selectedCategory
        : true;

      // 3. Difficulty Level
      const matchesDifficulty = selectedDifficulty && selectedDifficulty !== 'All'
        ? skill.difficultyLevel === selectedDifficulty
        : true;

      // 4. Availability Badge
      const matchesAvailability = selectedAvailability && selectedAvailability !== 'All'
        ? skill.availabilityBadge === selectedAvailability
        : true;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesAvailability;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'reviews') {
        return b.reviewsCount - a.reviewsCount;
      }
      return 0;
    });
  }, [skills, searchQuery, selectedCategory, selectedDifficulty, selectedAvailability, sortBy]);

  // Unique list of categories present
  const availableCategories = useMemo(() => {
    const list = skills.map(s => s.category);
    return ['All', ...Array.from(new Set(list))];
  }, [skills]);

  // Helper for availability badge color styling
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Available Today':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Weekends':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Evenings Only':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getDifficultyStyle = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Advanced':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="browse-skills-view">
      
      {/* Title */}
      <div className="border-b border-indigo-50/80 pb-6 mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-900">Exchange Peer Skills</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Explore student-listed offerings and book learning sessions. All exchanges run on Skill Credits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar Module */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-indigo-50/50 shadow-xs" id="browse-sidebar-filters">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-800">Filters</h2>
          </div>

          {/* Search filter inside sidebar */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
              Refine Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Type keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Department Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
              Department
            </label>
            <div className="space-y-1">
              {availableCategories.map((catName) => (
                <button
                  key={catName}
                  onClick={() => setSelectedCategory(catName === 'All' ? '' : catName)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                    (selectedCategory === catName) || (!selectedCategory && catName === 'All')
                      ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty levels */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
              Difficulty target
            </label>
            <div className="space-y-1">
              {['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                    selectedDifficulty === diff
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Focus */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
              Tutor Availability
            </label>
            <div className="space-y-1">
              {['All', 'Available Today', 'Flexible', 'Weekends', 'Evenings Only'].map((badge) => (
                <button
                  key={badge}
                  onClick={() => setSelectedAvailability(badge)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                    selectedAvailability === badge
                      ? 'bg-violet-50 text-violet-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters helper */}
          {(searchQuery || selectedCategory || selectedDifficulty !== 'All' || selectedAvailability !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedDifficulty('All');
                setSelectedAvailability('All');
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold tracking-wide transition-all"
            >
              Clear All Filters
            </button>
          )}

        </div>

        {/* Real Skills List Panel */}
        <div className="lg:col-span-3 space-y-6" id="browse-skills-lists">
          
          {/* List Header controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-indigo-50/50 shadow-2xs">
            <span className="text-xs text-slate-500 font-mono">
              Showing <span className="font-bold text-slate-800">{filteredSkills.length}</span> matching skill offerings
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:border-indigo-600 focus:outline-hidden"
              >
                <option value="rating">Tutor Rating (Highest)</option>
                <option value="reviews">Popularity (Most Reviewed)</option>
              </select>
            </div>
          </div>

          {/* Main Cards Grid */}
          {filteredSkills.length === 0 ? (
            <div className="p-16 rounded-2xl border-2 border-dashed border-indigo-100 bg-white text-center flex flex-col items-center">
              <span className="text-4xl">🔍</span>
              <h3 className="font-display font-semibold text-lg text-slate-700 mt-4 mb-2">No matching peer skills found</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                Try searching. You can also offer this skill yourself by clicking "Offer a Skill" on the top header!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSkills.map((ski) => {
                return (
                  <div
                    key={ski.id}
                    className="bg-white rounded-2xl border border-indigo-50/80 hover:border-indigo-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden relative group"
                  >
                    {/* Upper decorative category ribbon */}
                    <div className="p-5 pb-3">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full uppercase font-medium">
                          {ski.category}
                        </span>
                        <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${getBadgeStyle(ski.availabilityBadge)}`}>
                          {ski.availabilityBadge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-base text-slate-800 hover:text-indigo-600 transition leading-snug">
                        {ski.title}
                      </h3>

                      {/* Difficulty */}
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md mt-1 mb-2 border ${getDifficultyStyle(ski.difficultyLevel)}`}>
                        Level: {ski.difficultyLevel}
                      </span>

                      {/* Description */}
                      <p className="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed">
                        {ski.description}
                      </p>

                    </div>

                    {/* Bottom Info Row */}
                    <div className="bg-slate-50/60 border-t border-indigo-50/40 p-4">
                      
                      {/* Tutor Info Panel */}
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          onClick={() => onViewTutorProfile(ski.tutorId)}
                          className="flex items-center gap-2 cursor-pointer group/avatar"
                          title="Click to browse profile"
                        >
                          <img
                            src={ski.tutorAvatar}
                            alt={ski.tutorName}
                            className="w-8 h-8 rounded-full object-cover border border-indigo-100 group-hover/avatar:border-indigo-600/65 transition-all"
                          />
                          <div className="text-left">
                            <span className="block text-xs font-bold text-slate-700 group-hover/avatar:text-indigo-600 leading-none">
                              {ski.tutorName}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium font-mono leading-none flex items-center gap-0.5">
                              <GraduationCap className="w-2.5 h-2.5" />
                              {ski.tutorDept.split(',')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Rating block */}
                        <div className="flex items-center gap-1 bg-amber-50 rounded-md px-2 py-1 border border-amber-100 text-amber-700 font-semibold text-[11px]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{ski.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({ski.reviewsCount || 8})</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1 font-mono text-xs text-indigo-700 font-bold">
                          <span>⚡</span>
                          <span>{ski.creditsRate} Credit/hr</span>
                        </div>
                        <button
                          onClick={() => onBookSkill(ski)}
                          className="flex items-center gap-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xs px-3.5 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
                        >
                          Book Session
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
