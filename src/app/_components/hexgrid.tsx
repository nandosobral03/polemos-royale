"use client";
import {
  HexGrid,
  Layout,
  Hexagon,
  Path,
  Hex,
  Pattern,
  Text,
} from "react-hexgrid";
import { GameLocationConfigType } from "./game-config";
import { useEffect, useState } from "react";
import { MapLocationSchematic } from "@prisma/client";

type HexGridProps = {
  gridElements: GameLocationConfigType["locations"];
  locations: MapLocationSchematic[];
  selectedHexagon: GameLocationConfigType["locations"][number] | undefined;
  setSelectedHexagon: (
    selectedHexagon: GameLocationConfigType["locations"][number],
  ) => void;
};

export default function HexGridPage({
  gridElements,
  locations,
  selectedHexagon,
  setSelectedHexagon,
}: HexGridProps) {
  const [isClient, setIsClient] = useState(false);

  // SSR fucks up because of random selection of initial values
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
      <Layout
        size={{ x: 8, y: 8 }}
        flat={true}
        spacing={1.02}
        origin={{ x: 0, y: 0 }}
      >
        <>
          {gridElements.map((position) => (
            <>
              <Hexagon
                key={
                  position.q + position.r + position.s + position.location.id
                }
                q={position.q}
                r={position.r}
                s={position.s}
                width={5}
                height={5}
                fill={`pat-${position.location.id}`}
                style={{ cursor: "pointer" }}
                className={`${
                  selectedHexagon?.q === position.q &&
                  selectedHexagon?.r === position.r &&
                  selectedHexagon?.s === position.s
                    ? "stroke-white stroke-[0.5]"
                    : ""
                } m-1 hover:opacity-80
                `}
                onClick={() => setSelectedHexagon(position)}
              />
            </>
          ))}
          {locations.map((location) => (
            <Pattern id={`pat-${location.id}`} link={location.image} />
          ))}
        </>
      </Layout>
    </HexGrid>
  );
}
