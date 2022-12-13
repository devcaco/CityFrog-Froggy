class Level {
  constructor(dificulty, activeLanes) {
    this.dificulty = dificulty || 1;
    this.activeLanes = activeLanes;
    this.lanes = [];
    this.getLanes();
    this.getLanesCars();
  }

  getLanes() {
    let speed;
    let direction;
    let maxItems;
    for (let i = 0; i < game.nroOfLanes; i++) {
      if (i + 1 > this.activeLanes) {
        this.lanes.push(null);
        continue;
      }
      direction = getRandomInt(1, 2) == 1 ? 'right' : 'left';

      switch (this.dificulty) {
        case 1:
          speed = getRandomInt(1, 3, 2);
          maxItems = getRandomInt(1, 5);
          break;
        case 2:
          speed = getRandomInt(2, 4, 2);
          maxItems = getRandomInt(3, 8);
          break;
        case 3:
          speed = getRandomInt(3, 6, 2);
          maxItems = getRandomInt(4, 6);
          break;
      }

      this.lanes.push(new Lane(speed, direction, maxItems, i + 1));
    }
    shuffle(this.lanes);
  }
  getLanesCars() {
    for (let i = 0, index = 0; i < this.lanes.length; i++) {
      if (!this.lanes[i]) continue;
      let posY = i * 2 + 1;
      let clipY;
      if (this.lanes[i].direction === 'right') {
        index %= 3;
        let arr = [0, 800, 1600];
        clipY = arr[index];
      } else {
        index %= 2;
        let arr = [400, 1200];
        clipY = arr[index];
      }
      index++;
      this.lanes[i].getCars(clipY, posY);
    }
  }
}

class Lane {
  constructor(speed, direction, maxItems) {
    this.speed = speed || 1;
    this.maxItems = maxItems || 5;
    this.direction = direction || 'right';
    this.cars = [];
  }

  getCars(clipY, posY) {
    let totalGapLength = 0;
    let laneIndex = posY;

    for (let i = 0; i < this.maxItems; i++) {
      if (totalGapLength + 150 > game.canvas.width) break;
      let car = new Sprite();
      let gap = getRandomInt(20, 200);
      i == 0 ? (totalGapLength = 0) : (totalGapLength += car.width + gap);
      car.posX = totalGapLength;
      car.posY = game.canvas.height - game.gridSize * laneIndex - 100;
      car.clipX = 700 * i;
      car.clipX %= 2800;

      car.clipY = clipY;
      car.speed = this.direction === 'right' ? this.speed : this.speed * -1;
      this.cars.push(car);
    }
  }
}
