import { api } from "@/trpc/server";
import EventsTable from "../_components/events/events-table";
import CreateEventButton from "../_components/events/create-event-button";
import UploadEventsButton from "../_components/events/upload-events";
import PageHeading from "../_components/utils/page-heading";

export default async function Teams() {
  const events = await api.events.getAll();
  return (
    <>
      <PageHeading
        title="Events"
        subtitle="Events are the battle royale's most important part, players reenact these events depending on their location on the map and the number of players in the game. Each event has an attacking and defending party of players, and a number of health points that are used to determine the outcome of the event."
      >
        <CreateEventButton />
        <UploadEventsButton />
      </PageHeading>
      <div className="flex w-full flex-wrap justify-center gap-4">
        <EventsTable events={events} />
      </div>
    </>
  );
}
