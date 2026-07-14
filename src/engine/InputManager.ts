
export class InputManager {
  pointer = {x:0,y:0};
  constructor(target: HTMLElement){
    target.addEventListener("pointermove",e=>{
      this.pointer={x:e.clientX,y:e.clientY};
    });
  }
}
