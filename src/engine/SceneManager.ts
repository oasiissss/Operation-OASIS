import { Container } from "pixi.js";
import type { Scene } from "./Scene";

export class SceneManager {
  readonly root = new Container();
  private activeScene: Scene | null = null;
  private width = 1920;
  private height = 1080;

  async show(scene: Scene): Promise<void> {
    if (this.activeScene) {
      await this.activeScene.exit();
      this.root.removeChild(this.activeScene.view);
      this.activeScene.view.destroy({ children: true });
    }

    this.activeScene = scene;
    this.root.addChild(scene.view);
    await scene.enter();
    scene.resize(this.width, this.height);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.activeScene?.resize(width, height);
  }

  update(deltaSeconds: number): void {
    this.activeScene?.update(deltaSeconds);
  }
}
