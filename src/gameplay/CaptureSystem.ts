import type { Faction, TerritoryState } from "./TerritoryState";

export type HitType = "single" | "double" | "triple";

export interface HitResult {
  points: number;
  captured: boolean;
  message: string;
}

export function applyHit(
  state: TerritoryState,
  attacker: Exclude<Faction, "neutral">,
  hit: HitType
): HitResult {
  const enemyOwned = state.owner !== "neutral" && state.owner !== attacker;

  if (state.owner === attacker) {
    return { points: 0, captured: false, message: "Eigen gebied geraakt" };
  }

  if (hit === "double") {
    state.owner = attacker;
    state.hits = 2;
    return { points: 100, captured: true, message: "Double: gebied veroverd +100" };
  }

  if (hit === "triple") {
    state.owner = attacker;
    state.hits = 2;
    return { points: 150, captured: true, message: "Triple: gebied veroverd +150" };
  }

  if (enemyOwned) {
    return { points: -100, captured: false, message: "Single op vijandelijk gebied -100" };
  }

  state.hits += 1;
  if (state.hits >= 2) {
    state.owner = attacker;
    return { points: 100, captured: true, message: "Tweede Single: gebied veroverd +100" };
  }

  return { points: 0, captured: false, message: "Eerste Single geregistreerd" };
}
