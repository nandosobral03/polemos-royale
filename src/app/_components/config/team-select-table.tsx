"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { type RouterOutputs } from "@/trpc/react";
import { Checkbox } from "@/components/ui/checkbox";

export default function TeamsSelectTable({
  teams,
  selectedTeams,
  setSelectedTeams,
}: {
  teams: RouterOutputs["teams"]["getAll"];
  selectedTeams: number[];
  setSelectedTeams: (selectedTeams: number[]) => void;
}) {
  const columns: ColumnDef<RouterOutputs["teams"]["getAll"][number]>[] = [
    {
      accessorKey: "selected",
      header: "Selected",
      cell: (info) => (
        <Checkbox
          checked={selectedTeams.includes(info.row.original.id)}
          onCheckedChange={(e) =>
            setSelectedTeams(
              !!e
                ? [...selectedTeams, info.row.original.id]
                : selectedTeams.filter((e) => e !== info.row.original.id),
            )
          }
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "sponsor",
      header: "Sponsored by",
      cell: (info) => (
        <div className="flex flex-wrap items-center gap-2">
          {info.row.original.sponsor?.name}
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={teams} />;
}
