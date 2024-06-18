import { api } from "@/trpc/server";
import EventsTable from "../_components/events-table";
import CreateEventButton from "../_components/create-event-button";
import UploadEventsButton from "../_components/upload-events";

export default async function Teams() {
  const events = await api.events.getAll();

  return (
    <div className="flex min-h-screen flex-col gap-12 px-4 py-8">
      <div className="flex w-full justify-between gap-2">
        <h1 className="grow text-xl font-medium tracking-tight sm:text-[2rem]">
          Events
        </h1>
        <CreateEventButton />
        <UploadEventsButton />
      </div>
      <div className="flex w-full flex-wrap justify-center gap-4">
        <EventsTable events={events} />
      </div>
    </div>
  );
}
