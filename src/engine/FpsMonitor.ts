
export class FpsMonitor{
  fps=0;
  private acc=0; private frames=0;
  update(dt:number){
    this.acc+=dt; this.frames++;
    if(this.acc>=1){ this.fps=this.frames; this.frames=0; this.acc=0; }
  }
}
