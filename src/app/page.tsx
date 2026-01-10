import { Piano } from "@/components/Piano";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Willkommen bei <span className="text-primary">Klimperei</span>
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Dein Einstieg in die Welt des Klaviers.
        </p>

        <Piano />
      </div>
    </main>
  );
}