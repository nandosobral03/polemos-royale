"use client";
import { type GameEvent } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import UpdateEventButton from "./update-event-button";

export default function EventsTable({ events }: { events: GameEvent[] }) {
  const { toast } = useToast();
  const [allEvents, setEvent] = useState<GameEvent[]>(events);

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

  const generateExampleEventDescription = (event: GameEvent) => {
    let initialDescription = event.description;
    for (let i = 0; i < event.numberOfAttackers; i++) {
      initialDescription = initialDescription.replaceAll(
        `a${i + 1}`,
        `<span class="text-red-500">Attacker #${i + 1}</span>`,
      );
    }
    for (let i = 0; i < event.numberOfDefenders; i++) {
      initialDescription = initialDescription.replaceAll(
        `d${i + 1}`,
        `<span class="text-green-500">Defender #${i + 1}</span>`,
      );
    }
    return (
      <span
        dangerouslySetInnerHTML={{ __html: initialDescription }}
        className="line-clamp-2 max-w-[50vw] text-sm text-gray-200"
      ></span>
    );
  };

  const columns: ColumnDef<GameEvent>[] = [
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
    },
    {
      accessorKey: "hazards",
      header: "Hazards",
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
