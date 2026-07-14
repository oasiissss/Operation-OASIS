import { connectedBonus, operationOasisBonus } from "./BonusSystem";
import { applyHit, type HitType, type HitResult } from "./CaptureSystem";
import { largestCluster } from "./ClusterCalculator";
import { PlayerManager } from "./PlayerManager";
import { createInitialState } from "./TerritoryState";
import type { Faction } from "./TerritoryState";
import { TurnManager } from "./TurnManager";

export interface ActionResult {
  text: string;
  points: number;
  captured: boolean;
  gameOver: boolean;
}

export class GameState {
  territories = createInitialState();
  turns = new TurnManager();
  players = new PlayerManager();
  selectedHit: HitType = "single";
  private previousLargestClusters = new Map<string, number>();

  reset(
    playerNames: string[],
    factions: Array<Exclude<Faction, "neutral">>,
    rounds: number | null
  ): void {
    this.territories = createInitialState();
    this.turns = new TurnManager(playerNames.length, rounds);
    this.players.create(playerNames, factions);
    this.previousLargestClusters.clear();
  }

  hitTerritory(territoryId: number): ActionResult {
    const player = this.players.players[this.turns.currentPlayer];
    const territory = this.territories.find((item) => item.territoryId === territoryId);

    if (!player || !territory) {
      return { text: "Ongeldige actie", points: 0, captured: false, gameOver: false };
    }

    const result: HitResult = applyHit(territory, player.faction, this.selectedHit);
    let points = result.points;
    let text = result.message;

    if (result.captured) {
      const cluster = largestCluster(this.territories, player.faction);
      const previous = this.previousLargestClusters.get(player.faction) ?? 0;

      if (cluster > previous) {
        const bonus = connectedBonus(cluster);
        if (bonus > 0) {
          points += bonus;
          text += ` | Connected ${cluster}: +${bonus}`;
        }
        this.previousLargestClusters.set(player.faction, cluster);
      }
    }

    this.players.addScore(player.id, points);
    this.advanceDart();

    return {
      text,
      points,
      captured: result.captured,
      gameOver: this.turns.finished()
    };
  }

  miss(): ActionResult {
    const player = this.players.players[this.turns.currentPlayer];
    if (!player) return { text: "Ongeldige actie", points: 0, captured: false, gameOver: false };

    this.players.addScore(player.id, -100);
    this.advanceDart();
    return {
      text: "Miss -100",
      points: -100,
      captured: false,
      gameOver: this.turns.finished()
    };
  }

  bull(): ActionResult {
    const player = this.players.players[this.turns.currentPlayer];
    if (!player) return { text: "Ongeldige actie", points: 0, captured: false, gameOver: false };

    player.bullsThisTurn += 1;
    const bonus = operationOasisBonus(player.bullsThisTurn);
    if (bonus > 0) this.players.addScore(player.id, bonus);

    this.advanceDart();
    return {
      text: bonus > 0 ? "OPERATION OASIS +500" : "Bull geregistreerd",
      points: bonus,
      captured: false,
      gameOver: this.turns.finished()
    };
  }

  private advanceDart(): void {
    const endedTurn = this.turns.useDart();
    if (endedTurn) this.players.resetTurnCounters();
  }
}
