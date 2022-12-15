class Froggy {
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
    this.img.src = './images/froggy-up.png';
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
        this.img.src = './images/froggy-up.png';
        if (this.posY > 0) this.posY -= game.gridSize;
        break;
      case 'ArrowDown':
        this.img.src = './images/froggy-down.png';
        if (this.posY + this.imgHeight < this.canvas.height)
          this.posY += game.gridSize;
        break;
      case 'ArrowRight':
        this.img.src = './images/froggy-right.png';
        if (this.posX + this.imgWidth < this.canvas.width)
          this.posX += game.gridSize;
        else {
          if (game.horizontalWrap) {
            if (this.posX !== this.canvas.width) this.posX += game.gridSize;
            else this.posX = 0 - game.gridSize * 2;
          }
        }
        break;
      case 'ArrowLeft':
        this.img.src = './images/froggy-left.png';
        if (this.posX > 0) this.posX -= game.gridSize;
        else {
          if (game.horizontalWrap) {
            if (this.posX === 0) this.posX -= game.gridSize;
            else this.posX = this.canvas.width + game.gridSize;
          }
        }
        break;
      default:
        this.img.src = './images/froggy-up.png';
        break;
    }
  }
  checkCollision() {
    let carsArr = []; //get All the cars currently on all lanes
    for (let i = 0; i < game.levels[game.currentLevel - 1].lanes.length; i++) {
      if (!game.levels[game.currentLevel - 1].lanes[i]) continue;
      for (
        let e = 0;
        e < game.levels[game.currentLevel - 1].lanes[i].cars.length;
        e++
      ) {
        carsArr.push(game.levels[game.currentLevel - 1].lanes[i].cars[e]);
      }
    }

    //get cars only on froggy's Lane
    let carRow = carsArr.filter((car) => {
      let temp = this.posY % 100 === 0 ? this.posY - 50 : this.posY;
      return car.posY === temp;
    });

    //check cars on froggy's lane if they collided with froggy
    carRow.forEach((car) => {
      //get car's coordinates range
      let cx1 = car.posX;
      let cx2 = car.posX + car.width;

      //get froggy's coordinates range
      let fx1 = this.posX;
      let fx2 = this.posX + this.imgWidth;

      //check coordinates for collision
      if (fx1 > cx1 && fx2 < cx2 && game.animate) {
        //collision detected!
        game.loseLife('Ouuuch');
      }
    });
  }

  reset() {
    this.img.src = './images/froggy-up.png';
    this.posX = (this.canvas.width - this.imgWidth) / 2;
    this.posY = this.canvas.height - this.imgHeight;
  }
}
