export const TOTAL_WHITE_KEYS = 8;
export const ANIMATION_LOOKAHEAD_SECONDS = 5.0;

export const HIT_WINDOW_SECONDS = 0.35;

export const KEY_DEFS = [
  { note: "C4", type: "white", pos: 0 },
  { note: "C#4", type: "black", pos: 0.6 },
  { note: "D4", type: "white", pos: 1 },
  { note: "D#4", type: "black", pos: 1.6 },
  { note: "E4", type: "white", pos: 2 },
  { note: "F4", type: "white", pos: 3 },
  { note: "F#4", type: "black", pos: 3.5 },
  { note: "G4", type: "white", pos: 4 },
  { note: "G#4", type: "black", pos: 4.55 },
  { note: "A4", type: "white", pos: 5 },
  { note: "A#4", type: "black", pos: 5.6 },
  { note: "B4", type: "white", pos: 6 },
  { note: "C5", type: "white", pos: 7 },
];

export const KEYMAP: Record<string, string> = {
  a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4", f: "F4", t: "F#4",
  g: "G4", z: "G#4", h: "A4", u: "A#4", j: "B4", k: "C5"
};

export const getLeftPosition = (note: string) => {
  const def = KEY_DEFS.find((n) => n.note === note);
  if (!def) return 0;
  return def.pos * (100 / TOTAL_WHITE_KEYS);
};