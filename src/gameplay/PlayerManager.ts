import type { Faction } from "./TerritoryState";

export interface Player {
  id: number;
  name: string;
  faction: Exclude<Faction, "neutral">;
  score: number;
  bullsThisTurn: number;
}

export class PlayerManager {
  players: Player[] = [];

  create(names: string[], factions: Array<Exclude<Faction, "neutral">>): void {
    this.players = names.map((name, index) => ({
      id: index,
      name,
      faction: factions[index],
      score: 0,
      bullsThisTurn: 0
    }));
  }

  addScore(id: number, points: number): void {
    const player = this.players[id];
    if (player) player.score += points;
  }

  resetTurnCounters(): void {
    for (const player of this.players) player.bullsThisTurn = 0;
  }
}
