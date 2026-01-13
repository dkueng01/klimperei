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
    id: "haenschen",
    title: "Hänschen Klein",
    artist: "Volkslied",
    difficulty: "Easy",
    bpm: 90
  },
  {
    id: "jinglebells",
    title: "Jingle Bells",
    artist: "James Lord Pierpont",
    difficulty: "Medium",
    bpm: 120
  },
  {
    id: "tetris",
    title: "Tetris (Korobeiniki)",
    artist: "Russisches Volkslied",
    difficulty: "Hard",
    bpm: 140
  },
  {
    id: "city-of-stars",
    title: "City of Stars",
    artist: "Ryan Gosling / Emma Stone",
    difficulty: "Easy",
    bpm: 95
  },
  {
    id: "in-the-pool-ushio",
    title: "In the Pool",
    artist: "Ushio",
    difficulty: "Easy",
    bpm: 84
  }
];

export const getSongById = (id: string): Song | null => {
  if (id === "haenschen") return songHaenschen;
  if (id === "jinglebells") return songJingleBells;
  if (id === "tetris") return songTetris;
  if (id === "city-of-stars") return songLaLaLand;
  if (id === "in-the-pool-ushio") return songUshio;

  return null;
};

export const songHaenschen: Song = {
  id: "haenschen",
  title: "Hänschen Klein",
  artist: "Volkslied",
  difficulty: "Easy",
  bpm: 90,
  notes: [
    { note: "G4", duration: "4n", time: 4, display: "G" },
    { note: "E4", duration: "4n", time: 5, display: "E" },
    { note: "E4", duration: "2n", time: 6, display: "E" },

    { note: "F4", duration: "4n", time: 8, display: "F" },
    { note: "D4", duration: "4n", time: 9, display: "D" },
    { note: "D4", duration: "2n", time: 10, display: "D" },

    { note: "C4", duration: "4n", time: 12, display: "C" },
    { note: "D4", duration: "4n", time: 13, display: "D" },
    { note: "E4", duration: "4n", time: 14, display: "E" },
    { note: "F4", duration: "4n", time: 15, display: "F" },

    { note: "G4", duration: "4n", time: 16, display: "G" },
    { note: "G4", duration: "4n", time: 17, display: "G" },
    { note: "G4", duration: "2n", time: 18, display: "G" },

    { note: "G4", duration: "4n", time: 20, display: "G" },
    { note: "E4", duration: "4n", time: 21, display: "E" },
    { note: "E4", duration: "2n", time: 22, display: "E" },

    { note: "F4", duration: "4n", time: 24, display: "F" },
    { note: "D4", duration: "4n", time: 25, display: "D" },
    { note: "D4", duration: "2n", time: 26, display: "D" },

    { note: "C4", duration: "4n", time: 28, display: "C" },
    { note: "E4", duration: "4n", time: 29, display: "E" },
    { note: "G4", duration: "4n", time: 30, display: "G" },
    { note: "G4", duration: "4n", time: 31, display: "G" },

    { note: "C4", duration: "1n", time: 32, display: "C" },
  ]
};

export const songJingleBells: Song = {
  id: "jinglebells",
  title: "Jingle Bells",
  artist: "James Lord Pierpont",
  difficulty: "Medium",
  bpm: 120,
  notes: [
    { note: "E4", duration: "4n", time: 4, display: "E" },
    { note: "E4", duration: "4n", time: 5, display: "E" },
    { note: "E4", duration: "2n", time: 6, display: "E" },

    { note: "E4", duration: "4n", time: 8, display: "E" },
    { note: "E4", duration: "4n", time: 9, display: "E" },
    { note: "E4", duration: "2n", time: 10, display: "E" },

    { note: "E4", duration: "4n", time: 12, display: "E" },
    { note: "G4", duration: "4n", time: 13, display: "G" },
    { note: "C4", duration: "4n", time: 14.5, display: "C" },
    { note: "D4", duration: "8n", time: 15.5, display: "D" },
    { note: "E4", duration: "1n", time: 16, display: "E" },

    { note: "F4", duration: "4n", time: 20, display: "F" },
    { note: "F4", duration: "4n", time: 21, display: "F" },
    { note: "F4", duration: "4n", time: 22, display: "F" },
    { note: "F4", duration: "4n", time: 23, display: "F" },
    { note: "F4", duration: "4n", time: 24, display: "F" },

    { note: "E4", duration: "4n", time: 25, display: "E" },
    { note: "E4", duration: "4n", time: 26, display: "E" },
    { note: "E4", duration: "8n", time: 27, display: "E" },
    { note: "E4", duration: "8n", time: 27.5, display: "E" },

    { note: "E4", duration: "4n", time: 28, display: "E" },
    { note: "D4", duration: "4n", time: 29, display: "D" },
    { note: "D4", duration: "4n", time: 30, display: "D" },
    { note: "E4", duration: "4n", time: 31, display: "E" },
    { note: "D4", duration: "2n", time: 32, display: "D" },
    { note: "G4", duration: "2n", time: 34, display: "G" },
  ]
};

