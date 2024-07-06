"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { api, type RouterOutputs } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import UpdateEventButton from "./update-event-button";
import { generateExampleEventDescription } from "@/lib/utils";

export default function EventsTable({
  events,
}: {
  events: RouterOutputs["events"]["getAll"];
}) {
  const { toast } = useToast();
  const [allEvents, setEvent] =
    useState<RouterOutputs["events"]["getAll"]>(events);

  useEffect(() => {
    setEvent(events);
  }, [events]);

  const deleteEventMutation = api.events.delete.useMutation();
  const handleDeleteEvent = async (id: number) => {
    await deleteEventMutation.mutateAsync({ id });
    toast({
      title: "Event deleted",
      description: "The event has been deleted",
    });
    setEvent((e) => e.filter((event) => event.id !== id));
  };

  const columns: ColumnDef<RouterOutputs["events"]["getAll"][number]>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: (info) => <p>#{info.row.original.id}</p>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => generateExampleEventDescription(info.row.original),
    },
    {
      accessorKey: "numberOfAttackers",
      header: "Attackers",
    },
    {
      accessorKey: "numberOfDefenders",
      header: "Defenders",
    },
    {
      accessorKey: "hpChangeAttackers",
      header: "Attackers HP",
    },
    {
      accessorKey: "hpChangeDefenders",
      header: "Defenders HP",
    },
    {
      accessorKey: "locations",
      header: "Locations",
      cell: (info) => (
        <div className="flex flex-wrap items-center gap-2">
          {info.row.original.locations.map((location) => (
            <span
              className="line-clamp-1 rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700"
              key={location.id}
            >
              {location.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "hazards",
      header: "Hazards",
      cell: (info) => (
        <div className="flex flex-wrap items-center gap-2">
          {info.row.original.hazards.map((hazard) => (
            <span
              className="line-clamp-1 rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700"
              key={hazard.id}
            >
              {hazard.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <UpdateEventButton initialValues={info.row.original} />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteEvent(info.row.original.id)}
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={allEvents} />;
}
