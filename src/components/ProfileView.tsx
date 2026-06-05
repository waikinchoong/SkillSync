import React from 'react';
import { Star, Calendar, MessageSquare, Clock, GraduationCap, ArrowRight, UserCheck, ShieldCheck, MapPin } from 'lucide-react';
import { Tutor, Skill } from '../types';

interface ProfileViewProps {
  tutor: Tutor;
  onBookTutor: (tutor: Tutor, skillName?: string) => void;
  isCurrentUserProfile?: boolean;
}

export default function ProfileView({ tutor, onBookTutor, isCurrentUserProfile = false }: ProfileViewProps) {
  
  // Calculate average score
  const avgRating = tutor.reviews.length > 0 
    ? (tutor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / tutor.reviews.length).toFixed(1)
    : tutor.rating.toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="student-profile-view">
      
      {/* Upper Navigation Indicator */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          Student Profile Space &gt; <span className="text-slate-800 font-bold">{tutor.name}</span>
        </span>
        {isCurrentUserProfile && (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono uppercase font-bold border border-emerald-200/50">
            Current Logged-in Account
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Profile card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-indigo-50/50 shadow-md p-6 text-center relative overflow-hidden">
            {/* Top gradient strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

            {/* Profile Avatar */}
            <div className="relative inline-block mt-4">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active on Campus">
                <span className="block w-2 bg-white rounded-full animate-ping"></span>
              </div>
            </div>

            <h2 className="font-display font-black text-xl text-slate-900 mt-4 leading-none">{tutor.name}</h2>
            
            {/* Dept details */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-2 font-mono">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{tutor.dept}</span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 my-6 pt-4 border-t border-slate-100">
              <div className="text-center p-2 bg-slate-50 rounded-xl">
                <span className="block text-sm font-black text-indigo-700">{avgRating} ★</span>
                <span className="text-[10px] text-slate-400 font-mono">Rating Score</span>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-xl">
                <span className="block text-sm font-black text-slate-700">{tutor.reviews.length}</span>
                <span className="text-[10px] text-slate-400 font-mono">Reviews Given</span>
              </div>
            </div>

            {/* Verification block */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 p-2 bg-emerald-50/60 rounded-xl border border-emerald-100/60 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-emerald-800">Enrollment Verified (Campus-ID Match)</span>
            </div>

            {/* Booking Call-To-Action (hidden if looking at current user profile) */}
            {!isCurrentUserProfile ? (
              <button
                onClick={() => onBookTutor(tutor)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition active:scale-95"
              >
                Book Session Now
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-600 font-medium">
                ⚡ Earn credits by teaching other peers!
              </div>
            )}

          </div>

          {/* Availability schedule */}
          <div className="bg-white rounded-2xl border border-indigo-50/50 shadow-xs p-6">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Weekly Class Hours
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">Scheduled Days:</span>
                <div className="flex gap-1.5">
                  {tutor.availabilitySchedule.days.map((day) => (
                    <span key={day} className="px-2 py-0.5 rounded-sm bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold font-mono">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Coaching Hours:</span>
                <span className="font-mono font-semibold text-slate-700 bg-slate-50 border px-2 py-0.5 rounded-sm">
                  {tutor.availabilitySchedule.hours}
                </span>
              </div>
            </div>

            {/* Mini slot scheduler list wrapper */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <span className="block text-[11px] font-bold text-slate-400 font-mono uppercase tracking-widest">Available Slots Tomorrow</span>
              <div className="space-y-1">
                {tutor.availabilitySchedule.slots.map((sl) => (
                  <div key={sl.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-[11px]">
                    <span className="font-mono text-slate-600">{sl.timeString}</span>
                    <span className={`px-2 py-0.5 rounded-sm ${sl.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                      {sl.isAvailable ? 'Vacant' : 'Reserved'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Bio, Offered Skills, learning requests & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About description */}
          <div className="bg-white rounded-3xl border border-indigo-50/50 shadow-xs p-6 sm:p-8">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-500 mb-3">Student Memo</h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {tutor.bio}
            </p>

            {/* Offered Skills List */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">Offered Skills ( tutoring )</h4>
              <div className="flex flex-wrap gap-2.5">
                {tutor.offeredSkills.map((skill) => (
                  <div 
                    key={skill}
                    onClick={() => !isCurrentUserProfile && onBookTutor(tutor, skill)}
                    className={`flex items-center gap-1 bg-white border rounded-xl py-2 px-3 text-xs font-semibold hover:border-indigo-600 transition cursor-pointer shadow-2xs ${
                      isCurrentUserProfile ? 'cursor-default pointer-events-none hover:border-slate-100' : ''
                    }`}
                  >
                    <span className="text-indigo-600">⚡</span>
                    <span className="text-slate-800">{skill}</span>
                    {!isCurrentUserProfile && <span className="text-[10px] text-slate-400 font-mono ml-1">Book →</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Requests list */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">My Learning Requests ( what I want to learn )</h4>
              <p className="text-xs text-slate-400 mb-3 font-mono">Will gladly swap skills with anyone who can teach these subjects:</p>
              <div className="flex flex-wrap gap-2">
                {tutor.learningRequests.map((req) => (
                  <span key={req} className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100/50 rounded-lg text-xs font-medium">
                    📖 {req}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Ratings & reviews section */}
          <div className="bg-white rounded-3xl border border-indigo-50/50 shadow-xs p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Student Reviews ({tutor.reviews.length})
              </h3>
              
              <div className="flex items-center gap-1.5 text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 font-bold text-amber-700">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{avgRating} Average</span>
              </div>
            </div>

            {tutor.reviews.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No session review logs recorded yet. Be the first to book and rate them!
              </div>
            ) : (
              <div className="space-y-6">
                {tutor.reviews.map((rev) => {
                  return (
                    <div key={rev.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100"
                          />
                          <div className="text-left">
                            <span className="block text-xs font-bold text-slate-800 leading-tight">
                              {rev.reviewerName}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {rev.date}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Course / Skill targeted */}
                      <div>
                        <span className="inline-block text-[10px] text-indigo-700 font-bold font-mono bg-indigo-50/70 border border-indigo-100/50 px-2 py-0.5 rounded-sm">
                          Subject: {rev.skillName}
                        </span>
                      </div>

                      {/* Review comment text */}
                      <p className="text-slate-600 text-xs leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
