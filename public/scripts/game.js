class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = 650;
    this.canvasHeight = 500;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 50;
    this.frog = new Frog(this.canvas);
    this.keyBind();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      e.preventDefault();
      console.log(e);
      this.frog.move(e.code);
    });
  }
}
