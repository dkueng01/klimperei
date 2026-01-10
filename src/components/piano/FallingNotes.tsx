import { cn } from "@/lib/utils";
import { Song } from "@/lib/songs";
import { getLeftPosition, TOTAL_WHITE_KEYS, ANIMATION_LOOKAHEAD_SECONDS } from "@/lib/piano-config";

interface FallingNotesProps {
  song: Song;
  currentTime: number;
  hitNotes: Set<number>;
}

export function FallingNotes({ song, currentTime, hitNotes }: FallingNotesProps) {
  const getNoteVerticalPos = (noteTime: number, bpm: number) => {
    const secondsPerBeat = 60 / bpm;
    const noteTimeSeconds = noteTime * secondsPerBeat;
    const timeDifference = noteTimeSeconds - currentTime;

    if (timeDifference < -0.5 || timeDifference > ANIMATION_LOOKAHEAD_SECONDS) return null;

    return (timeDifference / ANIMATION_LOOKAHEAD_SECONDS) * 100;
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-t-xl overflow-hidden border-x-8 border-t-8 border-slate-800 shadow-inner group">
      <div className="absolute bottom-0 w-full h-1 bg-yellow-400/50 z-10 blur-[2px]" />

      {song.notes.map((noteEvent, idx) => {
        if (hitNotes.has(idx)) return null;

        const bottomPos = getNoteVerticalPos(noteEvent.time, song.bpm);
        if (bottomPos === null) return null;

        const leftPos = getLeftPosition(noteEvent.note);
        const widthPercent = 100 / TOTAL_WHITE_KEYS;

        const isBlack = noteEvent.note.includes("#");
        const width = isBlack ? widthPercent * 0.6 : widthPercent * 0.9;
        const offset = isBlack ? (widthPercent - width) / 2 : widthPercent * 0.05;

        return (
          <div
            key={idx}
            className={cn(
              "absolute rounded-md shadow-lg flex items-center justify-center font-bold text-[10px] text-white transition-colors border-white/20 border",
              isBlack ? "bg-purple-500" : "bg-blue-500"
            )}
            style={{
              bottom: `${bottomPos}%`,
              left: `${leftPos + offset}%`,
              width: `${width}%`,
              height: "30px",
            }}
          >
            {noteEvent.display}
          </div>
        );
      })}
    </div>
  );
}