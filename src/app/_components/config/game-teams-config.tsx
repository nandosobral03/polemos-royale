import { type RouterOutputs } from "@/trpc/react";
import TeamsSelectTable from "./team-select-table";
import { type GameLocationConfigType } from "./game-config";

const GameTeamsConfig = ({
  teams,
  gameConfig,
  setGameConfig,
}: {
  teams: RouterOutputs["teams"]["getAll"];
  gameConfig: GameLocationConfigType;
  setGameConfig: (gameConfig: GameLocationConfigType) => void;
}) => (
  <div className="flex w-full  gap-4">
    <TeamsSelectTable
      teams={teams}
      selectedTeams={gameConfig.teams}
      setSelectedTeams={(selectedTeams) =>
        setGameConfig({ ...gameConfig, teams: selectedTeams })
      }
    />
  </div>
);

export default GameTeamsConfig;
