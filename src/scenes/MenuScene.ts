import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "../engine/Scene";
import type { Faction } from "../gameplay/TerritoryState";
import { Button } from "../ui/Button";

export interface GameSetup {
  players: number;
  rounds: number | null;
  factions: Array<Exclude<Faction, "neutral">>;
}

export class MenuScene implements Scene {
  readonly view = new Container();
  private playerCount = 2;
  private rounds: number | null = 10;
  private readonly playerValue: Text;
  private readonly roundValue: Text;

  constructor(private readonly startGame: (setup: GameSetup) => void) {
    const backdrop = new Graphics().rect(0, 0, 1920, 1080).fill(0x0b1014);
    const panel = new Graphics()
      .roundRect(470, 260, 980, 600, 26)
      .fill(0x171d20)
      .stroke({ color: 0x96743c, width: 5 });

    const title = new Text({
      text: "OPERATION OASIS",
      style: {
        fill: 0xe7cf8a,
        fontFamily: "Georgia, serif",
        fontSize: 86,
        fontWeight: "700",
        letterSpacing: 8
      }
    });
    title.anchor.set(0.5);
    title.position.set(960, 145);

    const makeLabel = (text: string, y: number): Text => {
      const label = new Text({
        text,
        style: { fill: 0xbdb18c, fontSize: 27, letterSpacing: 4 }
      });
      label.position.set(620, y);
      return label;
    };

    this.playerValue = new Text({ text: "2", style: { fill: 0xf4e3ad, fontSize: 44 } });
    this.playerValue.anchor.set(0.5);
    this.playerValue.position.set(960, 395);

    this.roundValue = new Text({ text: "10", style: { fill: 0xf4e3ad, fontSize: 44 } });
    this.roundValue.anchor.set(0.5);
    this.roundValue.position.set(960, 545);

    const playerMinus = new Button("−", 90, 64, () => this.changePlayers(-1));
    playerMinus.position.set(775, 365);
    const playerPlus = new Button("+", 90, 64, () => this.changePlayers(1));
    playerPlus.position.set(1055, 365);

    const roundMinus = new Button("−", 90, 64, () => this.changeRounds(-1));
    roundMinus.position.set(775, 515);
    const roundPlus = new Button("+", 90, 64, () => this.changeRounds(1));
    roundPlus.position.set(1055, 515);

    const start = new Button("START MISSIE", 470, 92, () => {
      const factions: Array<Exclude<Faction, "neutral">> = [
        "resistance", "germany", "usa", "ussr"
      ];
      this.startGame({
        players: this.playerCount,
        rounds: this.rounds,
        factions: factions.slice(0, this.playerCount)
      });
    });
    start.position.set(725, 690);

    this.view.addChild(
      backdrop,
      panel,
      title,
      makeLabel("AANTAL SPELERS", 310),
      makeLabel("AANTAL RONDES", 460),
      this.playerValue,
      this.roundValue,
      playerMinus,
      playerPlus,
      roundMinus,
      roundPlus,
      start
    );
  }

  enter(): void {}
  exit(): void {}
  resize(): void {}
  update(): void {}

  private changePlayers(change: number): void {
    this.playerCount = Math.max(2, Math.min(4, this.playerCount + change));
    this.playerValue.text = String(this.playerCount);
  }

  private changeRounds(change: number): void {
    const options: Array<number | null> = [5, 10, 15, 20, 25, 30, null];
    const currentIndex = options.findIndex((value) => value === this.rounds);
    const next = Math.max(0, Math.min(options.length - 1, currentIndex + change));
    this.rounds = options[next];
    this.roundValue.text = this.rounds === null ? "∞" : String(this.rounds);
  }
}
