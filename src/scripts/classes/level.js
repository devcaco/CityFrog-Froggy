class Level {
  constructor(dificulty = 1, activeLanes, nroOfLeafs = 3, timeLimit = 600) {
    this.dificulty = dificulty;
    this.activeLanes = activeLanes;
    this.nroOfLeafs = nroOfLeafs;
    this.lanes = [];
    this.timeLimit = timeLimit;
    this.timer = this.timeLimit;
    this.timerID = null;
    this.leafs = [];
    this.leafsCollected = [];
    this.setLanes();
    this.setLanesCars();
  }

  levelTimer(mode) {
    if (game.timeLimit) {
      if (mode === 'start') {
        this.timerID = setInterval(() => {
          if (this.timer <= 0) {
            this.timer = this.timeLimit;
            game.loseLife(`Time's Up`);
          }
          this.timer -= 1;
        }, 100);
      }
      if (mode === 'pause' || mode === 'stop' || mode === 'clear') {
        clearInterval(this.timerID);
        this.timerID = null;
        if (mode === 'clear') this.timer = this.timeLimit;
      }
    }
  }

  setLanes() {
    let speed;
    let direction;
    let maxItems;
    for (let i = 0; i < game.nroOfLanes; i++) {
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

      if (i + 1 > this.activeLanes) maxItems = 0;

      this.lanes.push(new Lane(speed, direction, maxItems));
    }
    shuffle(this.lanes);
  }

  setLanesCars() {
    for (let i = 0, index = 0; i < this.lanes.length; i++) {
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
      this.lanes[i].addLaneCars(clipY, posY);
    }
  }

  animateCars() {
    this.lanes.forEach((lane) => lane.animateLaneCars());
  }

  setLeafs() {
    if (!this.leafs.length) {
      for (let i = 0; i < this.nroOfLeafs; i++) {
        const leaf = new Leaf(game.canvas, _, 50);
        this.leafs.push(leaf);
        this.leafs.intervalID = setInterval(() => {
          leaf.move();
          leaf.pointValue -= 5;
        }, getRandomInt(7000, 10000));
      }
      const grid = (game.canvas.width - game.gridSize) / game.gridSize;
      const goldenLeaf = new Leaf(game.canvas, 'golden-leaf.png', 100);
      goldenLeaf.posX = (grid / 2) * 50;
      goldenLeaf.posY = 0;
      goldenLeaf.visible = false;
      this.leafs.push(goldenLeaf);
    }
    console.log(this.leafs);
  }

  checkIfOverLeaf() {
    this.leafs.forEach((leaf, index) => {
      if (leaf.checkCollision() && leaf.visible) {
        leaf.visible = false;
        leaf.collected = true;
        clearInterval(leaf.intervalID);
        this.leafs.splice(index, 1);
        // game.updateLeafsDisplay();
        game.score += leaf.pointValue;

        if (leaf.imgSrc === 'golden-leaf.png') {
          game.levelUp();
        } else {
          this.leafsCollected.push(leaf);
        }

        leafsDisplay(game);
      }
    });
  }

  reset() {
    clearInterval(this.timerID);
    this.leafs = [];
    this.leafsCollected = [];
    this.timerID = null;
    this.timer = this.timeLimit;
  }
}

class Lane {
  constructor(speed, direction = 'right', maxItems = 5) {
    this.speed = speed || 1;
    this.maxItems = maxItems;
    this.direction = direction;
    this.cars = [];
  }

  addLaneCars(clipY, laneIndex) {
    let totalLength = 0;

    for (let i = 0; i < this.maxItems; i++) {
      const car = new Sprite(game.canvas);
      let gap = getRandomInt(80, 200);

      car.posX = totalLength;
      car.posY = game.canvas.height - game.gridSize * laneIndex - 100;
      car.clipX = (700 * i) % 2800;
      car.clipY = clipY;
      car.speed = this.direction === 'right' ? this.speed : this.speed * -1;
      this.cars.push(car);

      totalLength += car.width + gap;
      if (totalLength >= game.canvas.width) break;
    }
  }

  animateLaneCars() {
    this.cars.forEach((car, index) => {
      car.move();
    });
  }
}
