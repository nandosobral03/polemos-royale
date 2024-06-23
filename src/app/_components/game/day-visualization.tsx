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
  > = prevDay
    ? prevDay.playerStatuses.reduce(
        (acc, prev) => {
          const ps = dayInfo.playerStatuses.find(
            (p) => p.playerId === prev.playerId,
          );
          acc[prev.playerId] = {
            health: {
              prev: prev.health,
              current: ps?.health ?? 0,
            },
            tileId: {
              prev: prev.tileId,
              current: ps?.tileId ?? 0,
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
      )
    : dayInfo.playerStatuses.reduce(
        (acc, ps) => {
          acc[ps.playerId] = {
            health: {
              prev: 100,
              current: ps.health,
            },
            tileId: {
              prev: 0,
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
    <div className="flex w-full flex-col items-center gap-4">
      <Button
        onClick={() => setShowMapView(!showMapView)}
        className="w-xl ml-auto"
      >
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
