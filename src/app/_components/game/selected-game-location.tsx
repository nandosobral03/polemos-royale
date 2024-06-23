import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GameEventLog,
  MapHazardSchematic,
  MapLocationSchematic,
  MapTile,
  Player,
} from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import GameEventCard from "./game-event-card";

export default function SelectedGameLocation({
  isOpen,
  setIsOpen,
  tile,
  playerChanges,
  eventLogs,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tile: MapTile | undefined;
  eventLogs: (GameEventLog & { attackers: Player[]; defenders: Player[] })[];
  playerChanges: Record<
    number,
    {
      health: { prev: number; current: number };
      tileId: { prev: number; current: number };
    }
  >;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {tile && (
        <SheetContent className="min-w-[1/2]">
          <SheetHeader>
            <SheetTitle className="items-between flex gap-2">
              Selected Location
              <span className="text-gray500 ml-auto font-mono font-thin">
                [{tile.q}, {tile.r}, {tile.s}]
              </span>
            </SheetTitle>
            <SheetDescription className="flex max-h-[95vh] flex-col gap-1 overflow-auto p-4">
              {eventLogs.map((el) => (
                <GameEventCard event={el} playerChanges={playerChanges} />
              ))}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
}
