"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import { cn } from "@/lib/utils";
import { songAlleMeineEntchen, Song } from "@/lib/songs";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause, RotateCcw } from "lucide-react";
import { Metronome } from "./Metronome";

// --- KONFIGURATION & POSITIONS-LOGIK ---

// Wir definieren die logische Position im Raster (0 = erste weiße Taste, 1 = zweite weiße Taste, etc.)
// Schwarze Tasten sitzen auf ".5" Positionen (zwischen den weißen), teilweise leicht verschoben für Optik.
const KEY_DEFS = [
  { note: "C4", type: "white", pos: 0 },
  { note: "C#4", type: "black", pos: 0.6 }, // Leicht rechts von der Mitte C-D
  { note: "D4", type: "white", pos: 1 },
  { note: "D#4", type: "black", pos: 1.6 }, // Leicht rechts von der Mitte D-E
  { note: "E4", type: "white", pos: 2 },
  { note: "F4", type: "white", pos: 3 },
  { note: "F#4", type: "black", pos: 3.5 }, // Mittig F-G
  { note: "G4", type: "white", pos: 4 },
  { note: "G#4", type: "black", pos: 4.55 }, // Leicht rechts
  { note: "A4", type: "white", pos: 5 },
  { note: "A#4", type: "black", pos: 5.6 }, // Leicht rechts
  { note: "B4", type: "white", pos: 6 },
  { note: "C5", type: "white", pos: 7 }, // Letzte weiße Taste
];

// Mapping für Tastatureingaben
const KEYMAP: Record<string, string> = {
  a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4", f: "F4", t: "F#4",
  g: "G4", z: "G#4", h: "A4", u: "A#4", j: "B4", k: "C5"
};

const TOTAL_WHITE_KEYS = 8; // C4 bis C5 sind 8 weiße Tasten
const ANIMATION_LOOKAHEAD_SECONDS = 2.5; // Etwas mehr Zeit geben

