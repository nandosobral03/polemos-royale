import { MapHazardSchematic, MapLocationSchematic } from "@prisma/client";
import HexGridPage from "./hexgrid";
import { GameLocationConfigType } from "./game-config";
import { useState } from "react";
import SelectedLocation from "./selected-location";
import { areSameHexagons } from "@/lib/utils";

export default function GameLocationConfig({
  gameConfig,
  setGameConfig,
  locations,
  hazards,
}: {
  gameConfig: GameLocationConfigType;
  setGameConfig: (gameConfig: GameLocationConfigType) => void;
  locations: MapLocationSchematic[];
  hazards: MapHazardSchematic[];
}) {
  const [selectedHexagon, setSelectedHexagon] = useState<
    GameLocationConfigType["locations"][number] | undefined
  >(undefined);

  return (
    <div className="flex flex-col items-end gap-4">
      <HexGridPage
        gridElements={gameConfig.locations}
        selectedHexagon={selectedHexagon}
        setSelectedHexagon={setSelectedHexagon}
        locations={locations}
      />
      <SelectedLocation
        gameConfig={gameConfig}
        selectedHexagon={selectedHexagon}
        locations={locations}
        hazards={hazards}
        isOpen={selectedHexagon !== undefined}
        setIsOpen={() => setSelectedHexagon(undefined)}
        onChangeLocation={(locationId) => {
          const location = locations.find((l) => l.id === locationId);
          if (!location || !selectedHexagon) return;
          setGameConfig({
            ...gameConfig,
            locations: gameConfig.locations.map((l) =>
              areSameHexagons(l, selectedHexagon) ? { ...l, location } : l,
            ),
          });
        }}
        onHazardsChange={(hazardIds) => {
          const newHazards = hazards.filter((h) => hazardIds.includes(h.id));
          if (!selectedHexagon) return;
          setGameConfig({
            ...gameConfig,
            locations: gameConfig.locations.map((l) =>
              areSameHexagons(l, selectedHexagon)
                ? { ...l, hazards: newHazards }
                : l,
            ),
          });
        }}
      />
    </div>
  );
}
