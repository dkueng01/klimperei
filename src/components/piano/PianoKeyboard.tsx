import { cn } from "@/lib/utils";
import { KEY_DEFS, KEYMAP, getLeftPosition, TOTAL_WHITE_KEYS } from "@/lib/piano-config";

interface PianoKeyboardProps {
  activeNotes: Set<string>;
  onPlayNote: (note: string) => void;
}

export function PianoKeyboard({ activeNotes, onPlayNote }: PianoKeyboardProps) {
  return (
    <div className="relative w-full h-48 bg-gray-100 rounded-b-xl shadow-2xl overflow-hidden border-x-4 border-b-4 border-gray-300">
      {KEY_DEFS.map((k) => {
        const isActive = activeNotes.has(k.note);
        const leftPercent = getLeftPosition(k.note);
        const widthPercent = 100 / TOTAL_WHITE_KEYS;

        const computerKey = Object.keys(KEYMAP)
          .find((key) => KEYMAP[key] === k.note)
          ?.toUpperCase();

        const noteLabel = k.note.replace(/[0-9]/g, "");

        if (k.type === "white") {
          return (
            <div
              key={k.note}
              onMouseDown={() => onPlayNote(k.note)}
              className={cn(
                "absolute top-0 bottom-0 border-r border-gray-300 bg-white cursor-pointer active:bg-gray-100 rounded-b-md flex flex-col justify-end items-center pb-2 transition-transform select-none group",
                isActive && "bg-yellow-100 scale-y-[0.98] origin-top"
              )}
              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
            >
              <span className={cn(
                "mb-2 text-xl font-extrabold text-gray-800",
                isActive && "text-yellow-600"
              )}>
                {computerKey}
              </span>
            </div>
          );
        } else {
          return (
            <div
              key={k.note}
              onMouseDown={() => onPlayNote(k.note)}
              className={cn(
                "absolute top-0 h-32 bg-black z-10 cursor-pointer rounded-b-md border-x border-b border-gray-700 shadow-lg active:scale-y-[0.95] origin-top flex flex-col justify-end items-center pb-2 select-none",
                isActive && "bg-gray-800"
              )}
              style={{ left: `${leftPercent}%`, width: `${widthPercent * 0.6}%` }}
            >
              <span className="mb-1 text-sm font-bold text-gray-200">
                {computerKey}
              </span>
            </div>
          );
        }
      })}
    </div>
  );
}