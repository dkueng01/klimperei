"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import { cn } from "@/lib/utils";
import { songAlleMeineEntchen } from "@/lib/songs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Music2, RefreshCcw } from "lucide-react";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentSong] = useState(songAlleMeineEntchen);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [feedback, setFeedback] = useState<"neutral" | "correct" | "wrong">("neutral");

  const samplerRef = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        setIsLoaded(true);
      },
    }).toDestination();

    samplerRef.current = sampler;

    return () => {
      sampler.dispose();
    };
  }, []);

  const playNote = useCallback(
    (note: string) => {
      if (!samplerRef.current || !isLoaded) return;

      samplerRef.current.triggerAttackRelease(note, "8n");
      setActiveNote(note);
      setTimeout(() => setActiveNote(null), 200);

      if (isPlaying) {
        const targetNote = currentSong.notes[currentNoteIndex];

        if (targetNote && note === targetNote.note) {
          setFeedback("correct");
          setCurrentNoteIndex((prev) => Math.min(prev + 1, currentSong.notes.length));

          setTimeout(() => setFeedback("neutral"), 150);
        } else {
          setFeedback("wrong");
          setTimeout(() => setFeedback("neutral"), 150);
        }
      }
    },
    [isLoaded, isPlaying, currentSong, currentNoteIndex]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || !isLoaded) return;
      const mappedKey = KEYS.find(
        (k) => k.key.toLowerCase() === event.key.toLowerCase()
      );
      if (mappedKey) playNote(mappedKey.note);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playNote, isLoaded]);

  const startAudioContext = async () => {
    await Tone.start();
    console.log("Audio Context Started");
  };

  const resetSong = () => {
    setCurrentNoteIndex(0);
    setFeedback("neutral");
  };

  const progress = (currentNoteIndex / currentSong.notes.length) * 100;
  const isFinished = currentNoteIndex >= currentSong.notes.length;

  if (!isLoaded) {
    return (
      <div className="flex h-64 w-full items-center justify-center gap-2 text-gray-500">
        <Loader2 className="animate-spin" />
        <span>Lade Piano Samples...</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full max-w-3xl gap-8"
      onClick={() => startAudioContext()}
    >

      <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Music2 className="w-5 h-5" />
              {currentSong.title}
            </h3>
            <p className="text-sm text-gray-500">
              {isPlaying
                ? "Drücke die angezeigte Taste auf deiner Tastatur."
                : "Klicke auf 'Lernen Starten'"}
            </p>
          </div>
          <div className="flex gap-2">
            {!isPlaying ? (
              <Button onClick={() => { startAudioContext(); setIsPlaying(true); }}>
                Lernen Starten
              </Button>
            ) : (
              <Button variant="outline" onClick={resetSong} size="icon">
                <RefreshCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        <div className="flex justify-center items-center h-24 mb-2">
          {isFinished ? (
            <div className="text-2xl text-green-600 font-bold animate-bounce">
              🎉 Lied fertig gespielt!
            </div>
          ) : isPlaying ? (
            <div className={cn(
              "text-6xl font-black transition-all duration-200 px-8 py-4 rounded-lg",
              feedback === "neutral" && "text-gray-800 bg-gray-50",
              feedback === "correct" && "text-green-600 bg-green-100 scale-110",
              feedback === "wrong" && "text-red-500 bg-red-100 shake"
            )}>
              {currentSong.notes[currentNoteIndex].display}
            </div>
          ) : (
            <div className="text-gray-300 text-4xl font-bold select-none">?</div>
          )}
        </div>
      </div>

      <div className="relative flex h-52 select-none shadow-2xl rounded-b-xl overflow-hidden">
        {KEYS.map((k) => {
          const isActive = activeNote === k.note;
          const isTarget = isPlaying && !isFinished && currentSong.notes[currentNoteIndex].note === k.note;

          if (k.type === "white") {
            return (
              <div
                key={k.note}
                onMouseDown={() => playNote(k.note)}
                className={cn(
                  "relative flex items-end justify-center w-16 h-full border border-gray-300 bg-white cursor-pointer transition-colors active:scale-[0.99] z-0 hover:bg-gray-50",
                  isActive && "bg-blue-300 !scale-[0.98]",
                  isTarget && !isActive && "bg-yellow-100 animate-pulse"
                )}
              >
                <span className={cn("mb-4 font-bold text-gray-400", isTarget && "text-yellow-600")}>
                  {k.key.toUpperCase()}
                </span>

                <span className="absolute bottom-1 text-[10px] text-gray-300">{k.note}</span>
              </div>
            );
          } else {
            return (
              <div
                key={k.note}
                onMouseDown={() => playNote(k.note)}
                className={cn(
                  "relative w-12 h-32 -mx-6 border border-black bg-gray-900 cursor-pointer z-10 active:scale-[0.95] flex items-end justify-center pb-3 shadow-md rounded-b-md",
                  isActive && "bg-gray-700",
                  isTarget && !isActive && "bg-gray-800 border-yellow-500 border-b-4"
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