export const songTetris: Song = {
  id: "tetris",
  title: "Tetris (Korobeiniki)",
  artist: "Russisches Volkslied",
  difficulty: "Hard",
  bpm: 140,
  notes: [
    { note: "E4", duration: "4n", time: 4, display: "E" },
    { note: "B4", duration: "8n", time: 5, display: "B" },
    { note: "C5", duration: "8n", time: 5.5, display: "C" },
    { note: "D5", duration: "4n", time: 6, display: "D" },

    { note: "C5", duration: "8n", time: 6, display: "C" },
    { note: "B4", duration: "8n", time: 6.5, display: "B" },
    { note: "A4", duration: "4n", time: 7, display: "A" },

    { note: "A4", duration: "8n", time: 8, display: "A" },
    { note: "C5", duration: "8n", time: 8.5, display: "C" },
    { note: "E4", duration: "4n", time: 9, display: "E" },
    { note: "D4", duration: "8n", time: 10, display: "D" },
    { note: "C4", duration: "8n", time: 10.5, display: "C" },
    { note: "B4", duration: "4n", time: 11, display: "B" },

    { note: "B4", duration: "8n", time: 11.5, display: "B" },
    { note: "C4", duration: "8n", time: 12, display: "C" },
    { note: "D4", duration: "4n", time: 12.5, display: "D" },
    { note: "E4", duration: "4n", time: 13.5, display: "E" },
    { note: "C4", duration: "4n", time: 14.5, display: "C" },
    { note: "A4", duration: "4n", time: 15.5, display: "A" },
    { note: "A4", duration: "4n", time: 16.5, display: "A" },

    { note: "D4", duration: "4n", time: 18, display: "D" },
    { note: "F4", duration: "8n", time: 19, display: "F" },
    { note: "A4", duration: "4n", time: 19.5, display: "A" },
    { note: "G4", duration: "8n", time: 20.5, display: "G" },
    { note: "F4", duration: "8n", time: 21, display: "F" },

    { note: "E4", duration: "4n", time: 21.5, display: "E" },
    { note: "C4", duration: "8n", time: 22.5, display: "C" },
    { note: "E4", duration: "4n", time: 23, display: "E" },
    { note: "D4", duration: "8n", time: 24, display: "D" },
    { note: "C4", duration: "8n", time: 24.5, display: "C" },

    { note: "B4", duration: "4n", time: 25, display: "B" },
    { note: "B4", duration: "8n", time: 26, display: "B" },
    { note: "C4", duration: "8n", time: 26.5, display: "C" },
    { note: "D4", duration: "4n", time: 27, display: "D" },
    { note: "E4", duration: "4n", time: 28, display: "E" },

    { note: "C4", duration: "4n", time: 29, display: "C" },
    { note: "A4", duration: "4n", time: 30, display: "A" },
    { note: "A4", duration: "2n", time: 31, display: "A" },
  ]
};

