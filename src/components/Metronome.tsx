"use client";

import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface MetronomeProps {
  bpm: number;
  isPlaying: boolean;
  onToggleMute: () => void;
  isMuted: boolean;
}

export function Metronome({ bpm, isPlaying, onToggleMute, isMuted }: MetronomeProps) {
  return (
    <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg border">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-500 uppercase">Tempo</span>
        <span className="text-xl font-mono font-bold text-gray-800">{bpm} BPM</span>
      </div>

      <div className={`w-3 h-3 rounded-full transition-colors duration-100 ${isPlaying ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />

      <Button variant="ghost" size="icon" onClick={onToggleMute}>
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}