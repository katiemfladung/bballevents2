'use client';
import { useParams } from 'next/navigation';
import { fakeDB } from '@/lib/fakeDB';

export default function EventPage() {
  const { eventId } = useParams();

  if (!eventId || typeof eventId !== 'string') {
    return <p>Loading...</p>;
  }

  const event = fakeDB.events[eventId];

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>{event.name}</h1>
      <p><strong>Dates:</strong> {event.dates}</p>
      <p><strong>Courts:</strong> {event.courts}</p>

      <h2>Teams: {event.teams.length}</h2>
      {event.teams.map((team) => (
        <div key={team.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #ccc" }}>
          <h3>{team.school}</h3>
          <p><strong>Coach:</strong> {team.coachEmail} / {team.coachCell}</p>
          <p><strong>Dates Attending:</strong> {team.attendingDates}</p>
          <p><strong>Level:</strong> {team.level}</p>
          <p><strong>Time Prefs:</strong> {team.timePrefs}</p>
          <p><strong>Players:</strong> {team.players.length}</p>
        </div>
      ))}
    </main>
  );
}
