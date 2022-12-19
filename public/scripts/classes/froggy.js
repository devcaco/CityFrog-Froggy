class Froggy extends Sprite {
  constructor(game) {
    super(game, 'froggy.png', 50, 50, 504, 466);
    this.posX = (this.canvas.width - this.width) / 2;
    this.posY = this.canvas.height - this.height;
    this.collided = false;
  }

  move(direction) {
    switch (direction) {
      case 'ArrowUp':
        if (this.posY > 0) this.posY -= this.game.settings.gridSize;
        this.rotation = 0;
        break;
      case 'ArrowDown':
        if (this.posY + this.height < this.canvas.height)
          this.posY += this.game.settings.gridSize;
        this.rotation = 180;
        break;
      case 'ArrowRight':
        if (this.posX + this.width < this.canvas.width)
          this.posX += this.game.settings.gridSize;
        else {
          if (this.game.settings.horizontalWrap) {
            if (this.posX !== this.canvas.width)
              this.posX += this.game.settings.gridSize;
            else this.posX = 0 - this.game.settings.gridSize * 2;
          }
        }
        this.rotation = 90;
        break;
      case 'ArrowLeft':
        if (this.posX > 0) this.posX -= this.game.settings.gridSize;
        else {
          if (this.game.settings.horizontalWrap) {
            if (this.posX === 0) this.posX -= this.game.settings.gridSize;
            else this.posX = this.canvas.width + this.game.settings.gridSize;
          }
        }
        this.rotation = -90;
        break;
      default:
        this.rotation = 0;
        return;
    }
    this.game.sounds.froggyJump.play();
    this.game.levels[this.game.levelIndex].checkIfOverLeaf();
  }

  render() {
    super.render(this.angle);
  }

  reset() {
    this.posX = (this.canvas.width - this.width) / 2;
    this.posY = this.canvas.height - this.height;
    this.rotation = 0;
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
