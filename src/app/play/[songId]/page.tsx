import { getSongById } from "@/lib/songs";
import { PianoGame } from "@/components/PianoGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ songId: string }>;
}

export default async function PlayPage({ params }: PageProps) {
  const { songId } = await params;

  console.log("Lade Song ID:", songId);

  const song = getSongById(songId);

  if (!song) {
    console.error("Song nicht gefunden in DB");
    return notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-2">
      <div className="w-full max-w-4xl px-4 mb-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
          </Button>
        </Link>
      </div>

      <PianoGame initialSong={song} />
    </main>
  );
}