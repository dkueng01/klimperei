import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Metronome } from "@/components/Metronome";
import { cn } from "@/lib/utils";

interface GameHeaderProps {
  title: string;
  bpm: number;
  score: number;
  combo: number;
  isPlaying: boolean;
  gameFinished: boolean;
  countDownActive: boolean;
  feedback: { msg: string; color: string } | null;
  metronomeMuted: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onToggleMetronome: () => void;
}

export function GameHeader({
  title, bpm, score, combo, isPlaying, gameFinished, countDownActive, feedback,
  metronomeMuted, onTogglePlay, onReset, onToggleMetronome
}: GameHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full p-4 bg-white rounded-xl shadow-sm border z-30 relative">
      <div className="flex items-center gap-4">
        <Button
          onClick={onTogglePlay}
          disabled={countDownActive || gameFinished}
          size="icon"
          className={isPlaying ? "bg-amber-500" : "bg-green-600"}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button variant="outline" size="icon" onClick={onReset} disabled={countDownActive}>
          <RotateCcw />
        </Button>

        <div className="flex flex-col pl-4 border-l">
          <span className="text-xs font-bold text-gray-400 uppercase">Score</span>
          <span className="text-2xl font-mono font-bold leading-none">{score}</span>
        </div>

        {combo > 1 && (
          <div className="flex flex-col animate-pulse">
            <span className="text-xs font-bold text-orange-400 uppercase">Combo</span>
            <span className="text-xl font-black text-orange-500 leading-none">x{combo}</span>
          </div>
        )}
      </div>

      <h2 className="font-bold text-lg hidden md:block text-gray-600">{title}</h2>

      <div className="absolute left-1/2 -translate-x-1/2 top-16 pointer-events-none z-50">
        {feedback && (
          <div className={cn("text-5xl font-black animate-out fade-out slide-out-to-top duration-500 drop-shadow-md", feedback.color)}>
            {feedback.msg}
          </div>
        )}
      </div>

      <Metronome
        bpm={bpm}
        isPlaying={isPlaying}
        isMuted={metronomeMuted}
        onToggleMute={onToggleMetronome}
      />
    </div>
  );
}