export function Piano() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null); // Für den Timer

  const [currentSong] = useState<Song>(songAlleMeineEntchen);
  const [currentTime, setCurrentTime] = useState(0);
  const [metronomeMuted, setMetronomeMuted] = useState(false);

  const samplerRef = useRef<Tone.Sampler | null>(null);
  const metronomeRef = useRef<Tone.MembraneSynth | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastMetronomeBeat = useRef<number>(-1);

  // --- AUDIO SETUP ---
  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: { C4: "C4.mp3", A4: "A4.mp3", C5: "C5.mp3" },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => setIsLoaded(true),
    }).toDestination();
    samplerRef.current = sampler;

    const metroSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: { attack: 0.0006, decay: 0.2, sustain: 0 },
      volume: -15
    }).toDestination();
    metronomeRef.current = metroSynth;

    return () => {
      sampler.dispose();
      metroSynth.dispose();
    };
  }, []);

  // --- GAME LOOP ---
  const updateLoop = useCallback(() => {
    if (Tone.Transport.state === "started") {
      const now = Tone.Transport.seconds;
      setCurrentTime(now);

      // Metronom
      if (!metronomeMuted && metronomeRef.current) {
        const secondsPerBeat = 60 / currentSong.bpm;
        const currentBeat = Math.floor(now / secondsPerBeat);
        if (currentBeat > lastMetronomeBeat.current) {
          const note = currentBeat % 4 === 0 ? "C4" : "C3";
          metronomeRef.current.triggerAttackRelease(note, "32n");
          lastMetronomeBeat.current = currentBeat;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  }, [currentSong.bpm, metronomeMuted]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateLoop);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying, updateLoop]);

  // --- START LOGIK MIT TIMER ---
  const startSequence = async () => {
    await Tone.start();

    if (isPlaying) {
      // Stoppen
      Tone.Transport.pause();
      setIsPlaying(false);
      return;
    }

    // Starten mit Countdown
    let count = 3;
    setCountDown(count);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountDown(count);
      } else {
        // GO!
        clearInterval(timer);
        setCountDown(null);

        // Musik Start
        Tone.Transport.bpm.value = currentSong.bpm;
        Tone.Transport.start();
        setIsPlaying(true);
      }
    }, 600); // Etwas schneller als Sekunden für besseren Flow
  };

  const resetSong = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
    setCurrentTime(0);
    setCountDown(null);
    lastMetronomeBeat.current = -1;
  };

  const playNoteManual = (note: string) => {
    if (samplerRef.current && isLoaded) {
      samplerRef.current.triggerAttackRelease(note, "8n");
      setActiveNotes((prev) => new Set(prev).add(note));
      setTimeout(() => {
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }, 200);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEYMAP[e.key.toLowerCase()];
      if (note) playNoteManual(note);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoaded]);

  // --- POSITIONSHILFE ---
  // Berechnet die 'left' Position in Prozent basierend auf der Noten-Definition
  const getLeftPosition = (note: string) => {
    const def = KEY_DEFS.find(n => n.note === note);
    if (!def) return 0;

    // Eine weiße Taste ist 1 Einheit breit.
    // Wir haben TOTAL_WHITE_KEYS Einheiten.
    // 100% / TOTAL * position
    const singleKeyWidthPercent = 100 / TOTAL_WHITE_KEYS;
    return def.pos * singleKeyWidthPercent;
  };

  const getNoteVerticalPos = (noteTime: number) => {
    const secondsPerBeat = 60 / currentSong.bpm;
    const noteTimeSeconds = noteTime * secondsPerBeat;
    const timeDifference = noteTimeSeconds - currentTime;

    if (timeDifference < -0.5 || timeDifference > ANIMATION_LOOKAHEAD_SECONDS) return null;

    // 0% = Unten (Treffer), 100% = Oben (Start)
    return (timeDifference / ANIMATION_LOOKAHEAD_SECONDS) * 100;
  };

  if (!isLoaded) return <div className="flex gap-2 text-gray-500 mt-10"><Loader2 className="animate-spin" /> Lade Piano...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl gap-6 select-none">

      {/* HEADER */}
      <div className="flex justify-between items-center w-full p-4 bg-white rounded-xl shadow-sm border z-30 relative">
        <div className="flex items-center gap-4">
          <Button
            onClick={startSequence}
            disabled={countDown !== null}
            size="icon"
            className={isPlaying ? "bg-amber-500" : "bg-green-600"}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <Button variant="outline" size="icon" onClick={resetSong} disabled={countDown !== null}>
            <RotateCcw />
          </Button>
          <div className="text-sm font-mono text-gray-500">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <h2 className="font-bold text-lg hidden sm:block">{currentSong.title}</h2>

        <Metronome
          bpm={currentSong.bpm}
          isPlaying={isPlaying}
          isMuted={metronomeMuted}
          onToggleMute={() => setMetronomeMuted(!metronomeMuted)}
        />
      </div>

      <div className="relative w-full">
        {/* COUNTDOWN OVERLAY */}
        {countDown !== null && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="text-9xl font-black text-blue-600 animate-pulse drop-shadow-lg">
              {countDown}
            </div>
          </div>
        )}

        {/* --- FALLING NOTES AREA --- */}
        <div className="relative w-full h-[350px] bg-slate-900 rounded-t-xl overflow-hidden border-x-8 border-t-8 border-slate-800 shadow-inner">
          <div className="absolute bottom-0 w-full h-1 bg-yellow-400/50 z-10 blur-[2px]" />

          {currentSong.notes.map((noteEvent, idx) => {
            const bottomPos = getNoteVerticalPos(noteEvent.time);
            if (bottomPos === null) return null;

            const isHitWindow = bottomPos < 5 && bottomPos > -2;
            const leftPos = getLeftPosition(noteEvent.note);
            const widthPercent = (100 / TOTAL_WHITE_KEYS); // Breite einer weißen Taste

            // Schwarze Tasten Balken etwas schmaler machen
            const isBlack = noteEvent.note.includes("#");
            const width = isBlack ? widthPercent * 0.6 : widthPercent * 0.9;
            const offset = isBlack ? (widthPercent - width) / 2 : widthPercent * 0.05;

            return (
              <div
                key={idx}
                className={cn(
                  "absolute rounded-md shadow-lg flex items-center justify-center font-bold text-[10px] text-white transition-colors border-white/20 border",
                  isHitWindow ? "bg-yellow-400 text-black scale-110" : isBlack ? "bg-purple-500" : "bg-blue-500"
                )}
                style={{
                  bottom: `${bottomPos}%`,
                  left: `${leftPos + offset}%`,
                  width: `${width}%`,
                  height: "30px"
                }}
              >
                {noteEvent.display}
              </div>
            )
          })}
        </div>

        {/* --- KLAVIATUR (ABSOLUTE POSITIONING) --- */}
        <div className="relative w-full h-48 bg-gray-100 rounded-b-xl shadow-2xl overflow-hidden border-x-4 border-b-4 border-gray-300">
          {KEY_DEFS.map((k) => {
            const isActive = activeNotes.has(k.note);
            const leftPercent = getLeftPosition(k.note);
            const widthPercent = 100 / TOTAL_WHITE_KEYS;

            if (k.type === "white") {
              return (
                <div
                  key={k.note}
                  onMouseDown={() => playNoteManual(k.note)}
                  className={cn(
                    "absolute top-0 bottom-0 border-r border-gray-300 bg-white cursor-pointer active:bg-gray-100 rounded-b-md flex items-end justify-center pb-4 transition-transform",
                    isActive && "bg-yellow-100 scale-y-[0.98] origin-top"
                  )}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                >
                  <span className="font-bold text-gray-300 text-sm">
                    {Object.keys(KEYMAP).find(key => KEYMAP[key] === k.note)?.toUpperCase()}
                  </span>
                </div>
              );
            } else {
              // Schwarze Tasten
              return (
                <div
                  key={k.note}
                  onMouseDown={() => playNoteManual(k.note)}
                  className={cn(
                    "absolute top-0 h-32 bg-black z-10 cursor-pointer rounded-b-md border-x border-b border-gray-700 shadow-lg active:scale-y-[0.95] origin-top flex items-end justify-center pb-2",
                    isActive && "bg-gray-800"
                  )}
                  style={{
                    left: `${leftPercent}%`, // Position aus der Definition
                    width: `${widthPercent * 0.6}%` // Schwarze Tasten sind schmaler (ca. 60% einer weißen)
                  }}
                >
                  <span className="text-[10px] font-bold text-gray-500">
                    {Object.keys(KEYMAP).find(key => KEYMAP[key] === k.note)?.toUpperCase()}
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}