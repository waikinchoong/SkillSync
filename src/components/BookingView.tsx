import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, MapPin, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { Tutor, Skill, TimeSlot } from '../types';

interface BookingViewProps {
  tutor: Tutor;
  skills: Skill[];
  initialSkillTitle?: string;
  userCredits: number;
  onConfirmBooking: (bookingData: {
    tutorId: string;
    tutorName: string;
    tutorAvatar: string;
    skillTitle: string;
    date: string;
    timeSlot: string;
    sessionType: 'In-person' | 'Virtual';
    notes: string;
  }) => void;
  onCancel: () => void;
}

export default function BookingView({
  tutor,
  skills,
  initialSkillTitle = '',
  userCredits,
  onConfirmBooking,
  onCancel,
}: BookingViewProps) {
  
  // Extract tutor relevant skills
  const tutorSkills = skills.filter(s => s.tutorId === tutor.id);
  
  const [selectedSkill, setSelectedSkill] = useState<string>(
    initialSkillTitle || (tutorSkills[0]?.title || tutor.offeredSkills[0] || '')
  );

  // States
  const [sessionType, setSessionType] = useState<'In-person' | 'Virtual'>('Virtual');
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-27'); // Defaults next day
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    tutor.availabilitySchedule.slots.find(s => s.isAvailable)?.timeString || ''
  );
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  // Sample upcoming available days
  const upcomingDates = [
    { label: 'Tomorrow', dateString: '2026-05-27', dayName: 'Wed' },
    { label: 'Thursday', dateString: '2026-05-28', dayName: 'Thu' },
    { label: 'Friday', dateString: '2026-05-29', dayName: 'Fri' },
    { label: 'Saturday', dateString: '2026-05-30', dayName: 'Sat' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedSkill) {
      setValidationError('Please select which skill you wish to study.');
      return;
    }
    if (!selectedTimeSlot) {
      setValidationError('Please select an available tutoring time slot.');
      return;
    }
    if (userCredits < 1) {
      setValidationError('Insufficient Skill Credits. You need at least ⚡ 1 Credit to request a peer learning session.');
      return;
    }

    onConfirmBooking({
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      skillTitle: selectedSkill,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      sessionType,
      notes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="booking-session-page">
      
      {/* Page Header */}
      <div className="border-b border-indigo-50/85 pb-6 mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Request learning session</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Choose your subjects and lock your preferred class schedule instantly.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Module: Tutor summary card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-indigo-50/80 p-5 shadow-xs text-center">
            <span className="block text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400 mb-4">You are Booking:</span>
            
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-600/20"
            />
            <h3 className="font-display font-bold text-base text-slate-800 mt-3 leading-none">{tutor.name}</h3>
            <span className="block text-[10px] text-indigo-600 font-mono font-semibold mt-1 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
              {tutor.dept.split(',')[0]}
            </span>

            <div className="my-4 pt-4 border-t border-slate-100 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Tuition Cost:</span>
                <span className="font-bold text-indigo-700 font-mono">⚡ 1 Credit/hr</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Your Balance:</span>
                <span className={`font-bold font-mono ${userCredits < 1 ? 'text-rose-500' : 'text-amber-600'}`}>
                  ⚡ {userCredits} Credits Available
                </span>
              </div>
            </div>

            {userCredits < 1 && (
              <div className="flex items-start gap-1 p-3 bg-rose-50 rounded-xl border border-rose-200/40 text-[11px] text-rose-700 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>You do not have enough skill credits. Earn more by listing your own skills in the top bar!</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50/50 p-4 border border-amber-200/40 rounded-xl text-xs text-amber-800 space-y-2">
            <span className="font-bold flex items-center gap-1">⚡ Campus Honor Code Policy</span>
            <p className="leading-relaxed">
              If you must reschedule or cancel, inform your peer tutor via message at least 2 hours before target schedule.
            </p>
          </div>
        </div>

        {/* Right Module: Form selection */}
        <div className="lg:col-span-2">
          
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-indigo-50/50 shadow-md p-6 sm:p-8 space-y-6">
            
            {/* Error notifications */}
            {validationError && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Title Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                1. Select the Skill Subject
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {tutor.offeredSkills.map((skillTitle) => {
                  const isSelected = selectedSkill === skillTitle;
                  return (
                    <button
                      key={skillTitle}
                      type="button"
                      onClick={() => {
                        setSelectedSkill(skillTitle);
                        setValidationError('');
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/30 font-semibold text-indigo-900 shadow-2xs'
                          : 'border-slate-200 bg-slate-5/20 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-indigo-600 font-bold">⚡</span>
                        {skillTitle}
                      </span>
                      {isSelected ? (
                        <span className="font-mono text-[9px] bg-indigo-600 text-white rounded-sm px-1.5 py-0.5">Selected</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Choose Subject</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                2. Choose Booking Date
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {upcomingDates.map((item) => {
                  const isSelected = selectedDate === item.dateString;
                  return (
                    <button
                      key={item.dateString}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.dateString);
                        setValidationError('');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-900 shadow-2xs'
                          : 'border-slate-200 bg-slate-50/30 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-400 leading-none mb-1">{item.label}</span>
                      <span className="text-sm font-black leading-none">{item.dateString.slice(-2)}</span>
                      <span className="text-[10px] font-mono mt-1 font-bold text-indigo-600">{item.dayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                3. Choose Tutoring Hours Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tutor.availabilitySchedule.slots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.timeString;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => {
                        if (slot.isAvailable) {
                          setSelectedTimeSlot(slot.timeString);
                          setValidationError('');
                        }
                      }}
                      className={`p-3 rounded-xl border text-left text-xs flex items-center justify-between transition ${
                        !slot.isAvailable
                          ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-mono">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        {slot.timeString}
                      </span>
                      <span className="text-[10px]">
                        {slot.isAvailable ? (isSelected ? 'Selected' : 'Available') : 'Reserved'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                4. Select Session Format
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSessionType('Virtual')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    sessionType === 'Virtual'
                      ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Video className="w-5 h-5 text-indigo-600 mb-2" />
                  <span className="text-xs">Virtual Meeting</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">Zoom or Discord URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionType('In-person')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    sessionType === 'In-person'
                      ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-purple-600 mb-2" />
                  <span className="text-xs">In-person Campus</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">Library or Student Union</span>
                </button>
              </div>
            </div>

            {/* Short Study Inquiry Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                5. Add Study Goals (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: I would love to focus on understanding component props and handling form submission. I can bring my laptop and current draft..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:border-indigo-600 focus:outline-hidden text-slate-800"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Booking transfers: <span className="font-bold text-indigo-700">⚡ 1 skill credit</span>
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Confirm Booking Appointment
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
