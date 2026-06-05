export interface TimeSlot {
  id: string;
  timeString: string;
  isAvailable: boolean;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  skillName: string;
}

export interface Skill {
  id: string;
  title: string;
  category: string;
  description: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorDept: string;
  rating: number;
  reviewsCount: number;
  creditsRate: number; // exchange points standard
  availabilityBadge: 'Available Today' | 'Flexible' | 'Weekends' | 'Evenings Only';
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  bio: string;
  offeredSkills: string[];
  learningRequests: string[];
  rating: number;
  reviewsCount: number;
  totalSessions: number;
  availabilitySchedule: {
    days: string[]; // e.g. ["Mon", "Wed", "Fri"]
    hours: string; // e.g. "2:00 PM - 6:00 PM"
    slots: TimeSlot[];
  };
  reviews: Review[];
}

export interface SessionBooking {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  skillTitle: string;
  date: string;
  timeSlot: string;
  sessionType: 'In-person' | 'Virtual';
  notes?: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  skillsCount: number;
}
