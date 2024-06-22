import { GameLocationConfigType } from "@/app/_components/game-config";
import { GameEvent } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateExampleEventDescription = (event: GameEvent) => {
  let initialDescription = event.description;
  for (let i = 0; i < event.numberOfAttackers; i++) {
    initialDescription = initialDescription.replaceAll(
      `a${i + 1}`,
      `<span class="text-red-500">Attacker #${i + 1}</span>`,
    );
  }
  for (let i = 0; i < event.numberOfDefenders; i++) {
    initialDescription = initialDescription.replaceAll(
      `d${i + 1}`,
      `<span class="text-green-500">Defender #${i + 1}</span>`,
    );
  }
  return (
    <span
      dangerouslySetInnerHTML={{ __html: initialDescription }}
      className="line-clamp-2 max-w-[50vw] text-sm "
    ></span>
  );
};

export function getRandomElement<T>(array: T[]): T {
  if (array[0]) {
    return array[Math.floor(Math.random() * array.length)] ?? array[0];
  }
  throw new Error("Array is empty");
}

export function areSameHexagons(
  hexagon1: { q: number; r: number; s: number },
  hexagon2: { q: number; r: number; s: number },
) {
  return (
    hexagon1.q === hexagon2.q &&
    hexagon1.r === hexagon2.r &&
    hexagon1.s === hexagon2.s
  );
}
