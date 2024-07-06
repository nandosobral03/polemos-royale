import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type GameLocationConfigType } from "./game-config";
import { type MapHazardSchematic, type MapLocationSchematic } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export default function SelectedLocation({
  gameConfig,
  selectedHexagon,
  locations,
  hazards,
  isOpen,
  setIsOpen,
  onChangeLocation,
  onHazardsChange,
}: {
  gameConfig: GameLocationConfigType;
  selectedHexagon: { q: number; r: number; s: number } | undefined;
  locations: MapLocationSchematic[];
  hazards: MapHazardSchematic[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onChangeLocation: (locationId: number) => void;
  onHazardsChange: (hazardIds: number[]) => void;
}) {
  const hexSquare = gameConfig.locations.find(
    (l) =>
      l.q === selectedHexagon?.q &&
      l.r === selectedHexagon?.r &&
      l.s === selectedHexagon?.s,
  );

  const handleAddHazard = (id: number) => {
    const selected = hazards.find((h) => h.id === id);
    if (!selected) return;
    onHazardsChange([...hazards.map((h) => h.id), id]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {hexSquare && (
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="items-between flex gap-2">
              Selected Hexagon
              <span className="text-gray500 ml-auto font-mono font-thin">
                [{hexSquare.q}, {hexSquare.r}, {hexSquare.s}]
              </span>
            </SheetTitle>
            <SheetDescription className="flex flex-col gap-1">
              <Separator />
              <label className="text-md block font-medium">Location</label>
              <div className="flex gap-2">
                <Image
                  height={128}
                  width={128}
                  src={hexSquare.location.image}
                  alt={hexSquare.location.name}
                  className="aspect-square h-24 w-auto rounded-md object-cover"
                  style={{
                    background: "#fff",
                    clipPath:
                      "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                    objectFit: "cover",
                  }}
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="name">Name</label>
                  <Select
                    onValueChange={(value) => onChangeLocation(parseInt(value))}
                    value={hexSquare.location.id.toString()}
                  >
                    <SelectTrigger className="mt-4 w-full">
                      {hexSquare.location.name}
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter((l) => l.id !== hexSquare.location.id)
                        .map((location) => (
                          <SelectItem
                            key={location.id}
                            value={location.id.toString()}
                          >
                            {location.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <label htmlFor="name">Hazards</label>
              <div className="flex flex-col gap-1">
                {hexSquare.hazards.map((hazard) => (
                  <div key={hazard.id} className="flex items-center gap-2">
                    <li className="text-sm">{hazard.name}</li>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onHazardsChange(
                          hexSquare.hazards
                            .filter((h) => h.id !== hazard.id)
                            .map((h) => h.id),
                        )
                      }
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                ))}
                {!!hazards.filter((h) => !hexSquare.hazards.includes(h))
                  .length && (
                  <Select
                    onValueChange={(value) => handleAddHazard(parseInt(value))}
                    value="0"
                  >
                    <SelectTrigger className="w-[180px]">
                      Add a hazard
                    </SelectTrigger>
                    <SelectContent>
                      {hazards
                        .filter((h) => !hexSquare.hazards.includes(h))
                        .map((hazard) => (
                          <SelectItem
                            key={hazard.id}
                            value={hazard.id.toString()}
                          >
                            {hazard.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
}
