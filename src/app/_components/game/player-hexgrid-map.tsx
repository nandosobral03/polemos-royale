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
import {
  type GameEventLog,
  type MapLocationSchematic,
  type MapTile,
  type Player,
} from "@prisma/client";
import clsx from "clsx";
import TitledCard from "@/components/ui/titled-card";

type GameHexGridProps = {
  gridElements: (MapTile & { location: MapLocationSchematic })[];
  eventLogs: (GameEventLog & { attackers: Player[]; defenders: Player[] })[];
  movements: number[];
};

export default function PlayerHexGridMap({
  gridElements,
  movements,
}: GameHexGridProps) {
  return (
    <TitledCard title="Movements" className="h-[50vh]">
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
                  className={clsx("stroke-white stroke-[0.5]")}
                >
                  {movements.length > 0 && movements[0] === position.id ? (
                    <Text
                      fill="white"
                      fontSize={5}
                      strokeWidth={0.1}
                      fontWeight={100}
                    >
                      ●
                    </Text>
                  ) : null}
                  {movements.length > 1 &&
                  movements[movements.length - 1] === position.id ? (
                    <Text
                      fontSize={5}
                      fill="white"
                      fontWeight={100}
                      strokeWidth={0.2}
                      color="white"
                    >
                      ⨯
                    </Text>
                  ) : null}
                </Hexagon>
                <Pattern
                  id={`pat-${position.location.id}`}
                  link={position.location.image}
                />

                {movements.map((movement, i) => {
                  if (i === movements.length - 1) return null;
                  const position = gridElements.find(
                    (el) => el.id === movement,
                  );
                  const nextPosition = gridElements.find(
                    (el) => el.id === movements[i + 1],
                  );
                  if (!position || !nextPosition) return null;
                  return (
                    <Path
                      key={i}
                      start={new Hex(position.q, position.r, position.s)}
                      end={
                        new Hex(nextPosition.q, nextPosition.r, nextPosition.s)
                      }
                      stroke="white"
                      strokeWidth={0.5}
                      className="stroke-white stroke-[0.5]"
                      fill="none"
                    />
                  );
                })}
              </>
            ))}
          </>
        </Layout>
      </HexGrid>
    </TitledCard>
  );
}
