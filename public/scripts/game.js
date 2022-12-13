class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = 750;
    this.canvasHeight = 600;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 50;
    this.animate = true;
    this.nroOfLevels = 5;
    this.nroOfLanes = 5;
    this.levels = [];
    this.lives = 4;
    this.score = 0;
    this.currentLevel = 2;
    this.froggy = new Froggy(this.canvas);
    this.timer = null;
    this.obstacles = [];
    this.leafs = [];
    this.leafsCollected = [];
    this.bonus = [];
    this.bonusCollected = [];
    this.keyBind();
    this.froggy.create();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') e.preventDefault();
      if (this.animate) this.froggy.move(e.code);
    });
  }

  start() {
    this.timer = new Date();
    this.generateLevels();
    this.getLeafs();
    this.gameLoop();
    // console.log(this.levels[this.currentLevel - 1]);
  }

  renderBackground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'darkgreen';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#4E4E4F';
    this.ctx.fillRect(
      0,
      game.gridSize,
      this.canvas.width,
      this.canvas.height - game.gridSize * 2
    );

    this.ctx.strokeStyle = '#FFF';
    for (let i = 0; i <= this.canvas.height / game.gridSize - 2; i++) {
      this.ctx.beginPath();
      if (i % 2 === 0) {
        this.ctx.setLineDash([]);
        this.ctx.lineWidth = 5;
      } else {
        this.ctx.setLineDash([15, 35]);
        this.ctx.lineWidth = 2;
      }
      this.ctx.moveTo(0, game.gridSize * (i + 1));
      this.ctx.lineTo(canvas.width, game.gridSize * (i + 1));
      this.ctx.stroke();
    }
  }

  generateLevels() {
    this.levels.push(new Level(1, 3));
    this.levels.push(new Level(2, 3));
    this.levels.push(new Level(2, 4));
    this.levels.push(new Level(3, 3));
    this.levels.push(new Level(3, 5));
  }

  renderCars() {
    for (let i = 0; i < this.levels[this.currentLevel - 1].lanes.length; i++) {
      if (!this.levels[this.currentLevel - 1].lanes[i]) continue;
      for (
        let e = 0;
        e < this.levels[this.currentLevel - 1].lanes[i].cars.length;
        e++
      ) {
        this.levels[this.currentLevel - 1].lanes[i].cars[e].render();
        this.levels[this.currentLevel - 1].lanes[i].cars[e].move();
      }
    }
  }

  getLeafs() {
    let num = (this.canvas.width - 50) / 50;

    for (let i = 0; i < 3; i++) {
      let ran = getRandomInt(0, num) * 50;
      const leaf = new Sprite('leaf.png', 50, 50, 840, 399);
      leaf.posX = ran;
      leaf.posY =
        getRandomInt(1, 5) * 100 -
        (leaf.posX < getRandomInt(100, 700) ? leaf.height : 0);
      this.leafs.push(leaf);
    }
  }

  renderLeafs() {
    this.leafs.forEach((leaf) => leaf.render());
  }

  pauseAnimation(time) {
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
      this.gameLoop();
    }, time || 1000);
  }

  collectLeafs() {
    this.leafs.forEach((leaf) => {
      if (this.froggy.posX === leaf.posX && this.froggy.posY === leaf.posY) {
        this.leafsCollected.push(leaf);
        leaf.collected = true;
        leaf.visible = false;
      }
    });
  }

  writeText(text) {
    this.ctx.font = 'normal bold 18px arial';
    this.ctx.fillStyle = '#fff';
    let posX = this.canvas.width / 2;
    let posY = 30;
    this.ctx.fillText(text, posX, posY);
  }

  updateLivesDisplay() {
    let html = document.querySelector('.game__container--header--right-lives');
    html.innerHTML = '';
    for (let i = 0; i < this.lives; i++) {
      let img = document.createElement('img');
      img.src = './images/froggy-up.png';
      img.alt = 'lives';
      html.appendChild(img);
    }
  }

  gameLoop() {
    if (!this.animate) return;
    this.renderBackground();
    this.froggy.render();
    this.renderLeafs();
    this.renderCars();
    this.froggy.checkCollision();
    this.collectLeafs();

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
