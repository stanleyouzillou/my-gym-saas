export type CreateSessionInput = {
  programId: string;
  startTime: string; // ISO
  durationMinutes: number;
  maxCapacity: number;
  coachName?: string;
};
