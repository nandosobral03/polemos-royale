"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlayPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const router = useRouter();
  const simulateDaysMutation = api.games.simulateDays.useMutation();
  const [loadedDays, setLoadedDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleSimulate = async () => {
    setLoading(true);
    let value = await simulateDaysMutation.mutateAsync({
      gameId: parseInt(params.id),
    });
    while (value) {
      value = await simulateDaysMutation.mutateAsync({
        gameId: parseInt(params.id),
      });
      setLoadedDays((d) => d + 1);
    }
    setLoading(false);
    router.push(`/play/${params.id}/1`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      Play page {params.id}
      <Button onClick={handleSimulate} disabled={loading}>
        {loading ? `Simulating day ${loadedDays}` : "Simulate"}
      </Button>
    </div>
  );
}
