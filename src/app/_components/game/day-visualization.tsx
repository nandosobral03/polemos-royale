"use client";

import { RouterOutputs } from "@/trpc/react";
import GameEventCard from "./game-event-card";
import { useState } from "react";
import GameMapView from "./game-map-view";
import { MapTile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import SelectedGameLocation from "./selected-game-location";

export default function DayVisualization({
  dayInfo,
  prevDay,
  game,
}: {
  dayInfo: RouterOutputs["games"]["getGameDayInfo"];
  prevDay: RouterOutputs["games"]["getGameDayInfo"];
  game: RouterOutputs["games"]["getGame"];
}) {
  const [showMapView, setShowMapView] = useState(false);
  const [selectedHexagon, setSelectedHexagon] = useState<MapTile | undefined>(
    undefined,
  );

  if (!dayInfo || !game) return <div>Not found</div>;
  const playerChanges: Record<
    number,
    {
      health: {
        prev: number;
        current: number;
      };
      tileId: {
        prev: number;
        current: number;
      };
    }
  > = dayInfo.playerStatuses.reduce(
    (acc, ps) => {
      const prev = prevDay?.playerStatuses.find(
        (p) => p.playerId === ps.playerId,
      );
      acc[ps.playerId] = {
        health: {
          prev: prev?.health ?? 100,
          current: ps.health,
        },
        tileId: {
          prev: prev?.tileId ?? 0,
          current: ps.tileId,
        },
      };
      return acc;
    },
    {} as Record<
      number,
      {
        health: { prev: number; current: number };
        tileId: { prev: number; current: number };
      }
    >,
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <Button onClick={() => setShowMapView(!showMapView)}>
        {showMapView ? "Hide map" : "Show map"}
      </Button>
      {showMapView ? (
        <>
          <GameMapView
            gridElements={game.tiles}
            eventLogs={dayInfo.eventLogs}
            selectedHexagon={selectedHexagon}
            setSelectedHexagon={setSelectedHexagon}
          />
          <SelectedGameLocation
            isOpen={selectedHexagon !== undefined}
            setIsOpen={() => setSelectedHexagon(undefined)}
            tile={selectedHexagon}
            eventLogs={dayInfo.eventLogs.filter(
              (el) => el.tileId === selectedHexagon?.id,
            )}
            playerChanges={playerChanges}
          />
        </>
      ) : (
        <>
          {dayInfo.eventLogs.map((el) => (
            <GameEventCard event={el} playerChanges={playerChanges} />
          ))}
        </>
      )}
    </div>
  );
}
