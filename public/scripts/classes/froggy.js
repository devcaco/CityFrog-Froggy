class Froggy extends Sprite {
  constructor(game) {
    super(game, 'froggy-up.png', 50, 50, 504, 466);
    this.posX = (this.canvas.width - this.width) / 2;
    this.posY = this.canvas.height - this.height;
    this.collided = false;
  }

  move(direction) {
    switch (direction) {
      case 'ArrowUp':
        this.img.src = './public/images/froggy-up.png';
        if (this.posY > 0) this.posY -= this.game.settings.gridSize;
        break;
      case 'ArrowDown':
        this.img.src = './public/images/froggy-down.png';
        if (this.posY + this.height < this.canvas.height)
          this.posY += this.game.settings.gridSize;
        break;
      case 'ArrowRight':
        this.img.src = './public/images/froggy-right.png';
        if (this.posX + this.width < this.canvas.width)
          this.posX += this.game.settings.gridSize;
        else {
          if (this.game.settings.horizontalWrap) {
            if (this.posX !== this.canvas.width)
              this.posX += this.game.settings.gridSize;
            else this.posX = 0 - this.game.settings.gridSize * 2;
          }
        }
        break;
      case 'ArrowLeft':
        this.img.src = './public/images/froggy-left.png';
        if (this.posX > 0) this.posX -= this.game.settings.gridSize;
        else {
          if (this.game.settings.horizontalWrap) {
            if (this.posX === 0) this.posX -= this.game.settings.gridSize;
            else this.posX = this.canvas.width + this.game.settings.gridSize;
          }
        }
        break;
      default:
        this.img.src = './public/images/froggy-up.png';
        return;
    }
    this.game.sounds.froggyJump.play();
    this.game.levels[this.game.levelIndex].checkIfOverLeaf();
  }

  reset() {
    this.img.src = './public/images/froggy-up.png';
    this.posX = (this.canvas.width - this.width) / 2;
    this.posY = this.canvas.height - this.height;
  }

  moveSmooth(direction) {
    let i = 0;
    let img = 'up';
    let amount = this.game.settings.gridSize;

    let interval = setInterval(() => {
      switch (direction) {
        case 'ArrowUp':
          img = 'up';
          amount = this.game.settings.gridSize;
          if (this.posY > 0) this.posY -= 1;
          break;
        case 'ArrowDown':
          img = 'down';
          amount = this.game.settings.gridSize;
          if (this.posY + this.height < this.canvas.height) this.posY += 1;
          break;
        case 'ArrowRight':
          img = 'right';
          if (this.posX + this.width < this.canvas.width) {
            amount = this.game.settings.gridSize;
            this.posX += 1;
          } else {
            if (this.game.settings.horizontalWrap) {
              if (
                this.posX !==
                this.canvas.width + this.game.settings.gridSize * 2
              ) {
                amount = this.game.settings.gridSize;
                this.posX += 1;
              } else {
                amount = this.game.settings.gridSize * 2;
                this.posX = 0 - 1;
              }
            }
          }
          break;
        case 'ArrowLeft':
          img = 'left';
          if (this.posX > 0) {
            this.posX -= 1;
            amount = this.game.settings.gridSize;
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
