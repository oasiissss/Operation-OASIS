
import {Container,Graphics,Text} from "pixi.js";
import type {Scene} from "../engine/Scene";
export class MapPrototypeScene implements Scene{
 readonly view=new Container();
 constructor(){
   const bg=new Graphics().rect(0,0,1920,1080).fill(0x14202a);
   this.view.addChild(bg);
   for(let i=0;i<20;i++){
      const x=220+(i%5)*220,y=150+Math.floor(i/5)*180;
      const g=new Graphics().roundRect(x,y,140,100,10).fill(0x35506b).stroke({color:0xe2c06d,width:2});
      const t=new Text({text:String(i+1),style:{fill:0xffffff,fontSize:28}});
      t.position.set(x+55,y+35);
      this.view.addChild(g,t);
   }
 }
 enter(){} exit(){} resize(){} update(){}
}

// Volgende build: SVG-kaart met klikbare polygonen.


// v0.6 voorbereiding:
// - SVG renderer
// - Polygon hit detection
// - Hover/highlight systeem
// - Klikbare gebieden


// v0.7
// InteractiveMap geïntegreerd in volgende build.
// Hover, selectie en eigenaarschap volgen in v0.8.
