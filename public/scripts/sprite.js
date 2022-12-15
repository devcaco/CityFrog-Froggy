class Sprite {
  constructor(imgSrc, width, height, clipW, clipH, pointValue) {
    this.posX = 0;
    this.posY = 0;
    this.speed = 1;
    this.height = height || 100;
    this.width = width || 150;
    this.img = null;
    this.imgSrc = imgSrc || 'cars.png';
    this.clipX = 0;
    this.clipY = 0;
    this.clipW = clipW || 700;
    this.clipH = clipH || 400;
    this.collected = false;
    this.visible = true;
    this.interval = null;
    this.pointValue = pointValue || 50;
    this.create();
  }

  create() {
    this.img = new Image();
    this.img.src = `./images/${this.imgSrc}`;
  }

  render() {
    if (this.img !== null && this.visible) {
      game.ctx.drawImage(
        this.img,
        this.clipX,
        this.clipY,
        this.clipW,
        this.clipH,
        this.posX,
        this.posY,
        this.width,
        this.height
      );
    }
  }
  move() {
    this.posX = +this.posX.toFixed(2);
    if (this.speed > 0)
      if (this.posX <= game.canvas.width) this.posX += this.speed;
      else this.posX = this.width * -1;
    else {
      if (this.posX >= this.width * -1) this.posX += this.speed;
      else this.posX = game.canvas.width;
    }
  }
}
