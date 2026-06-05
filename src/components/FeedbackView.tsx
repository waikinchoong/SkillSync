import React, { useState } from 'react';
import { Star, ArrowRight, ThumbsUp, AlertCircle, Check } from 'lucide-react';
import { Tutor, Review } from '../types';

interface FeedbackViewProps {
  tutors: Tutor[];
  onSubmitFeedback: (feedback: {
    tutorId: string;
    reviewerName: string;
    reviewerAvatar: string;
    rating: number;
    comment: string;
    skillName: string;
    date: string;
  }) => void;
  preselectedTutorId?: string;
}

export default function FeedbackView({ tutors, onSubmitFeedback, preselectedTutorId = '' }: FeedbackViewProps) {
  
  // States
  const [selectedTutorId, setSelectedTutorId] = useState<string>(
    preselectedTutorId || (tutors[0]?.id || '')
  );
  
  const activeTutor = tutors.find(t => t.id === selectedTutorId);
  
  // Set default skill based on active tutor
  const [skillName, setSkillName] = useState<string>(
    activeTutor?.offeredSkills[0] || ''
  );

  // Update skillName when tutor changes
  React.useEffect(() => {
    if (activeTutor) {
      setSkillName(activeTutor.offeredSkills[0] || '');
    }
  }, [selectedTutorId, activeTutor]);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Alex J.'); // Simple user initials defaults
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!selectedTutorId) {
      setErrorText('Please select which tutor you are reviewing.');
      return;
    }
    if (!comment.trim()) {
      setErrorText('Please type a short description about your learning experience.');
      return;
    }
    if (comment.trim().length < 8) {
      setErrorText('Your feedback comment is a bit short. Tell us what went well in detail!');
      return;
    }

    // Capture standard current date string
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });

    onSubmitFeedback({
      tutorId: selectedTutorId,
      reviewerName: reviewerName.trim() || 'Anonymous Peer',
      reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=96&h=96', // user mock avatar
      rating,
      comment,
      skillName: skillName || activeTutor?.offeredSkills[0] || 'Peer Study Session',
      date: formattedDate,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" id="feedback-and-rating-view">
      
      {/* Page Header */}
      <div className="border-b border-indigo-50/85 pb-6 mb-8 text-center sm:text-left">
        <h1 className="font-display font-bold text-3xl text-slate-900">Post peer study feedback</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Share your experience. Honest reviews help maintain high educational standards on our campus platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Quick select of tutors */}
        <div className="md:col-span-1 space-y-4">
          <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Select Peer Tutor:</span>
          
          <div className="space-y-2">
            {tutors.map((t) => {
              const isActive = t.id === selectedTutorId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTutorId(t.id);
                    setSubmitted(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/40 font-semibold shadow-xs ring-2 ring-indigo-600/10'
                      : 'border-slate-200/60 bg-white text-slate-700 hover:border-indigo-200'
                  }`}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <span className="block text-xs font-bold text-slate-800 leading-none truncate">{t.name}</span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-1 truncate">{t.dept.split(',')[0]}</span>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interaction Form */}
        <div className="md:col-span-2">
          
          <div className="bg-white rounded-3xl border border-indigo-50/50 shadow-md p-6 sm:p-8">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <ThumbsUp className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-800">Feedback submitted!</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto text-center">
                    Your rating is now live on {activeTutor?.name}'s student profile. Thank you for contributing to our student catalog!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {errorText && (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Submiter Identity initials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Signed Name / Initials
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex J."
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:border-indigo-600 focus:outline-hidden"
                    />
                  </div>

                  {activeTutor && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Subject practiced
                      </label>
                      <select
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:border-indigo-600 focus:outline-hidden"
                      >
                        {activeTutor.offeredSkills.map((sk) => (
                          <option key={sk} value={sk}>{sk}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Star Rating system */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center sm:text-left">
                    Level of skill satisfaction & Clarity
                  </label>
                  <div className="flex items-center justify-center sm:justify-start gap-1 pb-2">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const isGold = starNum <= (hoverRating || rating);
                      return (
                        <button
                          key={starNum}
                          type="button"
                          onMouseEnter={() => setHoverRating(starNum)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starNum)}
                          className="p-1 focus:outline-hidden transform hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              isGold
                                ? 'fill-amber-400 text-amber-500 filter drop-shadow-xs'
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="font-mono text-sm text-amber-600 font-extrabold ml-3">
                      {rating}.0 / 5.0
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1 text-center sm:text-left">
                    (Click to locked. Hover to see score description)
                  </span>
                </div>

                {/* Description comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Write detailed comments for other students
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell other students what were their tutoring style, explanations, friendliness, or what projects you completed live!"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs focus:border-indigo-600 focus:outline-hidden bg-slate-50/50 text-slate-800"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Be nice and constructive.</span>
                    <span>Min 8 characters.</span>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-100 text-right">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 hover:shadow-md text-white transition active:scale-95 cursor-pointer"
                  >
                    Submit Review & Stars
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
