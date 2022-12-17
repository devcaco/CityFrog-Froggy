class Froggy extends Sprite {
  constructor(canvas) {
    super(canvas, 'froggy-up.png', 50, 50, 504, 466);
    this.posX = (this.canvas.width - this.width) / 2;
    this.posY = this.canvas.height - this.height;
    this.collided = false;
  }

  move(direction) {
    switch (direction) {
      case 'ArrowUp':
        this.img.src = './public/images/froggy-up.png';
        if (this.posY > 0) this.posY -= game.gridSize;
        break;
      case 'ArrowDown':
        this.img.src = './public/images/froggy-down.png';
        if (this.posY + this.height < this.canvas.height)
          this.posY += game.gridSize;
        break;
      case 'ArrowRight':
        this.img.src = './public/images/froggy-right.png';
        if (this.posX + this.width < this.canvas.width)
          this.posX += game.gridSize;
        else {
          if (game.horizontalWrap) {
            if (this.posX !== this.canvas.width) this.posX += game.gridSize;
            else this.posX = 0 - game.gridSize * 2;
          }
        }
        break;
      case 'ArrowLeft':
        this.img.src = './public/images/froggy-left.png';
        if (this.posX > 0) this.posX -= game.gridSize;
        else {
          if (game.horizontalWrap) {
            if (this.posX === 0) this.posX -= game.gridSize;
            else this.posX = this.canvas.width + game.gridSize;
          }
        }
        break;
      default:
        this.img.src = './public/images/froggy-up.png';
        break;
    }
    game.levels[game.levelIndex].checkIfOverLeaf();
  }

  reset() {
    this.img.src = './public/images/froggy-up.png';
    this.posX = (this.canvas.width - this.width) / 2;
    this.posY = this.canvas.height - this.height;
  }

  moveSmooth(direction) {
    let i = 0;
    let img = 'up';
    let amount = game.gridSize;

    let interval = setInterval(() => {
      switch (direction) {
        case 'ArrowUp':
          img = 'up';
          amount = game.gridSize;
          if (this.posY > 0) this.posY -= 1;
          break;
        case 'ArrowDown':
          img = 'down';
          amount = game.gridSize;
          if (this.posY + this.height < this.canvas.height) this.posY += 1;
          break;
        case 'ArrowRight':
          img = 'right';
          if (this.posX + this.width < this.canvas.width) {
            amount = game.gridSize;
            this.posX += 1;
          } else {
            if (game.horizontalWrap) {
              if (this.posX !== this.canvas.width + game.gridSize * 2) {
                amount = game.gridSize;
                this.posX += 1;
              } else {
                amount = game.gridSize * 2;
                this.posX = 0 - 1;
              }
            }
          }
          break;
        case 'ArrowLeft':
          img = 'left';
          if (this.posX > 0) {
            // console.log('moving left', this.posX);
            this.posX -= 1;
            amount = game.gridSize;
          }
          break;
        default:
          clearInterval(interval);
      }
      console.log(this.posY, this.posX);
      this.img.src = `./public/images/froggy-${img}.png`;
      i++;
      if (i >= amount) clearInterval(interval);
    }, 1);
  }
}
