"use client";
import { HexGrid, Layout, Hexagon, Pattern } from "react-hexgrid";
import {
  type GameEventLog,
  type MapLocationSchematic,
  type MapTile,
  type Player,
} from "@prisma/client";
import clsx from "clsx";

type GameHexGridProps = {
  gridElements: (MapTile & { location: MapLocationSchematic })[];
  selectedHexagon: MapTile | undefined;
  setSelectedHexagon: (selectedHexagon: MapTile) => void;
  eventLogs: (GameEventLog & { attackers: Player[]; defenders: Player[] })[];
};

export default function GameMapView({
  gridElements,
  selectedHexagon,
  setSelectedHexagon,
  eventLogs,
}: GameHexGridProps) {
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
                style={{
                  cursor: eventLogs.some((el) => el.tileId === position.id)
                    ? "pointer"
                    : "default",
                }}
                className={clsx(
                  selectedHexagon?.q === position.q &&
                    selectedHexagon?.r === position.r &&
                    selectedHexagon?.s === position.s
                    ? "stroke-white stroke-[0.5]"
                    : "",

                  eventLogs.some((el) => el.tileId === position.id)
                    ? " stroke-primary stroke-[0.5] hover:opacity-80"
                    : "opacity-40",
                )}
                onClick={() =>
                  eventLogs.some((el) => el.tileId === position.id) &&
                  setSelectedHexagon(position)
                }
              />
              <Pattern
                id={`pat-${position.location.id}`}
                link={position.location.image}
              />
            </>
          ))}
        </>
      </Layout>
    </HexGrid>
  );
}
