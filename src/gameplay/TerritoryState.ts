export type Faction = "neutral" | "resistance" | "germany" | "usa" | "ussr";

export interface TerritoryState {
  territoryId: number;
  owner: Faction;
  hits: number;
}

export const createInitialState = (): TerritoryState[] =>
  Array.from({ length: 20 }, (_, index) => ({
    territoryId: index + 1,
    owner: "neutral",
    hits: 0
  }));
