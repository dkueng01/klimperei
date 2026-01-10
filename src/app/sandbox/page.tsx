import { PianoSandbox } from "@/components/PianoSandbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SandboxPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-2">
      <div className="w-full max-w-4xl px-4 mb-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
          </Button>
        </Link>
      </div>

      <PianoSandbox />
    </main>
  );
}