import { api } from "@/trpc/server";
import EventsTable from "../_components/events/events-table";
import CreateEventButton from "../_components/events/create-event-button";
import UploadEventsButton from "../_components/events/upload-events";
import PageHeading from "../_components/utils/page-heading";
import GamesTable from "../_components/history/games-table";

export default async function Teams() {
  const games = await api.games.getAll();
  return (
    <>
      <PageHeading
        title="Game History"
        subtitle="Track the past events, see the results of past battles, and see how your team has performed in the past."
      ></PageHeading>
      <div className="flex w-full flex-wrap justify-center gap-4">
        <GamesTable games={games} />
      </div>
    </>
  );
}