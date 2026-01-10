"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import { Song } from "@/lib/songs";
import { KEYMAP, HIT_WINDOW_SECONDS } from "@/lib/piano-config";
import { Loader2 } from "lucide-react";

import { PianoKeyboard } from "./piano/PianoKeyboard";
import { FallingNotes } from "./piano/FallingNotes";
import { GameHeader } from "./piano/GameHeader";
import { CountDownOverlay, EndScreen } from "./piano/GameOverlays";

interface PianoGameProps {
  initialSong: Song;
}

export function PianoGame({ initialSong }: PianoGameProps) {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [currentSong] = useState<Song>(initialSong);
  const [currentTime, setCurrentTime] = useState(0);
  const [metronomeMuted, setMetronomeMuted] = useState(false);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hitNotes, setHitNotes] = useState<Set<number>>(new Set());
  const [lastHitFeedback, setLastHitFeedback] = useState<{ msg: string; color: string } | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const samplerRef = useRef<Tone.Sampler | null>(null);
  const metronomeRef = useRef<Tone.MembraneSynth | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastMetronomeBeat = useRef<number>(-1);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: { C4: "C4.mp3", A4: "A4.mp3", C5: "C5.mp3" },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => setIsLoaded(true),
    }).toDestination();
    samplerRef.current = sampler;

    const metroSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008, octaves: 2, envelope: { attack: 0.0006, decay: 0.2, sustain: 0 }, volume: -15,
    }).toDestination();
    metronomeRef.current = metroSynth;

    return () => { sampler.dispose(); metroSynth.dispose(); };
  }, []);

  const checkHit = useCallback((notePlayed: string) => {
    if (!isPlaying) return;

    const now = Tone.Transport.seconds;
    const secondsPerBeat = 60 / currentSong.bpm;

    const noteIndex = currentSong.notes.findIndex((n, idx) => {
      if (hitNotes.has(idx)) return false;
      if (n.note !== notePlayed) return false;
      const diff = Math.abs((n.time * secondsPerBeat) - now);
      return diff <= HIT_WINDOW_SECONDS;
    });

    if (noteIndex !== -1) {
      const noteDef = currentSong.notes[noteIndex];
      const diff = Math.abs((noteDef.time * secondsPerBeat) - now);

      let points = 20;
      let msg = "Okay";
      let col = "text-blue-400";

      if (diff < 0.1) { points = 100; msg = "PERFEKT!"; col = "text-yellow-400"; }
      else if (diff < 0.2) { points = 50; msg = "Gut"; col = "text-green-400"; }

      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setHitNotes((prev) => new Set(prev).add(noteIndex));
      setLastHitFeedback({ msg, color: col });
      setTimeout(() => setLastHitFeedback(null), 800);
    } else {
      setCombo(0);
      setLastHitFeedback({ msg: "Miss", color: "text-red-500" });
      setTimeout(() => setLastHitFeedback(null), 500);
    }
  }, [isPlaying, currentSong, hitNotes]);

  const playNote = useCallback((note: string) => {
    if (samplerRef.current && isLoaded) {
      samplerRef.current.triggerAttackRelease(note, "8n");
    }

    setActiveNotes((prev) => new Set(prev).add(note));
    setTimeout(() => {
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 200);

    checkHit(note);
  }, [isLoaded, checkHit]);

  const updateLoop = useCallback(() => {
    if (Tone.Transport.state === "started") {
      const now = Tone.Transport.seconds;
      setCurrentTime(now);

      if (!metronomeMuted && metronomeRef.current) {
        const secondsPerBeat = 60 / currentSong.bpm;
        const currentBeat = Math.floor(now / secondsPerBeat);
        if (currentBeat > lastMetronomeBeat.current) {
          const note = currentBeat % 4 === 0 ? "C4" : "C3";
          metronomeRef.current.triggerAttackRelease(note, "32n");
          lastMetronomeBeat.current = currentBeat;
        }
      }

      const lastNoteTime = (currentSong.notes[currentSong.notes.length - 1].time * (60 / currentSong.bpm));
      if (now > lastNoteTime + 2 && !gameFinished) {
        setIsPlaying(false);
        Tone.Transport.stop();
        setGameFinished(true);
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  }, [currentSong.bpm, metronomeMuted, gameFinished]);

  useEffect(() => {
    if (isPlaying) animationFrameRef.current = requestAnimationFrame(updateLoop);
    else cancelAnimationFrame(animationFrameRef.current);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying, updateLoop]);

  const startSequence = async () => {
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
      return;
    }
    setGameFinished(false);
    setScore(0);
    setCombo(0);
    setHitNotes(new Set());

    let count = 3;
    setCountDown(count);
    const timer = setInterval(() => {
      count--;
      if (count > 0) setCountDown(count);
      else {
        clearInterval(timer);
        setCountDown(null);
        Tone.Transport.bpm.value = currentSong.bpm;
        Tone.Transport.start();
        setIsPlaying(true);
      }
    }, 600);
  };

  const resetGame = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
    setCurrentTime(0);
    setCountDown(null);
    setScore(0);
    setCombo(0);
    setHitNotes(new Set());
    setGameFinished(false);
    lastMetronomeBeat.current = -1;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEYMAP[e.key.toLowerCase()];
      if (note) playNote(note);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playNote]);


  if (!isLoaded) return <div className="flex gap-2 text-gray-500 mt-10"><Loader2 className="animate-spin" /> Lade Piano...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl gap-6 select-none relative">

      {gameFinished && <EndScreen score={score} onRestart={startSequence} />}
      <CountDownOverlay count={countDown} />

      <GameHeader
        title={currentSong.title}
        bpm={currentSong.bpm}
        score={score}
        combo={combo}
        isPlaying={isPlaying}
        gameFinished={gameFinished}
        countDownActive={countDown !== null}
        feedback={lastHitFeedback}
        metronomeMuted={metronomeMuted}
        onTogglePlay={startSequence}
        onReset={resetGame}
        onToggleMetronome={() => setMetronomeMuted(!metronomeMuted)}
      />

      <div className="relative w-full">
        <FallingNotes
          song={currentSong}
          currentTime={currentTime}
          hitNotes={hitNotes}
        />

        <PianoKeyboard
          activeNotes={activeNotes}
          onPlayNote={playNote}
        />
      </div>
    </div>
  );
}