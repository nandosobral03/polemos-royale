"use client";
import { Row, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { type RouterOutputs } from "@/trpc/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function GamesTable({
  games,
}: {
  games: RouterOutputs["games"]["getAll"];
}) {
  const router = useRouter();
  const handleRowClick = (
    row: Row<RouterOutputs["games"]["getAll"][number]>,
  ) => {
    router.push(`/games/${row.original.id}`);
  };

  const columns: ColumnDef<RouterOutputs["games"]["getAll"][number]>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: (info) => <p>#{info.row.original.id}</p>,
    },
    {
      accessorKey: "players",
      header: "Player Count",
      cell: (info) => <p>{info.row.original.players.length}</p>,
    },
    {
      accessorKey: "numberOfDays",
      header: "Days",
      cell: (info) => <p>{info.row.original.gameDayLog.length}</p>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => (
        <p>
          {dayjs(info.row.original.createdAt).format("MMMM D, YYYY, h:mm A")}
        </p>
      ),
    },
  ];

  return (
    <DataTable columns={columns} data={games} onRowClick={handleRowClick} />
  );
}
