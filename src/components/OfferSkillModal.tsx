import React, { useState } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { Skill } from '../types';

interface OfferSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkill: (newSkill: Omit<Skill, 'id' | 'tutorName' | 'tutorAvatar' | 'tutorDept' | 'rating' | 'reviewsCount'>) => void;
}

export default function OfferSkillModal({ isOpen, onClose, onAddSkill }: OfferSkillModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology & Coding');
  const [difficultyLevel, setDifficultyLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Beginner');
  const [description, setDescription] = useState('');
  const [availabilityBadge, setAvailabilityBadge] = useState<'Available Today' | 'Flexible' | 'Weekends' | 'Evenings Only'>('Flexible');
  
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddSkill({
      title,
      category,
      description,
      difficultyLevel,
      tutorId: 'current_user',
      creditsRate: 1,
      availabilityBadge,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setDescription('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" id="offer-skill-modal">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-indigo-50/50 flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-display font-semibold text-lg">Teach & Give Back to Your Campus</h3>
          </div>
          <p className="text-white/80 text-xs">
            List a skill you can help other students master. Earn credits back to use on tutors you want.
          </p>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-display text-xl font-bold text-slate-800 mb-1">Skill Listed Successfully!</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Your offering is now live on the SkillSync browse board for other university students to discover.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                What skill fits best? (e.g. Intro to Django, Advanced Figma Layouts)
              </label>
              <input 
                type="text"
                required
                placeholder="React Component Design, Chemistry I Lab Prep..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden text-sm bg-slate-50/50"
              />
            </div>

            {/* Category / Level Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden text-sm bg-slate-50/50"
                >
                  <option value="Technology & Coding">Technology & Coding</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Academics & Math">Academics & Math</option>
                  <option value="Languages & Writing">Languages & Writing</option>
                  <option value="Business & Finance">Business & Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Student Level
                </label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden text-sm bg-slate-50/50"
                >
                  <option value="Beginner">Beginner level</option>
                  <option value="Intermediate">Intermediate level</option>
                  <option value="Advanced">Advanced level</option>
                  <option value="All Levels">All Levels are welcome</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Brief session description
              </label>
              <textarea
                required
                rows={3}
                placeholder="What can you cover in a 1-hour session? Mention your level of expertise, expected outcomes, or prerequisites."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden text-sm bg-slate-50/50"
              />
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Your availability focus
                </label>
                <select
                  value={availabilityBadge}
                  onChange={(e) => setAvailabilityBadge(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden text-sm bg-slate-50/50"
                >
                  <option value="Available Today">Available Today</option>
                  <option value="Flexible">Flexible schedule</option>
                  <option value="Weekends">Weekends only</option>
                  <option value="Evenings Only">Evenings Only</option>
                </select>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/40 text-[11px] text-amber-800 self-center">
                <span className="font-bold">⚡ Standard Campus Rate:</span> Each session burns 1 Skill Credit from the learners account and transfers it immediately to your balance as soon as you meet!
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
              >
                Submit Offering
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
