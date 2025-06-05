'use client';
import { useParams } from 'next/navigation';
import { fakeDB } from '@/lib/fakeDB';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function EventPage() {
  const { eventId } = useParams();

  if (!eventId || typeof eventId !== 'string') {
    return <p>Loading...</p>;
  }

  const event = fakeDB.events[eventId];

  if (!event) {
    return <p>Event not found.</p>;
  }

  const generatePDF = () => {
    if (!event) return;

    const content: any[] = [
      { text: event.name, style: 'header' },
      { text: `Dates: ${event.dates}`, margin: [0, 0, 0, 20] }
    ];

    event.teams.forEach((team) => {
      content.push({ text: `${team.school}`, style: 'subheader' });
      content.push({ text: `Coach: ${team.coachEmail} / ${team.coachCell}` });
      content.push({ text: `Level: ${team.level} | Prefs: ${team.timePrefs}` });

      const playerTable = [
        ['Jersey', 'Name', 'Position', 'Height', 'Cell', 'Email'],
        ...team.players.map(p => [
          p.jersey, p.name, p.position, p.height, p.cell, p.email
        ])
      ];

      content.push({ text: 'Players:', margin: [0, 10, 0, 4] });
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 'auto', '*', '*'],
          body: playerTable
        }
      });
      content.push({ text: '', margin: [0, 0, 0, 20] });
    });

    const docDef = {
      content,
      styles: {
        header: { fontSize: 22, bold: true },
        subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 4] }
      },
      defaultStyle: { fontSize: 10 }
    };

    pdfMake.createPdf(docDef).download(`${event.name}_Coach_Packet.pdf`);
  };

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

      <br />
      <button onClick={generatePDF}>📄 Generate Coach Packet (PDF)</button>
    </main>
  );
}
