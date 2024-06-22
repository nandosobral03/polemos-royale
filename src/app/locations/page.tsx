import { api } from "@/trpc/server";
import PageHeading from "../_components/page-heading";
import LocationCard from "../_components/location-card";

export default async function Locations() {
  const locations = await api.locations.getAll();
  const events = await api.events.getAll();
  return (
    <>
      <PageHeading
        title="Locations"
        subtitle="Locations are one of the factors that determine which event each player will be going through, each locations has a series of events that can happen in it and when a game is created they are arranged
        in a hexagonal grid that the players can move around and fight for their own."
      />
      <div className="flex flex-wrap justify-center gap-4">
        {locations.map((player) => (
          <LocationCard key={player.id} location={player} events={events} />
        ))}
      </div>
    </>
  );
}
