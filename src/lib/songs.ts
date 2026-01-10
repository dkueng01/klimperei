export type NoteEvent = {
  note: string;
  duration: string;
  display: string;
};

export type Song = {
  id: string;
  title: string;
  notes: NoteEvent[];
};

export const songAlleMeineEntchen: Song = {
  id: "entchen",
  title: "Alle meine Entchen",
  notes: [
    { note: "C4", duration: "4n", display: "C" },
    { note: "D4", duration: "4n", display: "D" },
    { note: "E4", duration: "4n", display: "E" },
    { note: "F4", duration: "4n", display: "F" },
    { note: "G4", duration: "2n", display: "G" },
    { note: "G4", duration: "2n", display: "G" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "G4", duration: "1n", display: "G" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "A4", duration: "4n", display: "A" },
    { note: "G4", duration: "1n", display: "G" },
    { note: "F4", duration: "4n", display: "F" },
    { note: "F4", duration: "4n", display: "F" },
    { note: "F4", duration: "4n", display: "F" },
    { note: "F4", duration: "4n", display: "F" },
    { note: "E4", duration: "2n", display: "E" },
    { note: "E4", duration: "2n", display: "E" },
    { note: "G4", duration: "4n", display: "G" },
    { note: "G4", duration: "4n", display: "G" },
    { note: "G4", duration: "4n", display: "G" },
    { note: "G4", duration: "4n", display: "G" },
    { note: "C4", duration: "1n", display: "C" },
  ],
};