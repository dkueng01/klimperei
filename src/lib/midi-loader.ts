import { Midi } from "@tonejs/midi";
import { Song, NoteEvent } from "@/lib/songs";

export async function loadMidiSong(url: string, title: string, id: string): Promise<Song> {
  const midi = await Midi.fromUrl(url);

  const bpm = midi.header.tempos.length > 0 ? Math.round(midi.header.tempos[0].bpm) : 120;

  const START_OFFSET_BEATS = 4;

  const notes: NoteEvent[] = [];

  midi.tracks.forEach((track) => {
    track.notes.forEach((midiNote) => {
      const timeInBeats = midiNote.time * (bpm / 60);

      notes.push({
        note: midiNote.name,
        time: timeInBeats + START_OFFSET_BEATS,
        duration: midiNote.duration.toString(),
        display: midiNote.name.replace(/[0-9]/g, ""),
      });
    });
  });

  notes.sort((a, b) => a.time - b.time);

  return {
    id,
    title,
    artist: "Midi Import",
    difficulty: "Medium",
    bpm,
    notes,
  };
}