export const songUshio: Song = {
  id: "ushio",
  title: "In the Pool",
  artist: "Kensuke Ushio (A Silent Voice)",
  difficulty: "Easy",
  bpm: 84,
  notes: [
    { note: "F4", duration: "2n", time: 4, display: "F" },
    { note: "E4", duration: "2n", time: 6, display: "E" },
    { note: "C4", duration: "1n", time: 8, display: "C" },

    { note: "F4", duration: "2n", time: 12, display: "F" },
    { note: "G4", duration: "2n", time: 14, display: "G" },
    { note: "A4", duration: "1n", time: 16, display: "A" },

    { note: "C5", duration: "2n", time: 20, display: "C" },
    { note: "A4", duration: "2n", time: 22, display: "A" },
    { note: "F4", duration: "2n", time: 24, display: "F" },
    { note: "G4", duration: "2n", time: 26, display: "G" },

    { note: "F4", duration: "4n", time: 28, display: "F" },
    { note: "E4", duration: "4n", time: 29, display: "E" },
    { note: "D4", duration: "4n", time: 30, display: "D" },
    { note: "C4", duration: "1n", time: 31, display: "C" },

    { note: "F4", duration: "4n", time: 36, display: "F" },
    { note: "E4", duration: "4n", time: 37, display: "E" },
    { note: "C4", duration: "2n", time: 38, display: "C" },

    { note: "F4", duration: "4n", time: 40, display: "F" },
    { note: "G4", duration: "4n", time: 41, display: "G" },
    { note: "A4", duration: "2n", time: 42, display: "A" },

    { note: "F4", duration: "8n", time: 44, display: "F" },
    { note: "A4", duration: "8n", time: 44.5, display: "A" },
    { note: "C5", duration: "1n", time: 45, display: "C" },

    { note: "G4", duration: "2n", time: 49, display: "G" },
    { note: "F4", duration: "1n", time: 51, display: "F" },
  ]
};

export const songLaLaLand: Song = {
  id: "lalaland",
  title: "City of Stars",
  artist: "Ryan Gosling / Emma Stone",
  difficulty: "Easy",
  bpm: 95,
  notes: [
    { note: "D4", duration: "4n", time: 4, display: "D" },
    { note: "A4", duration: "2n", time: 5, display: "A" },
    { note: "G4", duration: "4n", time: 7, display: "G" },
    { note: "F4", duration: "2n", time: 8, display: "F" },

    { note: "D4", duration: "4n", time: 10, display: "D" },
    { note: "A4", duration: "2n", time: 11, display: "A" },
    { note: "G4", duration: "4n", time: 13, display: "G" },
    { note: "F4", duration: "8n", time: 14, display: "F" },
    { note: "G4", duration: "8n", time: 14.5, display: "G" },
    { note: "F4", duration: "4n", time: 15, display: "F" },
    { note: "E4", duration: "2n", time: 16, display: "E" },

    { note: "D4", duration: "4n", time: 20, display: "D" },
    { note: "A4", duration: "2n", time: 21, display: "A" },
    { note: "G4", duration: "4n", time: 23, display: "G" },
    { note: "F4", duration: "2n", time: 24, display: "F" },

    { note: "D4", duration: "4n", time: 26, display: "D" },
    { note: "A4", duration: "2n", time: 27, display: "A" },
    { note: "G4", duration: "4n", time: 29, display: "G" },
    { note: "F4", duration: "8n", time: 30, display: "F" },
    { note: "G4", duration: "8n", time: 30.5, display: "G" },
    { note: "F4", duration: "4n", time: 31, display: "F" },
    { note: "E4", duration: "2n", time: 32, display: "E" },

    { note: "E4", duration: "4n", time: 34, display: "E" },
    { note: "E4", duration: "4n", time: 35, display: "E" },
    { note: "E4", duration: "4n", time: 36, display: "E" },
    { note: "D4", duration: "4n", time: 37, display: "D" },

    { note: "D4", duration: "4n", time: 38, display: "D" },
    { note: "E4", duration: "4n", time: 39, display: "E" },
    { note: "F4", duration: "4n", time: 40, display: "F" },
    { note: "G4", duration: "4n", time: 41, display: "G" },
    { note: "A4", duration: "2n", time: 42, display: "A" },

    { note: "A4", duration: "4n", time: 44, display: "A" },
    { note: "G4", duration: "4n", time: 45, display: "G" },
    { note: "F4", duration: "4n", time: 46, display: "F" },
    { note: "E4", duration: "2n", time: 47, display: "E" },
    { note: "D4", duration: "1n", time: 49, display: "D" },
  ]
};