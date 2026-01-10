"use client";

import React, { useEffect, useState } from "react";
import { loadMidiSong } from "@/lib/midi-loader";
import { Song } from "@/lib/songs";
import { PianoGame } from "./PianoGame";
import { Loader2 } from "lucide-react";

interface MidiLoadingWrapperProps {
  midiUrl: string;
  title: string;
  id: string;
}

export function MidiLoadingWrapper({ midiUrl, title, id }: MidiLoadingWrapperProps) {
  const [song, setSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMidiSong(midiUrl, title, id)
      .then((loadedSong) => setSong(loadedSong))
      .catch((err) => {
        console.error(err);
        setError("Konnte MIDI Datei nicht laden.");
      });
  }, [midiUrl, title, id]);

  if (error) {
    return <div className="text-red-500 font-bold mt-10">{error}</div>;
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center gap-4 mt-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p>Analysiere MIDI Datei...</p>
      </div>
    );
  }

  return <PianoGame initialSong={song} />;
}