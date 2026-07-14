import { Application, Container } from "pixi.js";
import { gameConfig, GAME_HEIGHT, GAME_WIDTH } from "../config/gameConfig";
import { GameScene } from "../scenes/GameScene";
import { LoadingScene } from "../scenes/LoadingScene";
import { MenuScene, type GameSetup } from "../scenes/MenuScene";
import { ResolutionManager } from "./ResolutionManager";
import { SceneManager } from "./SceneManager";
import { SettingsStore } from "./SettingsStore";

export class Game {
  private readonly app = new Application();
  private readonly world = new Container();
  private readonly scenes = new SceneManager();
  private readonly settings = new SettingsStore();
  private resolution!: ResolutionManager;

  constructor(private readonly mountPoint: HTMLElement) {}

  async start(): Promise<void> {
    await this.app.init({
      background: gameConfig.background,
      antialias: gameConfig.antialias,
      resolution: gameConfig.resolution,
      autoDensity: true,
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.mountPoint.appendChild(this.app.canvas);
    this.app.stage.addChild(this.world);
    this.world.addChild(this.scenes.root);

    this.resolution = new ResolutionManager(this.app.renderer, this.world);
    this.settings.load();

    const resize = (): void => {
      this.resolution.resize(window.innerWidth, window.innerHeight);
      this.scenes.resize(GAME_WIDTH, GAME_HEIGHT);
    };

    window.addEventListener("resize", resize);
    resize();

    this.app.ticker.add((ticker) => {
      this.scenes.update(ticker.deltaMS / 1000);
    });

    await this.scenes.show(
      new LoadingScene(async () => {
        await this.showMenu();
      })
    );
  }

  private async showMenu(): Promise<void> {
    await this.scenes.show(
      new MenuScene((setup: GameSetup) => {
        void this.showGame(setup);
      })
    );
  }

  private async showGame(setup: GameSetup): Promise<void> {
    await this.scenes.show(
      new GameScene(setup, () => {
        void this.showMenu();
      })
    );
  }
}
