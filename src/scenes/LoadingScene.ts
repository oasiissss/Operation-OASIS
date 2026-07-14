import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "../engine/Scene";

export class LoadingScene implements Scene {
  readonly view = new Container();

  private readonly title = new Text({
    text: "OPERATION OASIS",
    style: {
      fill: 0xe6c879,
      fontFamily: "Georgia, serif",
      fontSize: 82,
      fontWeight: "700",
      letterSpacing: 8
    }
  });

  private readonly status = new Text({
    text: "ENGINE INITIALISEREN",
    style: {
      fill: 0xc4b98f,
      fontFamily: "Arial, sans-serif",
      fontSize: 24,
      letterSpacing: 5
    }
  });

  private readonly barFrame = new Graphics();
  private readonly barFill = new Graphics();
  private progress = 0;

  constructor(private readonly onComplete: () => Promise<void>) {
    this.title.anchor.set(0.5);
    this.status.anchor.set(0.5);
    this.view.addChild(this.title, this.status, this.barFrame, this.barFill);
  }

  enter(): void {
    this.resize(1920, 1080);
  }

  exit(): void {}

  resize(width: number, height: number): void {
    this.title.position.set(width / 2, height / 2 - 100);
    this.status.position.set(width / 2, height / 2 + 20);

    this.barFrame.clear()
      .rect(width / 2 - 320, height / 2 + 85, 640, 22)
      .stroke({ color: 0x7d6a3e, width: 2 });
  }

  update(deltaSeconds: number): void {
    this.progress = Math.min(1, this.progress + deltaSeconds * 0.65);

    this.barFill.clear()
      .rect(640, 625, 640 * this.progress, 22)
      .fill(0xc8a95b);

    if (this.progress >= 1) {
      this.progress = -999;
      void this.onComplete();
    }
  }
}
