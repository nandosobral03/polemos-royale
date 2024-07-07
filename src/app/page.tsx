import Image from "next/image";

export default async function Home() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-4 py-16 text-white">
      <Image
        src="/favicon.png"
        alt="logo"
        width={640}
        height={640}
        className="h-[30vh] w-auto"
      />

      <h1 className="font-serif text-5xl font-extrabold uppercase tracking-tight text-primary sm:text-[5rem]">
        Polemos Royale
      </h1>
      <p className="font-sans text-2xl text-primary">
        The third
        <sup className="top-[-1em] mr-1 text-xs text-muted-foreground">?</sup>
        iteration of the classic text based battle simulator
      </p>
    </main>
  );
}
