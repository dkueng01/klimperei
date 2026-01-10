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

  const activeHoldsRef = useRef<Map<string, { noteIndex: number; startTime: number }>>(new Map());

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

  const getDurationSeconds = useCallback((duration: string, bpm: number) => {
    const secondsPerBeat = 60 / bpm;
    if (duration.includes("n")) {
      let beats = 1;
      if (duration === "1n") beats = 4;
      else if (duration === "2n") beats = 2;
      else if (duration === "4n") beats = 1;
      else if (duration === "8n") beats = 0.5;
      return beats * secondsPerBeat;
    }
    return parseFloat(duration);
  }, []);

  const checkHit = useCallback((notePlayed: string) => {
    if (!isPlaying) return null;

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
      let msg = "Start OK";
      let col = "text-blue-400";

      if (diff < 0.1) { points = 100; msg = "PERFEKT!"; col = "text-yellow-400"; }
      else if (diff < 0.2) { points = 50; msg = "Gut"; col = "text-green-400"; }

      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setHitNotes((prev) => new Set(prev).add(noteIndex));
      setLastHitFeedback({ msg, color: col });
      setTimeout(() => setLastHitFeedback(null), 800);

      return noteIndex;
    } else {
      setCombo(0);
      setLastHitFeedback({ msg: "Miss", color: "text-red-500" });
      setTimeout(() => setLastHitFeedback(null), 500);
      return null;
    }
  }, [isPlaying, currentSong, hitNotes]);

  const startNote = useCallback((note: string) => {
    if (samplerRef.current && isLoaded) {
      samplerRef.current.triggerAttack(note);
    }
    setActiveNotes((prev) => new Set(prev).add(note));

    const hitIndex = checkHit(note);

    if (hitIndex !== null && isPlaying) {
      activeHoldsRef.current.set(note, {
        noteIndex: hitIndex,
        startTime: Tone.Transport.seconds
      });
    }
  }, [isLoaded, checkHit, isPlaying]);

  const stopNote = useCallback((note: string) => {
    if (samplerRef.current && isLoaded) {
      samplerRef.current.triggerRelease(note);
    }
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });

    const holdInfo = activeHoldsRef.current.get(note);
    if (holdInfo && isPlaying) {
      const releaseTime = Tone.Transport.seconds;
      const heldDuration = releaseTime - holdInfo.startTime;

      const targetNote = currentSong.notes[holdInfo.noteIndex];
      const targetDuration = getDurationSeconds(targetNote.duration, currentSong.bpm);

      const ratio = heldDuration / targetDuration;

      if (targetDuration > 0.4) {
        if (ratio >= 0.8) {
          setScore(s => s + 50);
          setLastHitFeedback({ msg: "Sustain Bonus!", color: "text-purple-400" });
          setTimeout(() => setLastHitFeedback(null), 800);
        } else if (ratio < 0.5) {
          setLastHitFeedback({ msg: "Zu kurz!", color: "text-orange-400" });
          setTimeout(() => setLastHitFeedback(null), 500);
        }
      }
      activeHoldsRef.current.delete(note);
    }

  }, [isLoaded, isPlaying, currentSong, getDurationSeconds]);
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
      if (now > lastNoteTime + 4 && !gameFinished) {
        setIsPlaying(false);
        Tone.Transport.stop();
        setGameFinished(true);
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  }, [currentSong.bpm, metronomeMuted, gameFinished]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateLoop);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }
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
    activeHoldsRef.current.clear();

    Tone.Transport.stop();
    Tone.Transport.seconds = 0;
    setCurrentTime(0);

    let count = 3;
    setCountDown(count);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountDown(count);
      } else {
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
    activeHoldsRef.current.clear();
    lastMetronomeBeat.current = -1;
  };

  const togglePlayPause = async () => {
    if (gameFinished) { startSequence(); return; }
    if (countDown !== null) return;

    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      if (Tone.Transport.seconds > 0) {
        await Tone.start();
        Tone.Transport.start();
        setIsPlaying(true);
      } else {
        startSequence();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();
      if (e.repeat) return;

      switch (e.code) {
        case "Space": togglePlayPause(); return;
        case "KeyR": resetGame(); return;
        case "KeyM": setMetronomeMuted((prev) => !prev); return;
      }

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
  }, [isPlaying, gameFinished, countDown, isLoaded, startNote, stopNote]);

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
          onPlayNoteStart={startNote}
          onPlayNoteStop={stopNote}
        />
      </div>
    </div>
  );
}