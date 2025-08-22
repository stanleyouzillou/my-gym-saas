"use client";

import { useState } from "react";
import { createSession } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function FranchiseDashboardPage() {
  const { user } = useUser();
  const franchiseId = (user?.publicMetadata as any)?.franchiseId as string | undefined;
  const [programId, setProgramId] = useState("yoga_basics");
  const [startDate, setStartDate] = useState("2025-09-01"); // yyyy-mm-dd
  const [startTimeLocal, setStartTimeLocal] = useState("10:00"); // HH:mm
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [coachName, setCoachName] = useState("Coach A");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // Compose ISO string from local date+time, enforce seconds/ms = 0
      const local = new Date(`${startDate}T${startTimeLocal}:00`);
      const startTimeIso = new Date(
        Date.UTC(
          local.getFullYear(),
          local.getMonth(),
          local.getDate(),
          local.getHours(),
          local.getMinutes(),
          0,
          0
        )
      ).toISOString();

      const res = await createSession({
        programId,
        startTime: startTimeIso,
        durationMinutes: Number(durationMinutes),
        maxCapacity: Number(maxCapacity),
        coachName: coachName || undefined,
      });
      setResult(`Created session ${res.id}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">GymFranchise Dashboard</h1>
          <p className="text-slate-600">Create class sessions and manage your catalog.</p>
          <div className="mt-2 text-sm text-slate-700">
            Franchise: <span className="font-mono">{franchiseId ?? "unknown"}</span>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Create a Class Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="programId">Program ID</Label>
                <Input
                  id="programId"
                  placeholder="e.g. yoga_basics"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="startDate">Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="startTimeLocal">Start Time</Label>
                <Input
                  id="startTimeLocal"
                  type="time"
                  step={900}
                  value={startTimeLocal}
                  onChange={(e) => setStartTimeLocal(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <select
                  id="duration"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="capacity">Max Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  required
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <Label htmlFor="coach">Coach Name (optional)</Label>
                <Input
                  id="coach"
                  placeholder="Coach A"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                />
              </div>

              <div className="md:col-span-2 mt-2 flex items-center gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Session"}
                </Button>
                {result && <span className="text-green-700 text-sm">{result}</span>}
                {error && <span className="text-red-700 text-sm">{error}</span>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
