import { Container, Graphics, Text } from "pixi.js";

export class Button extends Container {
  private readonly background = new Graphics();
  private readonly caption: Text;
  private hovered = false;

  constructor(
    text: string,
    width: number,
    height: number,
    onPress: () => void
  ) {
    super();
    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = { contains: (x: number, y: number) => x >= 0 && x <= width && y >= 0 && y <= height };

    this.caption = new Text({
      text,
      style: {
        fill: 0xf4e3ad,
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: 2
      }
    });
    this.caption.anchor.set(0.5);
    this.caption.position.set(width / 2, height / 2);

    this.addChild(this.background, this.caption);
    this.draw(width, height);

    this.on("pointerover", () => {
      this.hovered = true;
      this.draw(width, height);
    });
    this.on("pointerout", () => {
      this.hovered = false;
      this.draw(width, height);
    });
    this.on("pointertap", onPress);
  }

  setText(text: string): void {
    this.caption.text = text;
  }

  private draw(width: number, height: number): void {
    this.background
      .clear()
      .roundRect(0, 0, width, height, 10)
      .fill(this.hovered ? 0x3d4b4f : 0x20292d)
      .stroke({ color: this.hovered ? 0xe3c36f : 0x9b7b42, width: 3 });
  }
}
