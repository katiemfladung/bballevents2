'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fakeDB } from '@/lib/fakeDB';

export default function NewTeamPage() {
  const { eventId } = useParams();
  const router = useRouter();

  const [school, setSchool] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachCell, setCoachCell] = useState('');
  const [attendingDates, setAttendingDates] = useState('');
  const [level, setLevel] = useState('');
  const [timePrefs, setTimePrefs] = useState('');

  if (!eventId || typeof eventId !== 'string') {
    return <p className="text-center p-8">Loading...</p>;
  }

  const event = fakeDB.events[eventId];

  if (!event) {
    return <p className="text-center p-8">Event not found.</p>;
  }

  const handleCreate = () => {
    if (!school.trim()) {
      alert('Please enter a school name');
      return;
    }

    const teamId = `${school.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newTeam = {
      id: teamId,
      school,
      coachEmail,
      coachCell,
      attendingDates,
      level,
      timePrefs,
      players: [],
    };

    event.teams.push(newTeam);
    router.push(`/${eventId}`);
  };

  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Add New Team</h1>
          <Link 
            href={`/${eventId}`}
            className="text-blue-500 hover:text-blue-600 transition"
          >
            Back to Event
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter school name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coach Email
              </label>
              <input
                type="email"
                value={coachEmail}
                onChange={(e) => setCoachEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="coach@school.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coach Cell Phone
              </label>
              <input
                type="tel"
                value={coachCell}
                onChange={(e) => setCoachCell(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates Attending
              </label>
              <input
                value={attendingDates}
                onChange={(e) => setAttendingDates(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., All dates, or specific dates"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select level...</option>
                <option value="Varsity">Varsity</option>
                <option value="JV">JV</option>
                <option value="Freshman">Freshman</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Preferences
              </label>
              <textarea
                value={timePrefs}
                onChange={(e) => setTimePrefs(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter any time preferences or restrictions"
                rows={3}
              />
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Team
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}