"use client";
import { Row, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { type RouterOutputs } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function DaysTable({
  days,
  gameId,
}: {
  days: RouterOutputs["games"]["getGameForHistory"]["gameDayLog"];
  gameId: number;
}) {
  const router = useRouter();
  const handleRowClick = (
    row: Row<RouterOutputs["games"]["getGameForHistory"]["gameDayLog"][number]>,
  ) => {
    router.push(`/play/${gameId}/${row.original.day}`);
  };

  const columns: ColumnDef<
    RouterOutputs["games"]["getGameForHistory"]["gameDayLog"][number]
  >[] = [
    {
      accessorKey: "day",
      header: "Day",
      cell: (info) => <p>{info.row.original.day}</p>,
    },
    {
      accessorKey: "events",
      header: "Events",
      cell: (info) => <p>{info.row.original.eventLogs.length}</p>,
    },
    {
      accessorKey: "players",
      header: "Players Alive",
      cell: (info) => <p>{info.row.original.playerStatuses.length}</p>,
    },
  ];

  return (
    <DataTable columns={columns} data={days} onRowClick={handleRowClick} />
  );
}
