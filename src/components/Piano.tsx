"use client";

import React, { useEffect, useState, useCallback } from "react";
import * as Tone from "tone";
import { cn } from "@/lib/utils";

const KEYS = [
  { note: "C4", key: "a", type: "white" },
  { note: "C#4", key: "w", type: "black" },
  { note: "D4", key: "s", type: "white" },
  { note: "D#4", key: "e", type: "black" },
  { note: "E4", key: "d", type: "white" },
  { note: "F4", key: "f", type: "white" },
  { note: "F#4", key: "t", type: "black" },
  { note: "G4", key: "g", type: "white" },
  { note: "G#4", key: "z", type: "black" },
  { note: "A4", key: "h", type: "white" },
  { note: "A#4", key: "u", type: "black" },
  { note: "B4", key: "j", type: "white" },
  { note: "C5", key: "k", type: "white" },
];

export function Piano() {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);
    setIsLoaded(true);

    return () => {
      newSynth.dispose();
    };
  }, []);

  const playNote = useCallback(
    (note: string) => {
      if (!synth) return;
      synth.triggerAttackRelease(note, "8n");
      setActiveNote(note);

      setTimeout(() => setActiveNote(null), 200);
    },
    [synth]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const mappedKey = KEYS.find(
        (k) => k.key.toLowerCase() === event.key.toLowerCase()
      );
      if (mappedKey) {
        playNote(mappedKey.note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playNote]);

  const startAudio = async () => {
    await Tone.start();
    console.log("Audio is ready");
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border shadow-sm"
      onClick={startAudio}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Klimperei v0.1</h2>
      </div>

      <div className="relative flex h-48 select-none">
        {KEYS.map((k) => {
          const isActive = activeNote === k.note;

          if (k.type === "white") {
            return (
              <div
                key={k.note}
                onMouseDown={() => playNote(k.note)}
                className={cn(
                  "relative flex items-end justify-center w-14 h-full border border-gray-300 rounded-b-md bg-white cursor-pointer transition-colors active:scale-[0.98] z-0",
                  isActive && "bg-blue-200"
                )}
              >
                <span className="mb-2 text-xs font-bold text-gray-400">{k.key.toUpperCase()}</span>
              </div>
            );
          } else {
            return (
              <div
                key={k.note}
                onMouseDown={() => playNote(k.note)}
                className={cn(
                  "relative w-10 h-32 -mx-5 border border-black rounded-b-md bg-gray-900 cursor-pointer z-10 active:scale-[0.95] flex items-end justify-center pb-2 shadow-lg",
                  isActive && "bg-gray-700"
                )}
              >
                <span className="text-xs font-bold text-gray-500">{k.key.toUpperCase()}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}