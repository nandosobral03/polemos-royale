"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

export default function PlayPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const simulateDaysMutation = api.games.simulateDays.useMutation();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      Play page {params.id}
      <Button
        onClick={() =>
          simulateDaysMutation.mutate({ days: 10, gameId: parseInt(params.id) })
        }
      >
        Simulate
      </Button>
    </div>
  );
}
