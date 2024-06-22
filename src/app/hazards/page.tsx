import { api } from "@/trpc/server";
import PageHeading from "../_components/page-heading";
import HazardCard from "../_components/hazard-card";
import CreateHazardButton from "../_components/create-hazard-button";

export default async function Hazards() {
  const hazards = await api.hazards.getAll();
  const events = await api.events.getAll();
  return (
    <>
      <PageHeading
        title="Hazards"
        subtitle="Hazards are placed on locations and provide extra events for the players to fight for in them. They are linked to a location once the game is created"
      >
        <CreateHazardButton />
      </PageHeading>
      <div className="flex flex-wrap justify-center gap-4">
        {hazards.map((hazard) => (
          <HazardCard key={hazard.id} hazard={hazard} events={events} />
        ))}
      </div>
    </>
  );
}
