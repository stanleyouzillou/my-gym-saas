import { getSessions } from '../../lib/api';

export default async function SessionsPage() {
  const sessions = await getSessions();
  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Sessions</h1>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No sessions available or API not running.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id} className="border rounded p-3">
              <div className="font-mono text-sm">{s.id}</div>
              <div>Starts: {new Date(s.startTime).toLocaleString()}</div>
              <div>Duration: {s.durationMinutes} min — Capacity: {s.maxCapacity}</div>
              {s.coachName && <div>Coach: {s.coachName}</div>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
