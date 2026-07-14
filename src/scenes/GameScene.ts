import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "../engine/Scene";
import { GameState } from "../gameplay/GameState";
import type { Faction } from "../gameplay/TerritoryState";
import { territories } from "../map/NetherlandsMap";
import { Button } from "../ui/Button";
import type { GameSetup } from "./MenuScene";

const factionColors: Record<Exclude<Faction, "neutral"> | "neutral", number> = {
  neutral: 0x4c5960,
  resistance: 0x315d9b,
  germany: 0x5b5b5b,
  usa: 0x55713a,
  ussr: 0x8c2c31
};

export class GameScene implements Scene {
  readonly view = new Container();
  private readonly state = new GameState();
  private readonly territoryButtons = new Map<number, Graphics>();
  private readonly status: Text;
  private readonly turnText: Text;
  private readonly scoreText: Text;
  private readonly hitText: Text;

  constructor(
    setup: GameSetup,
    private readonly backToMenu: () => void
  ) {
    const names = Array.from({ length: setup.players }, (_, index) => `Speler ${index + 1}`);
    this.state.reset(names, setup.factions, setup.rounds);

    const background = new Graphics().rect(0, 0, 1920, 1080).fill(0x0b1115);
    const mapPanel = new Graphics()
      .roundRect(310, 100, 1280, 760, 24)
      .fill(0x182329)
      .stroke({ color: 0x9d7b40, width: 4 });
    const leftPanel = new Graphics()
      .roundRect(30, 100, 250, 760, 18)
      .fill(0x151b1e)
      .stroke({ color: 0x6f5a36, width: 3 });
    const bottomPanel = new Graphics()
      .roundRect(310, 885, 1280, 160, 18)
      .fill(0x151b1e)
      .stroke({ color: 0x6f5a36, width: 3 });

    const title = new Text({
      text: "OPERATION OASIS — ALPHA",
      style: { fill: 0xe4ca80, fontSize: 38, fontWeight: "700", letterSpacing: 5 }
    });
    title.position.set(40, 25);

    this.turnText = new Text({ text: "", style: { fill: 0xf2dfaa, fontSize: 25 } });
    this.turnText.position.set(55, 135);

    this.scoreText = new Text({
      text: "",
      style: { fill: 0xd5d9d8, fontSize: 21, lineHeight: 42 }
    });
    this.scoreText.position.set(55, 230);

    this.status = new Text({
      text: "Selecteer een worptype en klik op een gebied.",
      style: { fill: 0xe7d59e, fontSize: 24 }
    });
    this.status.position.set(340, 910);

    this.hitText = new Text({
      text: "Worp: SINGLE",
      style: { fill: 0xf2dfaa, fontSize: 24, fontWeight: "700" }
    });
    this.hitText.position.set(340, 980);

    this.view.addChild(background, mapPanel, leftPanel, bottomPanel, title, this.turnText, this.scoreText, this.status, this.hitText);
    this.createTerritories();
    this.createControls();
    this.refresh();
  }

  enter(): void {}
  exit(): void {}
  resize(): void {}
  update(): void {}

  private createTerritories(): void {
    territories.forEach((territory, index) => {
      const column = index % 5;
      const row = Math.floor(index / 5);
      const x = 350 + column * 240;
      const y = 145 + row * 165;

      const card = new Graphics();
      card.eventMode = "static";
      card.cursor = "pointer";
      card.on("pointertap", () => this.performTerritoryHit(territory.id));
      card.on("pointerover", () => card.alpha = 0.78);
      card.on("pointerout", () => card.alpha = 1);

      const number = new Text({
        text: String(territory.id),
        style: { fill: 0xf4e3ad, fontSize: 30, fontWeight: "700" }
      });
      number.anchor.set(0.5);
      number.position.set(x + 92, y + 43);

      const name = new Text({
        text: territory.name,
        style: { fill: 0xe5e8e6, fontSize: 17, wordWrap: true, wordWrapWidth: 180, align: "center" }
      });
      name.anchor.set(0.5);
      name.position.set(x + 92, y + 90);

      card.position.set(x, y);
      this.territoryButtons.set(territory.id, card);
      this.view.addChild(card, number, name);
    });
  }

  private createControls(): void {
    const single = new Button("SINGLE", 150, 66, () => this.selectHit("single"));
    single.position.set(735, 960);
    const double = new Button("DOUBLE", 150, 66, () => this.selectHit("double"));
    double.position.set(900, 960);
    const triple = new Button("TRIPLE", 150, 66, () => this.selectHit("triple"));
    triple.position.set(1065, 960);
    const bull = new Button("BULL", 130, 66, () => this.performSpecial("bull"));
    bull.position.set(1230, 960);
    const miss = new Button("MISS", 130, 66, () => this.performSpecial("miss"));
    miss.position.set(1375, 960);
    const menu = new Button("MENU", 210, 62, this.backToMenu);
    menu.position.set(1650, 20);

    this.view.addChild(single, double, triple, bull, miss, menu);
  }

  private selectHit(hit: "single" | "double" | "triple"): void {
    this.state.selectedHit = hit;
    this.hitText.text = `Worp: ${hit.toUpperCase()}`;
  }

  private performTerritoryHit(id: number): void {
    const result = this.state.hitTerritory(id);
    this.status.text = result.text;
    this.refresh();
  }

  private performSpecial(type: "bull" | "miss"): void {
    const result = type === "bull" ? this.state.bull() : this.state.miss();
    this.status.text = result.text;
    this.refresh();
  }

  private refresh(): void {
    const active = this.state.players.players[this.state.turns.currentPlayer];
    this.turnText.text =
      `Ronde ${this.state.turns.round}` +
      `\nSpeler: ${active?.name ?? "-"}` +
      `\nDarts: ${this.state.turns.dartsLeft}`;

    this.scoreText.text = this.state.players.players
      .map((player) => `${player.name}\n${player.faction.toUpperCase()}  ${player.score}`)
      .join("\n\n");

    for (const territory of this.state.territories) {
      const card = this.territoryButtons.get(territory.territoryId);
      if (!card) continue;
      card.clear()
        .roundRect(0, 0, 184, 125, 14)
        .fill(factionColors[territory.owner])
        .stroke({ color: 0xc6a65b, width: territory.owner === "neutral" ? 2 : 4 });
    }

    if (this.state.turns.finished()) {
      const winner = [...this.state.players.players].sort((a, b) => b.score - a.score)[0];
      this.status.text = `MISSIE AFGEROND — ${winner?.name ?? "Onbekend"} wint`;
    }
  }
}
