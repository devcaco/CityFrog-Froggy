class Sprite {
  constructor(game, imgSrc, width, height, clipW, clipH, pointValue) {
    this.game = game;
    this.canvas = this.game.canvas;
    this.ctx = this.canvas.getContext('2d');
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
    this.visible = true;
    this.rotation = 0;
    this.create();
  }

  create() {
    this.img = new Image();
    this.img.src = `./public/images/${this.imgSrc}`;
  }

  render() {
    if (this.img !== null && this.visible) {
      this.ctx.save();
      this.ctx.translate(
        this.posX + this.width / 2,
        this.posY + this.height / 2
      );
      this.ctx.rotate(this.rotation * (Math.PI / 180));
      this.ctx.translate(
        -(this.posX + this.width / 2),
        -(this.posY + this.height / 2)
      );
      this.ctx.drawImage(
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
      this.ctx.restore();
    }
  }

  //animate sprite (cars) across canvas
  move() {
    //lane direction - right
    if (this.speed > 0) {
      // horizontal wrapping check
      if (this.posX <= this.game.canvas.width) this.posX += this.speed;
      else this.posX = this.width * -1;
    } else {
      // lane direction - left
      // horizontal wrapping check
      if (this.posX >= this.width * -1) this.posX += this.speed;
      else this.posX = this.game.canvas.width;
    }
    //check if car collided with froggy
    if (this.checkCollision(_, 40)) this.game.froggy.collided = true;
  }

  checkCollision(obj = this.game.froggy, tolerance = 0) {
    if (
      obj.posX + obj.width > this.posX + tolerance &&
      obj.posX < this.posX - (tolerance + 5) + this.width &&
      obj.posY >= this.posY &&
      obj.posY < this.posY + this.height
    )
      return true;
    return false;
  }
}
