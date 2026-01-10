"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import { KEYMAP } from "@/lib/piano-config";
import { Loader2, Volume2, VolumeX } from "lucide-react";

import { PianoKeyboard } from "./piano/PianoKeyboard";

export function PianoSandbox() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const samplerRef = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: { C4: "C4.mp3", A4: "A4.mp3", C5: "C5.mp3" },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => setIsLoaded(true),
    }).toDestination();
    samplerRef.current = sampler;

    return () => { sampler.dispose(); };
  }, []);

  const startNote = useCallback(async (note: string) => {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    if (samplerRef.current && isLoaded) {
      samplerRef.current.triggerAttack(note);
    }
    setActiveNotes((prev) => new Set(prev).add(note));
  }, [isLoaded]);

  const stopNote = useCallback((note: string) => {
    if (samplerRef.current && isLoaded) {
      samplerRef.current.triggerRelease(note);
    }
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  }, [isLoaded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEYMAP[e.key.toLowerCase()];
      if (note) startNote(note);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEYMAP[e.key.toLowerCase()];
      if (note) stopNote(note);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startNote, stopNote]);

  if (!isLoaded) return <div className="flex gap-2 text-gray-500 mt-10"><Loader2 className="animate-spin" /> Lade Piano...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl gap-6 select-none relative">

      <div className="flex justify-between items-center w-full p-6 bg-white rounded-xl shadow-sm border">
        <div>
          <h2 className="font-bold text-2xl text-gray-800">Freies Spiel</h2>
          <p className="text-gray-500">Spiele was du willst. Keine Regeln, keine Punkte.</p>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full h-[200px] bg-slate-900 rounded-t-xl border-x-8 border-t-8 border-slate-800 shadow-inner flex items-center justify-center text-slate-700">
          <span className="text-4xl font-black opacity-20 rotate-12 select-none">SANDBOX</span>
        </div>

        <div className="relative w-full">
          <PianoKeyboard
            activeNotes={activeNotes}
            onPlayNoteStart={startNote}
            onPlayNoteStop={stopNote}
          />
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-4">
        Tipp: Klicke auf die Tasten oder benutze deine Tastatur (A, S, D...).
      </div>
    </div>
  );
}