import { api } from "@/trpc/server";
import SponsorCard from "../_components/sponsor-card";

export default async function Sponsors() {
  const sponsors = await api.sponsors.getAll();
  return (
    <div className="flex min-h-screen flex-col gap-12 px-4 py-8">
      <div className="flex w-full justify-between">
        <h1 className="grow text-xl font-medium tracking-tight sm:text-[2rem]">
          Sponsors
        </h1>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}
