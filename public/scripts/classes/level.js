class Level {
  constructor(
    game,
    dificulty = 'easy',
    activeLanes,
    nroOfLeafs = 3,
    timeLimit = 300
  ) {
    this.game = game;
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
    if (!this.game.settings.enableTimer) return;

    if (mode === 'start') {
      this.timerID = setInterval(() => {
        if (this.timer <= 0) {
          this.timer = this.timeLimit;
          clearInterval(this.timerID);
          this.game.timesUp = true;
          this.game.sounds.timesUp.play();
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

  setLanes() {
    let speed;
    let direction;
    let maxItems;
    for (let i = 0; i < this.game.settings.nroOfLanes; i++) {
      direction = getRandomInt(1, 2) == 1 ? 'right' : 'left';

      switch (this.dificulty) {
        case 'easy':
          speed = getRandomInt(1, 3, 2);
          maxItems = getRandomInt(10, 15);
          break;
        case 'medium':
          speed = getRandomInt(2, 4, 2);
          maxItems = getRandomInt(3, 8);
          break;
        case 'hard':
          speed = getRandomInt(3, 6, 2);
          maxItems = getRandomInt(4, 6);
          break;
      }

      if (i + 1 > this.activeLanes) maxItems = 0;

      this.lanes.push(new Lane(this.game, speed, direction, maxItems));
    }
    shuffle(this.lanes);
  }

  setLanesCars() {
    for (let i = 0; i < this.lanes.length; i++) {
      let posY = i * 2 + 1;
      this.lanes[i].addLaneCars(posY);
    }
  }

  animateCars() {
    this.lanes.forEach((lane) => lane.animateLaneCars());
  }

  setLeafs() {
    if (!this.leafs.length) {
      for (let i = 0; i < this.nroOfLeafs; i++) {
        const leaf = new Leaf(this.game, _, 50);
        this.leafs.push(leaf);
        this.leafs.intervalID = setInterval(() => {
          leaf.move();
          leaf.pointValue -= 5;
        }, getRandomInt(7000, 10000));
      }
      const grid =
        (this.game.canvas.width - this.game.settings.gridSize) /
        this.game.settings.gridSize;
      const goldenLeaf = new Leaf(this.game, 'golden-leaf.png', 100);
      goldenLeaf.posX = (grid / 2) * 50;
      goldenLeaf.posY = 0;
      goldenLeaf.visible = false;
      this.leafs.push(goldenLeaf);
    }
  }

  checkIfOverLeaf() {
    this.leafs.forEach((leaf, index) => {
      if (leaf.checkCollision() && leaf.visible) {
        leaf.visible = false;
        leaf.collected = true;
        clearInterval(leaf.intervalID);
        this.leafs.splice(index, 1);
        this.game.score += leaf.pointValue;

        if (leaf.imgSrc === 'golden-leaf.png') {
          this.game.levelUp();
          this.game.sounds.levelComplete.play();
        } else {
          this.leafsCollected.push(leaf);
          this.game.sounds.froggyPick.play();
        }

        leafsDisplay(this.game);
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
