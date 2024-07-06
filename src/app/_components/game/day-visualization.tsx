"use client";

import { type RouterOutputs } from "@/trpc/react";
import GameEventCard from "./game-event-card";
import { useState } from "react";
import GameMapView from "./game-map-view";
import { type MapTile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import SelectedGameLocation from "./selected-game-location";
import { getPlayerChanges } from "@/lib/utils";

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
  const playerChanges = getPlayerChanges(dayInfo, prevDay);
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
            gameId={game.id}
          />
        </>
      ) : (
        <>
          {dayInfo.eventLogs.map((el) => (
            <GameEventCard
              event={el}
              playerChanges={playerChanges}
              key={el.id}
              gameId={game.id}
            />
          ))}
        </>
      )}
    </div>
  );
}
