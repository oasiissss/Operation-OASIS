
import { Graphics } from "pixi.js";

export class InteractiveMap {
  readonly layer = new Graphics();
  private selected:number|null=null;

  hover(id:number){
    // TODO: highlight polygon
    console.log("hover",id);
  }

  select(id:number){
    this.selected=id;
    console.log("selected",id);
  }

  getSelected(){
    return this.selected;
  }
}


export function getTerritoryColor(owner:string){
  switch(owner){
    case "resistance": return 0x3355cc;
    case "germany": return 0x666666;
    case "usa": return 0x4d7d3a;
    case "ussr": return 0x8b1e2d;
    default: return 0x35506b;
  }
}
