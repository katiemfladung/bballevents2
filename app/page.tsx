'use client';
import Link from 'next/link';
import { fakeDB } from '@/lib/fakeDB';

export default function HomePage() {
  const events = Object.values(fakeDB.events);

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Events</h1>
          <Link 
            href="/new-event"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create New Event
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No events yet. Create your first event!
          </p>
        ) : (
          <div className="grid gap-4">
            {events.map(event => (
              <Link 
                key={event.id}
                href={`/${event.id}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-600">Dates: {event.dates}</p>
                <p className="text-gray-600">Courts: {event.courts}</p>
                <p className="text-gray-600">Teams: {event.teams.length}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}