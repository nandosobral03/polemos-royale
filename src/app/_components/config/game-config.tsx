"use client";

import { api, RouterOutputs } from "@/trpc/react";
import GameLocationConfig from "./game-location-config";
import { getRandomElement } from "@/lib/utils";
import { useState } from "react";
import { MapLocationSchematic, MapHazardSchematic } from "@prisma/client";
import GameTeamsConfig from "./game-teams-config";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type GameConfigProps = {
  locations: RouterOutputs["locations"]["getAll"];
  hazards: RouterOutputs["hazards"]["getAll"];
  teams: RouterOutputs["teams"]["getAll"];
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

const TEAM_SELECTION_STEP = 0;
const LOCATION_SELECTION_STEP = 1;

export default function GameConfig({
  locations,
  hazards,
  teams,
}: GameConfigProps) {
  const createGameMutation = api.games.create.useMutation();

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
    teams: teams.map((t) => t.id),
  });

  const handleCreateGame = async () => {
    const { gameId } = await createGameMutation.mutateAsync({
      teams: gameConfig.teams,
      tiles: gameConfig.locations.map((l) => ({
        q: l.q,
        r: l.r,
        s: l.s,
        locationId: l.location.id,
        hazardIds: l.hazards.map((h) => h.id),
      })),
    });
    console.log(gameId);
    toast({
      title: "Game created",
      description: "The game has been created",
    });
  };

  const [currentStep, setCurrentStep] = useState<number>(0);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <div className="flex w-full items-end gap-4">
        <Button
          onClick={() => setCurrentStep(TEAM_SELECTION_STEP)}
          variant={currentStep === TEAM_SELECTION_STEP ? "default" : "outline"}
        >
          Teams
        </Button>
        <Button
          onClick={() => setCurrentStep(LOCATION_SELECTION_STEP)}
          variant={
            currentStep === LOCATION_SELECTION_STEP ? "default" : "outline"
          }
        >
          Map
        </Button>

        <Button onClick={handleCreateGame} className="ml-auto">
          Run simulation
        </Button>
      </div>
      {currentStep === TEAM_SELECTION_STEP && (
        <GameTeamsConfig
          gameConfig={gameConfig}
          setGameConfig={setGameConfig}
          teams={teams}
        />
      )}
      {currentStep === LOCATION_SELECTION_STEP && (
        <GameLocationConfig
          gameConfig={gameConfig}
          setGameConfig={setGameConfig}
          locations={locations}
          hazards={hazards}
        />
      )}
    </div>
  );
}