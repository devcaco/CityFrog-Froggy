class Level {
  constructor(dificulty, activeLanes, nroOfLeafs, timeLimit) {
    this.dificulty = dificulty || 1;
    this.activeLanes = activeLanes;
    this.nroOfLeafs = nroOfLeafs || 3;
    this.lanes = [];
    this.timeLimit = timeLimit || 200;
    this.timerID = null;
    this.leafs = [];
    this.leafsCollected = [];
    this.setLanes();
    this.setLanesCars();
    // this.setLeafs();
  }

  levelTimer(mode) {
    if (mode === 'start') {
      this.timerID = setInterval(() => {
        if (this.timeLimit <= 0) {
          this.timeLimit = 200;
          game.loseLife(`Time's Up`);
        }
        this.timeLimit = this.timeLimit - 1;
      }, 100);
      console.log('setting interval', this.timerID);
    }
    if (mode === 'pause' || mode === 'stop' || mode === 'clear') {
      clearInterval(this.timerID);
      console.log(
        'clearing interval-2',
        this.timerID,
        clearInterval(this.timerID)
      );
      this.timerID = null;
      if (mode === 'clear') this.timeLimit = 200;
    }
  }

  setLanes() {
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
          maxItems = getRandomInt(10, 15);
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

  setLanesCars() {
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
      this.lanes[i].addCar(clipY, posY);
    }
  }

  setLeafs() {
    let temp = (game.canvas.width - 50) / 50;

    for (let i = 0; i < this.nroOfLeafs; i++) {
      let ran = getRandomInt(0, temp) * 50;
      const leaf = new Sprite('leaf.png', 50, 50, 840, 399);
      leaf.posX = ran;
      leaf.posY =
        getRandomInt(1, 5) * 100 -
        (leaf.posX < getRandomInt(100, 700) ? leaf.height : 0);
      // this.moveLeaf(leaf);
      this.leafs.push(leaf);
      this.leafs.interval = setInterval(() => {
        this.moveLeaf(this.leafs[i]);
      }, getRandomInt(7000, 10000));
    }
  }

  moveLeaf(leaf) {
    let max = (game.canvas.width - 50) / 50;
    leaf.posX = getRandomInt(0, max) * 50;
    leaf.posY =
      getRandomInt(1, 5) * 100 -
      (leaf.posX < getRandomInt(100, 700) ? leaf.height : 0);
    leaf.pointValue -= 5;
  }

  collectLeafs() {
    this.leafs.forEach((leaf) => {
      if (
        game.froggy.posX === leaf.posX &&
        game.froggy.posY === leaf.posY &&
        !leaf.collected
      ) {
        leaf.visible = false;
        leaf.collected = true;
        clearInterval(leaf.interval);
        this.leafsCollected.push(leaf);
        game.updateLeafsDisplay();
        game.score += leaf.pointValue;
      }
    });
  }
}

class Lane {
  constructor(speed, direction, maxItems) {
    this.speed = speed || 1;
    this.maxItems = maxItems || 5;
    this.direction = direction || 'right';
    this.cars = [];
  }

  addCar(clipY, posY) {
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
