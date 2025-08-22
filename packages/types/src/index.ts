export type SessionDTO = {
  id: string;
  programId: string;
  startsAt: string; // ISO
  durationMin: number;
  capacity: number;
  instructor?: string;
};

export type BookingDTO = {
  id: string;
  sessionId: string;
  memberId: string;
  status: 'BOOKED' | 'CANCELLED' | 'WAITLISTED';
  createdAt: string; // ISO
};

// Normalized view used by API responses in Scheduling context
export type SessionView = {
  id: string;
  programId: string;
  startTime: string; // ISO
  durationMinutes: number;
  maxCapacity: number;
  coachName?: string | null;
};

// Input contract for creating a session
export type CreateSessionInput = {
  programId: string;
  startTime: string; // ISO
  durationMinutes: number;
  maxCapacity: number;
  coachName?: string;
};
