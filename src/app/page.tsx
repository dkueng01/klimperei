import Link from "next/link";
import { songLibrary } from "@/lib/songs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Music, Keyboard } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full space-y-8">

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">Klimperei 🎹</h1>
          <p className="text-xl text-gray-500">Wähle einen Song und lerne Klavier spielen.</p>
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/sandbox">
            <Button size="lg" className="text-white shadow-lg scale-105 transition-transform">
              <Keyboard className="mr-2 h-5 w-5" />
              Sandbox starten
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songLibrary.map((song) => (
            <Card key={song.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500 cursor-default">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={song.difficulty === "Easy" ? "secondary" : "default"}>
                    {song.difficulty}
                  </Badge>
                  <span className="text-xs font-mono text-gray-400">{song.bpm} BPM</span>
                </div>
                <CardTitle className="mt-2 text-2xl">{song.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Music className="w-3 h-3" /> {song.artist}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm italic">
                  Preview Graphic
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/play/${song.id}`} className="w-full">
                  <Button className="w-full gap-2" size="lg">
                    <PlayCircle className="w-5 h-5" /> Spielen
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}