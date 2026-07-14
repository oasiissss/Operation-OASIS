import { Container, Graphics, Text } from "pixi.js";
import type { Faction } from "../gameplay/TerritoryState";
import { territories } from "./NetherlandsMap";

type Point = [number, number];

interface TerritoryShape {
  id: number;
  points: Point[];
  label: Point;
}

const shapes: TerritoryShape[] = [
  { id: 1, points: [[405,95],[455,82],[480,104],[452,124],[410,120]], label:[442,104] },
  { id: 2, points: [[495,84],[545,76],[565,94],[536,110],[500,105]], label:[530,94] },
  { id: 3, points: [[580,76],[635,70],[654,88],[625,103],[585,99]], label:[620,88] },
  { id: 4, points: [[670,72],[725,76],[743,96],[710,110],[675,101]], label:[708,91] },
  { id: 5, points: [[758,84],[805,96],[813,117],[776,121],[748,105]], label:[780,104] },
  { id: 6, points: [[830,108],[872,122],[868,143],[832,139],[814,121]], label:[844,126] },

  { id: 8, points: [[520,135],[625,120],[704,145],[675,215],[570,222],[515,182]], label:[606,171] },
  { id: 9, points: [[704,145],[795,138],[845,180],[800,240],[690,225],[675,215]], label:[760,188] },
  { id:10, points: [[690,225],[800,240],[802,330],[690,348],[650,290]], label:[744,285] },
  { id:14, points: [[650,290],[690,348],[735,420],[650,455],[590,385]], label:[662,383] },
  { id:11, points: [[555,245],[650,290],[590,385],[500,360],[488,285]], label:[555,315] },
  { id: 7, points: [[400,145],[515,135],[515,182],[488,285],[430,345],[360,300],[365,205]], label:[430,230] },
  { id:19, points: [[405,270],[447,258],[470,286],[445,312],[407,301]], label:[439,285] },
  { id:13, points: [[500,360],[590,385],[570,470],[480,475],[450,410]], label:[520,420] },
  { id:12, points: [[360,300],[430,345],[450,410],[390,470],[312,425],[315,345]], label:[380,382] },
  { id:15, points: [[248,438],[312,425],[390,470],[345,530],[270,520],[225,482]], label:[300,478] },
  { id:17, points: [[570,470],[650,455],[725,500],[680,590],[580,600],[535,540]], label:[626,530] },
  { id:20, points: [[592,500],[630,488],[653,516],[628,548],[588,536]], label:[620,518] },
  { id:16, points: [[345,530],[390,470],[480,475],[535,540],[580,600],[505,655],[390,625]], label:[465,555] },
  { id:18, points: [[505,655],[580,600],[680,590],[650,700],[585,790],[535,745]], label:[590,680] }
];

const factionColors: Record<Faction, number> = {
  neutral: 0x4a565c,
  resistance: 0x315d9b,
  germany: 0x5b5b5b,
  usa: 0x55713a,
  ussr: 0x8c2c31
};

export class TerritoryMap extends Container {
  private readonly graphics = new Map<number, Graphics>();
  private owners = new Map<number, Faction>();
  private selectedId: number | null = null;

  constructor(private readonly onTerritoryClick: (id: number) => void) {
    super();

    const water = new Graphics()
      .roundRect(0, 0, 1030, 820, 20)
      .fill(0x132832)
      .stroke({ color: 0x8c7141, width: 3 });

    this.addChild(water);

    for (const territory of territories) {
      const shape = shapes.find((item) => item.id === territory.id);
      if (!shape) continue;

      this.owners.set(territory.id, "neutral");

      const region = new Graphics();
      region.eventMode = "static";
      region.cursor = "pointer";
      region.on("pointertap", () => {
        this.selectedId = territory.id;
        this.onTerritoryClick(territory.id);
        this.redraw();
      });
      region.on("pointerover", () => {
        region.alpha = 0.78;
      });
      region.on("pointerout", () => {
        region.alpha = 1;
      });

      const label = new Text({
        text: String(territory.id),
        style: {
          fill: 0xf8ebc0,
          fontSize: territory.id <= 6 ? 16 : 22,
          fontWeight: "700",
          dropShadow: { color: 0x000000, alpha: 0.75, blur: 3, distance: 2 }
        }
      });
      label.anchor.set(0.5);
      label.position.set(shape.label[0], shape.label[1]);

      this.graphics.set(territory.id, region);
      this.addChild(region, label);
    }

    this.redraw();
  }

  setOwner(id: number, owner: Faction): void {
    this.owners.set(id, owner);
  }

  refresh(): void {
    this.redraw();
  }

  private redraw(): void {
    for (const shape of shapes) {
      const region = this.graphics.get(shape.id);
      if (!region) continue;

      const flatPoints = shape.points.flat();
      const owner = this.owners.get(shape.id) ?? "neutral";
      const selected = this.selectedId === shape.id;

      region
        .clear()
        .poly(flatPoints)
        .fill(factionColors[owner])
        .stroke({
          color: selected ? 0xffe08a : owner === "neutral" ? 0xa88c51 : 0xe0bf65,
          width: selected ? 6 : owner === "neutral" ? 2 : 4
        });
    }
  }
}
