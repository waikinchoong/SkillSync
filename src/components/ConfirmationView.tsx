import React from 'react';
import { CheckCircle2, Clock, Video, MapPin, Sparkles, Calendar, ArrowRight, Bookmark } from 'lucide-react';
import { SessionBooking } from '../types';

interface ConfirmationViewProps {
  booking: SessionBooking;
  onGoHome: () => void;
  onGoToReviews: () => void;
}

export default function ConfirmationView({ booking, onGoHome, onGoToReviews }: ConfirmationViewProps) {
  
  // Format dates for display
  const cleanDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12" id="booking-confirmation-view">
      
      {/* Decorative Fireworks Backdrop element */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-violet-100/20 blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl border border-indigo-50/70 shadow-2xl overflow-hidden relative" id="receipt-card">
        
        {/* Top color ribbon */}
        <div className="h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="p-6 sm:p-10 text-center space-y-6">
          
          {/* Confirmed Icon animation */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs mb-2">
            <CheckCircle2 className="w-9 h-9 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 font-mono">
              Reservation Locked Successfully
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Your Lesson is Confirmed!
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              We have locked your swap on the university exchange catalog. An invite link/info notification has been shared with your tutor {booking.tutorName}.
            </p>
          </div>

          {/* High-Fidelity Receipt Container */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-100 text-left p-6 space-y-4">
            
            {/* Voucher ID & timestamp */}
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 font-mono text-[10px] text-slate-400">
              <span>EXCHANGE SECURE ID: {booking.id}</span>
              <span>ISSUED UTC: {booking.createdAt}</span>
            </div>

            {/* Tutor Details block */}
            <div className="flex items-center gap-3">
              <img
                src={booking.tutorAvatar}
                alt={booking.tutorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
              />
              <div>
                <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Your Peer Instructor:</span>
                <span className="block text-sm font-extrabold text-slate-800 leading-tight">{booking.tutorName}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-sm mt-1 font-mono">
                  ★ Level verified
                </span>
              </div>
            </div>

            {/* Booking specific detail fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/50 pt-4 text-xs">
              
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Lesson Subject:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {booking.skillTitle}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Class Format:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {booking.sessionType === 'Virtual' ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      Virtual (Meeting URL Sent)
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      In-Person (Campus Hub)
                    </>
                  )}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Target Schedule Day:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {cleanDate(booking.date)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Scheduled Hrs:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {booking.timeSlot}
                </span>
              </div>

            </div>

            {/* Notes if provided */}
            {booking.notes && (
              <div className="bg-white/80 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                <span className="font-bold block text-slate-700 mb-1">Your notes for the tutor:</span>
                "{booking.notes}"
              </div>
            )}

            {/* Cost Receipt itemizer */}
            <div className="flex justify-between items-center bg-amber-50 rounded-xl p-3 text-xs text-amber-800 border border-amber-200/30">
              <span className="font-medium">Total skill credits charged:</span>
              <span className="font-mono font-bold text-sm">⚡ 1 Credit</span>
            </div>

          </div>

          {/* Action Navigation triggers */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={onGoHome}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Back to Catalog Dashboard
            </button>
            <button
              onClick={onGoToReviews}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
            >
              Write tutor a feedback
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
