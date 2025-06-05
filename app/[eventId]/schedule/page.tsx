'use client';
import { useParams } from 'next/navigation';
import { fakeDB } from '@/lib/fakeDB';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';

export default function ScheduleBuilder() {
  const { eventId } = useParams();
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      const event = fakeDB.events[eventId];
      if (event) {
        setGames(event.games || []);
      }
    }
  }, [eventId]);

  if (!eventId || typeof eventId !== 'string') return <p>Loading...</p>;

  const event = fakeDB.events[eventId];
  if (!event) return <p>Event not found.</p>;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(games);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setGames(reordered);
    fakeDB.events[eventId].games = reordered;
  };

  const updateGame = (id: string, key: 'time' | 'court', value: string) => {
    const updated = games.map((game) =>
      game.id === id ? { ...game, [key]: value } : game
    );
    setGames(updated);
    fakeDB.events[eventId].games = updated;
  };

  const findConflicts = (game: any, i: number) => {
    const errors: string[] = [];
    if (!game.time || !game.court) {
      errors.push('Missing time/court');
    }

    const prev = games[i - 1];
    const overlaps = (g: typeof game) =>
      g && (g.teamA === game.teamA || g.teamB === game.teamA || g.teamA === game.teamB || g.teamB === game.teamB);

    if (prev && overlaps(prev)) {
      errors.push('Back-to-back');
    }

    const sameTimeConflicts = games.filter(
      (g, idx) =>
        idx !== i &&
        g.time === game.time &&
        (g.teamA === game.teamA ||
          g.teamB === game.teamA ||
          g.teamA === game.teamB ||
          g.teamB === game.teamB)
    );

    if (sameTimeConflicts.length) {
      errors.push('Conflict: overlapping game');
    }

    return errors;
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Edit Schedule – {event.name}</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="games">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {games.map((game, index) => {
                const issues = findConflicts(game, index);
                return (
                  <Draggable key={game.id} draggableId={game.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          marginBottom: 16,
                          padding: 12,
                          background: issues.length ? '#ffe5e5' : '#f9f9f9',
                          border: issues.length ? '2px solid red' : '1px solid #ccc',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <strong>{game.teamA} vs {game.teamB}</strong><br />
                        Time: <input
                          value={game.time}
                          onChange={(e) => updateGame(game.id, 'time', e.target.value)}
                        /><br />
                        Court: <input
                          value={game.court}
                          onChange={(e) => updateGame(game.id, 'court', e.target.value)}
                        /><br />
                        {issues.length > 0 && (
                          <p style={{ color: 'red', marginTop: 4 }}>
                            ⚠ {issues.join(', ')}
                          </p>
                        )}
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
}
