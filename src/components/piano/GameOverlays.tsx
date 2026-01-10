import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export function CountDownOverlay({ count }: { count: number | null }) {
  if (count === null) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
      <div className="text-9xl font-black text-blue-600 animate-pulse">{count}</div>
    </div>
  );
}

interface EndScreenProps {
  score: number;
  onRestart: () => void;
}

export function EndScreen({ score, onRestart }: EndScreenProps) {
  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
      <Trophy className="w-24 h-24 text-yellow-500 mb-6 drop-shadow-lg" />
      <h2 className="text-4xl font-bold mb-2 text-gray-800">Song Beendet!</h2>
      <div className="text-7xl font-black text-gray-900 mb-8">
        {score} <span className="text-2xl text-gray-500 font-normal">Punkte</span>
      </div>
      <div className="flex gap-4">
        <Button onClick={onRestart} size="lg" className="text-lg px-8 py-6">
          Nochmal spielen
        </Button>
      </div>
    </div>
  );
}