import { api } from "@/trpc/server";
import PageHeading from "../_components/page-heading";
import GameConfig from "../_components/game-config";

export default async function Hazards() {
  const hazards = await api.hazards.getAll();
  const locations = await api.locations.getAll();

  return (
    <>
      <PageHeading
        title="Play"
        subtitle="Cutomize your game before the simulation starts"
      ></PageHeading>
      <div className="flex flex-wrap justify-end gap-4">
        <GameConfig locations={locations} hazards={hazards} />
      </div>
    </>
  );
}
