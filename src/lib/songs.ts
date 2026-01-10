export type NoteEvent = {
  note: string;
  duration: string;
  time: number;
  display: string;
};

export type Song = {
  id: string;
  title: string;
  bpm: number;
  notes: NoteEvent[];
};

export const songAlleMeineEntchen: Song = {
  id: "entchen",
  title: "Alle meine Entchen",
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