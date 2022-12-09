class Frog {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.img = null;
    this.imgWidth = 50;
    this.imgHeight = 50;
    this.posX = (this.canvas.width - this.imgWidth) / 2;
    this.posY = this.canvas.height - this.imgHeight;
    this.imageLoaded = false;
  }

  create() {
    this.img = new Image();
    this.img.src = './images/frogger-up.png';
    this.move();
  }

  render() {
    if (this.img !== null) {
      this.ctx.drawImage(
        this.img,
        this.posX,
        this.posY,
        this.imgWidth,
        this.imgHeight
      );
    }
  }

  move(direction) {
    switch (direction) {
      case 'ArrowUp':
        this.img.src = './images/frogger-up.png';
        if (this.posY > 0) this.posY -= game.gridSize;
        break;
      case 'ArrowDown':
        this.img.src = './images/frogger-down.png';
        if (this.posY + this.imgHeight < this.canvas.height)
          this.posY += game.gridSize;
        break;
      case 'ArrowRight':
        this.img.src = './images/frogger-right.png';
        if (this.posX + this.imgWidth < this.canvas.width)
          this.posX += game.gridSize;
        break;
      case 'ArrowLeft':
        this.img.src = './images/frogger-left.png';
        if (this.posX > 0) this.posX -= game.gridSize;
        break;
      default:
        this.img.src = './images/frogger-up.png';
        break;
    }
  }
}
