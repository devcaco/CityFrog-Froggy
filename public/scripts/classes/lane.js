class Lane {
  constructor(game, speed, direction = 'right', maxItems = 5) {
    this.game = game;
    this.speed = speed || 1;
    this.maxItems = maxItems;
    this.direction = direction;
    this.cars = [];
  }

  addLaneCars(clipY, laneIndex) {
    let totalLength = 0;

    for (let i = 0; i < this.maxItems; i++) {
      const car = new Sprite(this.game);
      let gap = getRandomInt(80, 200);

      car.posX = totalLength;
      car.posY =
        this.game.canvas.height - this.game.settings.gridSize * laneIndex - 100;
      car.clipX = (700 * i) % 2800;
      car.clipY = clipY;
      car.speed = this.direction === 'right' ? this.speed : this.speed * -1;
      this.cars.push(car);

      totalLength += car.width + gap;
      if (totalLength >= this.game.canvas.width) break;
    }
  }

  animateLaneCars() {
    this.cars.forEach((car, index) => {
      car.move();
    });
  }
}
