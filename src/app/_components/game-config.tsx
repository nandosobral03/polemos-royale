"use client";

import { RouterOutputs } from "@/trpc/react";
import GameLocationConfig from "./game-location-config";
import { getRandomElement } from "@/lib/utils";
import { useState } from "react";
import { MapLocationSchematic, MapHazardSchematic } from "@prisma/client";

type GameConfigProps = {
  locations: RouterOutputs["locations"]["getAll"];
  hazards: RouterOutputs["hazards"]["getAll"];
};

export type GameLocationConfigType = {
  locations: {
    q: number;
    r: number;
    s: number;
    location: MapLocationSchematic;
    hazards: MapHazardSchematic[];
  }[];
  teams: number[];
};

export default function GameConfig({ locations, hazards }: GameConfigProps) {
  const generateHexPositions = (size: number) => {
    const hexPositions = [];
    for (let q = -size; q <= size; q++) {
      for (
        let r = Math.max(-size, -q - size);
        r <= Math.min(size, -q + size);
        r++
      ) {
        const s = -q - r;
        hexPositions.push({ q, r, s });
      }
    }
    return hexPositions;
  };

  const initialPositions = generateHexPositions(3).map<
    GameLocationConfigType["locations"][number]
  >((position) => ({
    q: position.q,
    r: position.r,
    s: position.s,
    location: JSON.parse(JSON.stringify(getRandomElement(locations))),
    hazards: [],
  }));

  const [gameConfig, setGameConfig] = useState<GameLocationConfigType>({
    locations: initialPositions,
    teams: [],
  });

  return (
    <div className="flex flex h-full w-full gap-4">
      <GameLocationConfig
        gameConfig={gameConfig}
        locations={locations}
        hazards={hazards}
        setGameConfig={setGameConfig}
      />
    </div>
  );
}
