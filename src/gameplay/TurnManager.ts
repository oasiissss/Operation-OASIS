export class TurnManager {
  currentPlayer = 0;
  round = 1;
  dartsLeft = 3;

  constructor(
    public players = 2,
    public maxRounds: number | null = 10
  ) {}

  useDart(): boolean {
    this.dartsLeft -= 1;
    if (this.dartsLeft > 0) return false;

    this.dartsLeft = 3;
    this.currentPlayer += 1;

    if (this.currentPlayer >= this.players) {
      this.currentPlayer = 0;
      this.round += 1;
    }

    return true;
  }

  finished(): boolean {
    return this.maxRounds !== null && this.round > this.maxRounds;
  }
}
