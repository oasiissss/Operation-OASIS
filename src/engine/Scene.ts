import type { Container } from "pixi.js";

export interface Scene {
  readonly view: Container;
  enter(): void | Promise<void>;
  exit(): void | Promise<void>;
  resize(width: number, height: number): void;
  update(deltaSeconds: number): void;
}
