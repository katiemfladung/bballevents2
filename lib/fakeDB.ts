type Player = {
  jersey: string;
  name: string;
  position: string;
  height: string;
  cell: string;
  email: string;
};

type Team = {
  id: string;
  school: string;
  coachEmail: string;
  coachCell: string;
  attendingDates: string;
  level: string;
  timePrefs: string;
  players: Player[];
};

type Game = {
  id: string;
  teamA: string;
  teamB: string;
  time: string;
  court: string;
};

type Event = {
  id: string;
  name: string;
  dates: string;
  courts: number;
  teams: Team[];
  games: Game[];
};

export const fakeDB: {
  events: Record<string, Event>;
} = {
  events: {},
};
