
import {Container, Graphics, Text} from "pixi.js";
import type {Scene} from "../engine/Scene";

export class MainMenuScene implements Scene{
  readonly view=new Container();
  constructor(){
    const bg=new Graphics().rect(0,0,1920,1080).fill(0x101418);
    const title=new Text({text:"OPERATION OASIS",style:{fill:0xe6c879,fontSize:90}});
    title.position.set(560,90);
    const players=new Text({text:"Spelers: 2  3  4",style:{fill:0xffffff,fontSize:34}});
    players.position.set(220,300);
    const rounds=new Text({text:"Rondes: 5 10 15 20 25 30 ∞",style:{fill:0xffffff,fontSize:34}});
    rounds.position.set(220,380);
    const start=new Graphics().roundRect(220,520,420,90,12).fill(0x866127);
    const label=new Text({text:"START MISSIE",style:{fill:0xffffff,fontSize:38}});
    label.position.set(295,545);
    this.view.addChild(bg,title,players,rounds,start,label);
  }
  enter(){} exit(){} resize(){} update(){}
}
