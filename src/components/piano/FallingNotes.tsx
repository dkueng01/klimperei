import { cn } from "@/lib/utils";
import { Song } from "@/lib/songs";
import { getLeftPosition, TOTAL_WHITE_KEYS, ANIMATION_LOOKAHEAD_SECONDS } from "@/lib/piano-config";

interface FallingNotesProps {
  song: Song;
  currentTime: number;
  hitNotes: Set<number>;
}

export function FallingNotes({ song, currentTime, hitNotes }: FallingNotesProps) {

  const getDurationInSeconds = (duration: string, bpm: number) => {
    let durationSeconds = 0;
    const secondsPerBeat = 60 / bpm;
    if (duration.includes("n")) {
      let beats = 1;
      if (duration === "1n") beats = 4;
      else if (duration === "2n") beats = 2;
      else if (duration === "4n") beats = 1;
      else if (duration === "8n") beats = 0.5;
      durationSeconds = beats * secondsPerBeat;
    } else {
      durationSeconds = parseFloat(duration);
    }
    return durationSeconds;
  };

  const getNoteVerticalPos = (noteTime: number, durationSeconds: number, bpm: number) => {
    const secondsPerBeat = 60 / bpm;
    const noteStartTimeSeconds = noteTime * secondsPerBeat;
    const timeToHit = noteStartTimeSeconds - currentTime;

    if ((timeToHit + durationSeconds) < -2.0) return null;
    if (timeToHit > ANIMATION_LOOKAHEAD_SECONDS) return null;

    return (timeToHit / ANIMATION_LOOKAHEAD_SECONDS) * 100;
  };

  const getNoteHeightPercent = (durationSeconds: number) => {
    return (durationSeconds / ANIMATION_LOOKAHEAD_SECONDS) * 100;
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-t-xl overflow-hidden border-x-8 border-t-8 border-slate-800 shadow-inner group">
      <div className="absolute bottom-8 w-full h-1 bg-yellow-400/80 z-10 blur-[1px]" />

      {song.notes.map((noteEvent, idx) => {
        const durationSeconds = getDurationInSeconds(noteEvent.duration, song.bpm);
        const bottomPos = getNoteVerticalPos(noteEvent.time, durationSeconds, song.bpm);

        if (bottomPos === null) return null;

        const heightPercent = getNoteHeightPercent(durationSeconds);
        const leftPos = getLeftPosition(noteEvent.note);
        const widthPercent = 100 / TOTAL_WHITE_KEYS;
        const isBlack = noteEvent.note.includes("#");
        const width = isBlack ? widthPercent * 0.6 : widthPercent * 0.9;
        const offset = isBlack ? (widthPercent - width) / 2 : widthPercent * 0.05;

        const isHit = hitNotes.has(idx);

        const visualBottomPos = bottomPos + 8;

        return (
          <div
            key={idx}
            className={cn(
              "absolute rounded-md shadow-lg flex items-end justify-center pb-2 font-bold text-[10px] text-white border-white/20 border overflow-hidden",
              isBlack ? "bg-purple-500" : "bg-blue-500",
              isHit && "opacity-40 grayscale bg-slate-600 border-none"
            )}
            style={{
              bottom: `${visualBottomPos}%`,
              left: `${leftPos + offset}%`,
              width: `${width}%`,
              height: `${Math.max(heightPercent, 5)}%`,
              zIndex: isHit ? 5 : 20,
            }}
          >
            {heightPercent > 8 && !isHit && (
              <div className="absolute top-0 bottom-6 w-1 bg-white/30 rounded-full" />
            )}
            <span className="z-10 relative mb-1">{!isHit && noteEvent.display}</span>
          </div>
        );
      })}
    </div>
  );
}