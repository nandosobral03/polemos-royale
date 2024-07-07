import DaysTable from "@/app/_components/history/day-table";
import PageHeading from "@/app/_components/utils/page-heading";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function Play({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const game = await api.games.getGameForHistory({
    gameId: parseInt(params.id),
  });

  return (
    <>
      <PageHeading title={`Game #${params.id}`}>
        <Link href={`/play/${params.id}/${game.gameDayLog.length + 1}`}>
          <Button className="mt-4">View Results</Button>
        </Link>
      </PageHeading>
      <DaysTable days={game.gameDayLog} gameId={parseInt(params.id)} />
    </>
  );
}
