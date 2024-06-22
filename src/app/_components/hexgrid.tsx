"use client";
import {
  HexGrid,
  Layout,
  Hexagon,
  Text,
  Pattern,
  Path,
  Hex,
} from "react-hexgrid";

export default function HexGridPage() {
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

  const positions = generateHexPositions(3);

  return (
    <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
      {/* Grid with manually inserted hexagons */}
      <Layout
        size={{ x: 8, y: 8 }}
        flat={true}
        spacing={1.05}
        origin={{ x: 0, y: 0 }}
      >
        <>
          {positions.map((position) => (
            <Hexagon
              key={position.q + position.r + position.s}
              {...position}
              width={5}
              height={5}
            />
          ))}
        </>
        <Hexagon key={0} q={0} r={0} s={0} />

        <Path start={new Hex(0, 0, 0)} end={new Hex(-2, 0, 1)} />
      </Layout>
    </HexGrid>
  );
}
