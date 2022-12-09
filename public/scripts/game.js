class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = 750;
    this.canvasHeight = 600;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 50;
    this.frog = new Frog(this.canvas);
    this.frog.create();
    this.keyBind();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') e.preventDefault();
      this.frog.move(e.code);
    });
  }

  start() {
    window.requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
  renderBackground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'lightblue';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  gameLoop() {
    this.renderBackground();
    this.frog.render();
    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
