export type SongMetadata = {
  id: string;
  title: string;
  artist: string;
  difficulty: "Easy" | "Medium" | "Hard";
  bpm: number;
};

export type NoteEvent = {
  note: string;
  time: number;
  duration: string;
  display: string;
};

export type Song = SongMetadata & {
  notes: NoteEvent[];
};

export const songLibrary: SongMetadata[] = [
  {
    id: "entchen",
    title: "Alle meine Entchen",
    artist: "Volkslied",
    difficulty: "Easy",
    bpm: 100
  },
  {
    id: "ode",
    title: "Ode an die Freude",
    artist: "Beethoven",
    difficulty: "Medium",
    bpm: 110
  }
];

export const getSongById = (id: string): Song | null => {
  if (id === "entchen") return songAlleMeineEntchen;
  if (id === "ode") return songOde;

  return null;
};

export const songAlleMeineEntchen: Song = {
  id: "entchen",
  title: "Alle meine Entchen",
  artist: "Volkslied",
  difficulty: "Easy",
  bpm: 100,
  notes: [
    { note: "C4", duration: "4n", time: 4, display: "C" },
    { note: "D4", duration: "4n", time: 5, display: "D" },
    { note: "E4", duration: "4n", time: 6, display: "E" },
    { note: "F4", duration: "4n", time: 7, display: "F" },
    { note: "G4", duration: "2n", time: 8, display: "G" },
    { note: "G4", duration: "2n", time: 10, display: "G" },
    { note: "A4", duration: "4n", time: 12, display: "A" },
    { note: "A4", duration: "4n", time: 13, display: "A" },
    { note: "A4", duration: "4n", time: 14, display: "A" },
    { note: "A4", duration: "4n", time: 15, display: "A" },
    { note: "G4", duration: "1n", time: 16, display: "G" },
  ],
};

export const songOde: Song = {
  id: "ode",
  title: "Ode an die Freude",
  artist: "Beethoven",
  difficulty: "Medium",
  bpm: 110,
  notes: [
    { note: "E4", duration: "4n", time: 4, display: "E" },
    { note: "E4", duration: "4n", time: 5, display: "E" },
    { note: "F4", duration: "4n", time: 6, display: "F" },
    { note: "G4", duration: "4n", time: 7, display: "G" },
    { note: "G4", duration: "4n", time: 8, display: "G" },
    { note: "F4", duration: "4n", time: 9, display: "F" },
    { note: "E4", duration: "4n", time: 10, display: "E" },
    { note: "D4", duration: "4n", time: 11, display: "D" },
  ]
};