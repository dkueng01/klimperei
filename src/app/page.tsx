import { PianoGame } from "@/components/PianoGame";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-white">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
        <PianoGame />
      </div>
    </main>
  );
}