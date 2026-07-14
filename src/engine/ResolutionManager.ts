import type { Container, Renderer } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/gameConfig";

export class ResolutionManager {
  constructor(
    private readonly renderer: Renderer,
    private readonly stage: Container
  ) {}

  resize(viewWidth: number, viewHeight: number): void {
    this.renderer.resize(viewWidth, viewHeight);

    const scale = Math.min(viewWidth / GAME_WIDTH, viewHeight / GAME_HEIGHT);
    this.stage.scale.set(scale);
    this.stage.position.set(
      Math.round((viewWidth - GAME_WIDTH * scale) / 2),
      Math.round((viewHeight - GAME_HEIGHT * scale) / 2)
    );
  }
}
