import React, { useState } from 'react';
import { Sparkles, Star, Plus, Globe, Shield, ArrowRight, User, BookOpen, Clock, Heart, ArrowLeft, GraduationCap } from 'lucide-react';

// Subcomponents
import Header from './components/Header';
import OfferSkillModal from './components/OfferSkillModal';
import Hero from './components/Hero';
import BrowseView from './components/BrowseView';
import ProfileView from './components/ProfileView';
import BookingView from './components/BookingView';
import ConfirmationView from './components/ConfirmationView';
import FeedbackView from './components/FeedbackView';

// Core Types & Initial Mock data
import { Skill, Tutor, SessionBooking, Category } from './types';
import { CATEGORIES, TUTORS, SKILLS } from './data';

export default function App() {
  
  // Navigation & Modal States
  const [currentPage, setCurrentPage] = useState<string>('home'); // home, browse, profile, booking, confirmation, feedback
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
  
  // Shared States (Allows real-time persistence between cards, reviews, booking schedules, credit count)
  const [userCredits, setUserCredits] = useState<number>(5); // start with 5 exchange credits
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [tutors, setTutors] = useState<Tutor[]>(TUTORS);
  const [selectedTutorId, setSelectedTutorId] = useState<string>('tutor_2'); // default to Chloe Tanaka
  const [selectedSkillTitle, setSelectedSkillTitle] = useState<string>('');
  
  // Search state passed between Home search bar and Browse search bar
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Latest booking record stored to show confirmation receipt summary
  const [latestBooking, setLatestBooking] = useState<SessionBooking | null>(null);

  // Active bookings list just in case student wants to see their schedule
  const [myBookings, setMyBookings] = useState<SessionBooking[]>([]);

  // 1. Offer a new skill handler
  const handleAddSkill = (newSkill: Omit<Skill, 'id' | 'tutorName' | 'tutorAvatar' | 'tutorDept' | 'rating' | 'reviewsCount'>) => {
    const id = `user_skill_${Date.now()}`;
    const skillItem: Skill = {
      ...newSkill,
      id,
      tutorName: 'Me (You)',
      tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=96&h=96',
      tutorDept: 'Software Engineering, Year 2',
      rating: 5.0,
      reviewsCount: 0,
    };

    setSkills((prev) => [skillItem, ...prev]);

    // Also append to a custom tutor object if needed, but adding to global skills covers standard Browse view instantly!
  };

  // 2. Submit a book request
  const handleConfirmBooking = (bookingData: {
    tutorId: string;
    tutorName: string;
    tutorAvatar: string;
    skillTitle: string;
    date: string;
    timeSlot: string;
    sessionType: 'In-person' | 'Virtual';
    notes: string;
  }) => {
    const newId = `SK-SWAP-${Math.floor(100000 + Math.random() * 900000)}`;
    const utcTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const bookingRecord: SessionBooking = {
      id: newId,
      tutorId: bookingData.tutorId,
      tutorName: bookingData.tutorName,
      tutorAvatar: bookingData.tutorAvatar,
      skillTitle: bookingData.skillTitle,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      sessionType: bookingData.sessionType,
      notes: bookingData.notes,
      status: 'Confirmed',
      createdAt: utcTimestamp,
    };

    // Deduct credit
    setUserCredits((prev) => Math.max(0, prev - 1));

    // Save bookings locally
    setLatestBooking(bookingRecord);
    setMyBookings((prev) => [bookingRecord, ...prev]);

    // Go to confirmation page
    setCurrentPage('confirmation');
  };

  // 3. Submit a review & recalculate tutor stars dynamically
  const handleSubmitFeedback = (feedback: {
    tutorId: string;
    reviewerName: string;
    reviewerAvatar: string;
    rating: number;
    comment: string;
    skillName: string;
    date: string;
  }) => {
    setTutors((prevTutors) => {
      return prevTutors.map((t) => {
        if (t.id === feedback.tutorId) {
          const newReviewList = [
            {
              id: `custom_rev_${Date.now()}`,
              reviewerName: feedback.reviewerName,
              reviewerAvatar: feedback.reviewerAvatar,
              rating: feedback.rating,
              comment: feedback.comment,
              date: feedback.date,
              skillName: feedback.skillName,
            },
            ...t.reviews,
          ];

          // Calculate new stats
          const totalRatingSum = newReviewList.reduce((acc, r) => acc + r.rating, 0);
          const newAvg = totalRatingSum / newReviewList.length;

          return {
            ...t,
            reviews: newReviewList,
            rating: newAvg,
            reviewsCount: newReviewList.length,
            totalSessions: t.totalSessions + 1,
          };
        }
        return t;
      });
    });

    // Also update matching skills listed under that tutor so client-side displays new recalculated average!
    setSkills((prevSkills) => {
      return prevSkills.map((sk) => {
        if (sk.tutorId === feedback.tutorId) {
          const matchingTutor = tutors.find(t => t.id === feedback.tutorId);
          if (matchingTutor) {
            const nextReviewsCount = matchingTutor.reviews.length + 1;
            const nextRating = ((matchingTutor.reviews.reduce((acc, r) => acc + r.rating, 0)) + feedback.rating) / nextReviewsCount;
            return {
              ...sk,
              rating: nextRating,
              reviewsCount: nextReviewsCount,
            };
          }
        }
        return sk;
      });
    });
  };

  // Page switcher helpers
  const handleHeroSearch = (keyword: string) => {
    setSearchQuery(keyword);
    setCurrentPage('browse');
  };

  const handleSelectCategoryFromHero = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage('browse');
  };

  const handleBookFromCard = (skill: Skill) => {
    const tutorObj = tutors.find(t => t.id === skill.tutorId);
    if (tutorObj) {
      setSelectedTutorId(tutorObj.id);
      setSelectedSkillTitle(skill.title);
      setCurrentPage('booking');
    }
  };

  const handleBookFromTutorProfile = (tResult: Tutor, specificSkillName?: string) => {
    setSelectedTutorId(tResult.id);
    setSelectedSkillTitle(specificSkillName || '');
    setCurrentPage('booking');
  };

  const handleViewTutorProfile = (tId: string) => {
    setSelectedTutorId(tId);
    setCurrentPage('profile');
  };

  // Dynamic content renderer based on currentPage state
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-12 pb-16" id="homepage-rendered-view">
            
            {/* Hero & Category module */}
            <Hero
              categories={CATEGORIES}
              onSearchSubmit={handleHeroSearch}
              onSelectCategory={handleSelectCategoryFromHero}
            />

            {/* Featured Skills Segment (Fiverr Inspired layout) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="featured-skills-section">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-indigo-50/60 mb-6">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Featured Peer Skills
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Handpicked student-offered classes highly rated this week</p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setCurrentPage('browse');
                  }}
                  className="mt-2 sm:mt-0 px-4 py-2 border border-indigo-100 hover:border-indigo-600 text-indigo-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 self-start"
                >
                  Browse all skills
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Cards Grid (Render first 4 skills from state) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {skills.slice(0, 4).map((ski) => (
                  <div
                    key={ski.id}
                    className="bg-white rounded-2xl border border-indigo-50/80 hover:border-indigo-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden relative group"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest leading-none bg-slate-50 border px-2 py-1 rounded-sm">
                          {ski.category.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                          ⚡ {ski.creditsRate} Credit/hr
                        </span>
                      </div>
                      
                      <h3 className="font-display font-extrabold text-sm text-slate-800 hover:text-indigo-600 transition tracking-tight line-clamp-1">
                        {ski.title}
                      </h3>

                      <span className="inline-block text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-xs mt-1 mb-3">
                        Level: {ski.difficultyLevel}
                      </span>

                      <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                        {ski.description}
                      </p>
                    </div>

                    {/* Bottom strip */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100/50 flex flex-col gap-3">
                      
                      {/* Tutor info horizontal row */}
                      <div 
                        onClick={() => handleViewTutorProfile(ski.tutorId)}
                        className="flex items-center justify-between cursor-pointer group/avatar"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={ski.tutorAvatar}
                            alt={ski.tutorName}
                            className="w-7 h-7 rounded-full object-cover border border-indigo-100 group-hover/avatar:border-indigo-600 transition"
                          />
                          <div className="text-left">
                            <span className="block text-[11px] font-bold text-slate-700 leading-none group-hover/avatar:text-indigo-600">
                              {ski.tutorName}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono leading-none">
                              {ski.tutorDept.split(',')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Rating pill */}
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px] bg-white border rounded-sm px-1.5 py-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                          <span>{ski.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* CTA booking buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => handleViewTutorProfile(ski.tutorId)}
                          className="py-1.5 rounded-lg border border-slate-200 hover:border-indigo-600 text-[11px] font-medium text-slate-600 hover:text-indigo-700 transition"
                        >
                          View Bio
                        </button>
                        <button
                          onClick={() => handleBookFromCard(ski)}
                          className="py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[11px] font-semibold text-white tracking-wide transition shadow-2xs active:scale-95"
                        >
                          Book Swap
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Campus Tutors (Airbnb Inspired layout) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="popular-tutors-section">
              <div className="pb-4 border-b border-indigo-50/60 mb-6">
                <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Meet Popular Campus Peers</h2>
                <p className="text-xs text-slate-500 mt-1">Active senior student coaches with high review satisfaction ratings</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {tutors.slice(0, 3).map((tut) => {
                  return (
                    <div
                      key={tut.id}
                      className="bg-white rounded-3xl border border-indigo-50/70 hover:border-indigo-200/80 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all relative group"
                    >
                      <div className="space-y-4 text-center sm:text-left">
                        {/* Upper row: Avatar + Name / rating */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <img
                            src={tut.avatar}
                            alt={tut.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
                          />
                          <div className="text-center sm:text-left">
                            <h3 
                              onClick={() => handleViewTutorProfile(tut.id)}
                              className="font-display font-extrabold text-base text-slate-800 hover:text-indigo-600 transition cursor-pointer"
                            >
                              {tut.name}
                            </h3>
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 font-mono">
                              <GraduationCap className="w-3 h-3 text-indigo-500" />
                              {tut.dept}
                            </span>
                            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                              <span className="text-xs font-bold text-amber-600 font-mono">★ {tut.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-slate-400">({tut.reviews.length} reviews)</span>
                            </div>
                          </div>
                        </div>

                        {/* Bio teaser */}
                        <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                          {tut.bio}
                        </p>

                        {/* Offered Topics */}
                        <div className="space-y-1 pt-2">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400 font-mono">Teaches:</span>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                            {tut.offeredSkills.map((skiTitle) => (
                              <span key={skiTitle} className="text-[10px] font-semibold bg-indigo-50/50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100/30">
                                {skiTitle}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Block actions */}
                      <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleViewTutorProfile(tut.id)}
                          className="py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-semibold text-xs rounded-xl border border-slate-100 transition active:scale-95"
                        >
                          View Full Schedule
                        </button>
                        <button
                          onClick={() => handleBookFromTutorProfile(tut)}
                          className="py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
                        >
                          Book Session
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>

            {/* How it works banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4" id="how-it-works-section">
              <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
                
                <div className="max-w-xl space-y-4">
                  <span className="text-amber-400 font-bold font-mono text-xs uppercase tracking-widest">
                    ⚡ Peer Credit Economy
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-snug">
                    How does the SkillSwap Credit System work?
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    Every student starts with ⚡ 5 complimentary credits. When you book a lesson, 1 credit is transferred to the tutor. List a skill you have so peers can book you to earn more core credits!
                  </p>
                  
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button
                      onClick={() => setIsOfferModalOpen(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 rounded-xl text-xs font-bold shadow-md cursor-pointer transition active:scale-95"
                    >
                      Offer My First Skill Now
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setCurrentPage('browse');
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/10 border border-white/30 transition text-white"
                    >
                      Explore listed classes &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        );

      case 'browse':
        return (
          <BrowseView
            skills={skills}
            tutors={tutors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onBookSkill={handleBookFromCard}
            onViewTutorProfile={handleViewTutorProfile}
          />
        );

      case 'profile':
        const profTutor = tutors.find(t => t.id === selectedTutorId) || tutors[0];
        return (
          <ProfileView
            tutor={profTutor}
            onBookTutor={handleBookFromTutorProfile}
            isCurrentUserProfile={selectedTutorId === 'current_user'}
          />
        );

      case 'booking':
        const bookTutor = tutors.find(t => t.id === selectedTutorId) || tutors[0];
        return (
          <BookingView
            tutor={bookTutor}
            skills={skills}
            initialSkillTitle={selectedSkillTitle}
            userCredits={userCredits}
            onConfirmBooking={handleConfirmBooking}
            onCancel={() => setCurrentPage('home')}
          />
        );

      case 'confirmation':
        if (!latestBooking) {
          return (
            <div className="text-center py-24">
              <p className="text-slate-500 text-xs">No active booking loaded.</p>
              <button onClick={() => setCurrentPage('home')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs">
                Back Home
              </button>
            </div>
          );
        }
        return (
          <ConfirmationView
            booking={latestBooking}
            onGoHome={() => setCurrentPage('home')}
            onGoToReviews={() => {
              // Prepopulate review target tutor
              setSelectedTutorId(latestBooking.tutorId);
              setCurrentPage('feedback');
            }}
          />
        );

      case 'feedback':
        return (
          <FeedbackView
            tutors={tutors}
            onSubmitFeedback={handleSubmitFeedback}
            preselectedTutorId={selectedTutorId}
          />
        );

      default:
        return <div className="text-center py-12">Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcfbfe] text-slate-800" id="skillsync-root-container">
      
      {/* Global Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={(page) => {
          // Reset states when swapping pages cleanly
          if (page === 'browse') {
            setSearchQuery('');
            setSelectedCategory('');
          }
          setCurrentPage(page);
        }}
        userCredits={userCredits}
        onOpenOfferModal={() => setIsOfferModalOpen(true)}
      />

      {/* Main Page Canvas rendering space */}
      <main className="flex-grow">
        {renderPageContent()}
      </main>

      {/* Global Campus Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12" id="skillsync-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  ⚡
                </div>
                <span className="font-display font-extrabold text-white text-lg tracking-tight">
                  SkillSync
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The peer-to-peer university learning swap platform. Built by students, for students. Expand your portfolio outside classroom schedules.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 font-mono">Platform Maps</h4>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition">Catalog Home Dashboard</button></li>
                <li><button onClick={() => { setSearchQuery(''); setSelectedCategory(''); setCurrentPage('browse'); }} className="hover:text-white transition">Browse Skills Database</button></li>
                <li><button onClick={() => setCurrentPage('feedback')} className="hover:text-white transition">Write Tutor Reviews</button></li>
              </ul>
            </div>

            {/* University info block */}
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 font-mono">Collegiate Integrity</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
                <li className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Standard Honor Code
                </li>
                <li>Sessions are complimentary and run exclusively using simulated swap study credits. Commercial tutoring is strictly disallowed.</li>
              </ul>
            </div>

            {/* Self-referential help block */}
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 font-mono">Get Assistance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Having troubles with a peer tutor session? Reach out to student Union advisors or consult our campus forum guidelines.
              </p>
              <div className="mt-4 pt-1 font-mono text-[9px] text-slate-500">
                SYSTEM AGENT LOCAL TIME MATCH: 2026-05-26
              </div>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>&copy; 2026 SkillSync Campus Exchange. All rights reversed to student developers.</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-slate-300 cursor-pointer">Terms of Use</span>
              <span className="hover:text-slate-300 cursor-pointer">Privacy Charter</span>
              <span className="text-indigo-400 font-bold font-mono">⚡ 5 Free Credits Loaded</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal overlays */}
      <OfferSkillModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onAddSkill={handleAddSkill}
      />

    </div>
  );
}
