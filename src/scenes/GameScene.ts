import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "../engine/Scene";
import { GameState } from "../gameplay/GameState";
import { TerritoryMap } from "../map/TerritoryMap";
import { Button } from "../ui/Button";
import type { GameSetup } from "./MenuScene";

export class GameScene implements Scene {
  readonly view = new Container();
  private readonly state = new GameState();
  private readonly territoryMap: TerritoryMap;
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

    const background = new Graphics().rect(0, 0, 1920, 1080).fill(0x090d10);

    const header = new Graphics()
      .rect(0, 0, 1920, 82)
      .fill(0x10171b)
      .stroke({ color: 0x776238, width: 2 });

    const leftPanel = new Graphics()
      .roundRect(30, 110, 300, 770, 18)
      .fill(0x141b1e)
      .stroke({ color: 0x6f5a36, width: 3 });

    const mapFrame = new Graphics()
      .roundRect(355, 110, 1060, 770, 20)
      .fill(0x101a1f)
      .stroke({ color: 0x9d7b40, width: 4 });

    const rightPanel = new Graphics()
      .roundRect(1440, 110, 450, 770, 18)
      .fill(0x141b1e)
      .stroke({ color: 0x6f5a36, width: 3 });

    const bottomPanel = new Graphics()
      .roundRect(355, 905, 1535, 140, 18)
      .fill(0x141b1e)
      .stroke({ color: 0x6f5a36, width: 3 });

    const title = new Text({
      text: "OPERATION OASIS — GAMEPLAY ALPHA",
      style: {
        fill: 0xe4ca80,
        fontFamily: "Georgia, serif",
        fontSize: 34,
        fontWeight: "700",
        letterSpacing: 4
      }
    });
    title.position.set(38, 22);

    this.turnText = new Text({
      text: "",
      style: { fill: 0xf2dfaa, fontSize: 24, lineHeight: 38 }
    });
    this.turnText.position.set(55, 145);

    this.scoreText = new Text({
      text: "",
      style: { fill: 0xd5d9d8, fontSize: 20, lineHeight: 37 }
    });
    this.scoreText.position.set(55, 300);

    const logTitle = new Text({
      text: "MISSIELOG",
      style: { fill: 0xd9bd72, fontSize: 24, fontWeight: "700", letterSpacing: 3 }
    });
    logTitle.position.set(1470, 145);

    this.status = new Text({
      text: "Kies een worptype en selecteer een gebied.",
      style: {
        fill: 0xe7d59e,
        fontSize: 22,
        wordWrap: true,
        wordWrapWidth: 390,
        lineHeight: 34
      }
    });
    this.status.position.set(1470, 205);

    this.hitText = new Text({
      text: "Worp: SINGLE",
      style: { fill: 0xf2dfaa, fontSize: 23, fontWeight: "700" }
    });
    this.hitText.position.set(385, 930);

    this.territoryMap = new TerritoryMap((id) => this.performTerritoryHit(id));
    this.territoryMap.position.set(370, 125);
    this.territoryMap.scale.set(0.98, 0.89);

    this.view.addChild(
      background,
      header,
      leftPanel,
      mapFrame,
      rightPanel,
      bottomPanel,
      title,
      this.turnText,
      this.scoreText,
      logTitle,
      this.status,
      this.hitText,
      this.territoryMap
    );

    this.createControls();
    this.refresh();
  }

  enter(): void {}
  exit(): void {}
  resize(): void {}
  update(): void {}

  private createControls(): void {
    const controls: Array<[string, number, () => void]> = [
      ["SINGLE", 650, () => this.selectHit("single")],
      ["DOUBLE", 815, () => this.selectHit("double")],
      ["TRIPLE", 980, () => this.selectHit("triple")],
      ["BULL", 1145, () => this.performSpecial("bull")],
      ["MISS", 1290, () => this.performSpecial("miss")]
    ];

    for (const [label, x, action] of controls) {
      const button = new Button(label, label === "BULL" || label === "MISS" ? 130 : 150, 66, action);
      button.position.set(x, 950);
      this.view.addChild(button);
    }

    const menu = new Button("MENU", 200, 58, this.backToMenu);
    menu.position.set(1685, 12);
    this.view.addChild(menu);
  }

  private selectHit(hit: "single" | "double" | "triple"): void {
    this.state.selectedHit = hit;
    this.hitText.text = `Worp: ${hit.toUpperCase()}`;
  }

  private performTerritoryHit(id: number): void {
    if (this.state.turns.finished()) return;
    const result = this.state.hitTerritory(id);
    this.status.text = result.text;
    this.refresh();
  }

  private performSpecial(type: "bull" | "miss"): void {
    if (this.state.turns.finished()) return;
    const result = type === "bull" ? this.state.bull() : this.state.miss();
    this.status.text = result.text;
    this.refresh();
  }

  private refresh(): void {
    const active = this.state.players.players[this.state.turns.currentPlayer];

    this.turnText.text =
      `RONDE ${this.state.turns.round}` +
      `\n\n${active?.name ?? "-"}` +
      `\n${active?.faction.toUpperCase() ?? "-"}` +
      `\n\nDARTS: ${this.state.turns.dartsLeft}`;

    this.scoreText.text = this.state.players.players
      .map((player) => `${player.name}\n${player.faction.toUpperCase()}  ${player.score}`)
      .join("\n\n");

    for (const territory of this.state.territories) {
      this.territoryMap.setOwner(territory.territoryId, territory.owner);
    }
    this.territoryMap.refresh();

    if (this.state.turns.finished()) {
      const winner = [...this.state.players.players].sort((a, b) => b.score - a.score)[0];
      this.status.text = `MISSIE AFGEROND\n\n${winner?.name ?? "Onbekend"} wint met ${winner?.score ?? 0} punten.`;
    }
  }
}
