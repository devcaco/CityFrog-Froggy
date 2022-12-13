class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = 950;
    this.canvasHeight = 600;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 50;
    this.state = 'initial';
    this.animate = true;
    this.nroOfLevels = 5;
    this.nroOfLanes = 5;
    this.levels = [];
    this.lives = 4;
    this.score = 0;
    this.currentLevel = 1;
    this.froggy = new Froggy(this.canvas);
    this.timer = null;
    this.keyBind();
    this.froggy.create();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') e.preventDefault();
      if (this.state === 'playing' && this.animate) this.froggy.move(e.code);
      if (this.state === 'initial' && e.code === 'KeyS') {
        this.state = 'playing';
        this.updateLivesDisplay();
        this.setLeafsDisplay();
      }
      if (this.state === 'gameover' && e.code === 'KeyR') {
        this.state = 'playing';
        this.reset();
        this.start();
        this.setLeafsDisplay();
      }
    });
  }

  start() {
    this.createLevels();
    this.gameLoop();
    console.log(this.levels[this.currentLevel - 1]);
  }

  createLevels() {
    this.levels.push(new Level(1, 3, 4));
    this.levels.push(new Level(2, 3, 4));
    this.levels.push(new Level(2, 4, 4));
    this.levels.push(new Level(3, 3));
    this.levels.push(new Level(3, 5));
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

  renderInitialScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0,.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Text
    this.ctx.fillStyle = 'white';
    this.ctx.font = '36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'Click or Press (s) to Start!',
      game.canvas.width / 2,
      game.canvas.height / 2
    );
  }
  renderGameOverScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0,.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Text
    this.ctx.fillStyle = 'white';
    this.ctx.font = '26px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'GAME OVER! PRESS (R) TO PLAY AGAIN',
      game.canvas.width / 2,
      game.canvas.height / 2
    );
    //Clear leafs' display
    this.setLeafsDisplay(true);
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

  renderLeafs() {
    this.levels[this.currentLevel - 1].leafs.forEach((leaf) => leaf.render());
  }

  renderGoldenLeaf() {
    let temp = (this.canvas.width - 50) / 50;
    let posX = (temp / 2) * 50;
    let goldenLeaf = new Sprite('golden-leaf.png', 50, 50, 900, 900);
    goldenLeaf.posX = posX;
    goldenLeaf.posY = 0;
    // goldenLeaf.render();
    if (
      this.levels[this.currentLevel - 1].leafs.length ===
      this.levels[this.currentLevel - 1].leafsCollected.length
    ) {
      goldenLeaf.render();
      if (
        this.froggy.posX === goldenLeaf.posX &&
        this.froggy.posY === goldenLeaf.posY
      ) {
        //   this.animate = false;
        //   this.state = 'levelcomplete';
        this.pauseAnimation(2000);
        setTimeout(() => {
          this.levelup();
          this.setLeafsDisplay();
          console.log('LEVEL COMPLETE');
        }, 1000);
      }
    }
    //check if Froggy reaches golden leaf
  }
  pauseAnimation(time) {
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
      this.gameLoop();
    }, time || 1000);
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
    if (!this.lives) {
      this.state = 'gameover';
      return;
    }
  }

  setLeafsDisplay(clear) {
    let html = document.querySelector('.game__container--header--left-leafs');
    html.innerHTML = '';
    if (clear) return;
    for (let i = 0; i < this.levels[this.currentLevel - 1].leafs.length; i++) {
      let img = document.createElement('img');
      img.src = './images/leaf.png';
      img.alt = 'leaf';
      img.classList.add('greyscaled');
      html.appendChild(img);
    }
  }

  updateLeafsDisplay() {
    let html = document.querySelectorAll(
      '.game__container--header--left-leafs img'
    );

    for (
      let i = 0;
      i < this.levels[this.currentLevel - 1].leafsCollected.length;
      i++
    ) {
      html[i].classList.remove('greyscaled');
    }
  }

  levelup() {
    this.currentLevel++;
    this.froggy.reset();
    this.setLeafsDisplay(true);
  }

  reset() {
    this.lives = 4;
    this.score = 0;
    this.currentLevel = 1;
    this.froggy.reset();
    this.levels = [];
    this.updateLivesDisplay();
  }

  gameLoop() {
    if (!this.animate) return;
    this.renderBackground();
    if (this.state === 'initial') {
      this.renderInitialScreen();
    } else if (this.state === 'playing') {
      this.renderGoldenLeaf();
      this.froggy.render();
      this.renderLeafs();
      this.renderCars();
      this.froggy.checkCollision();
      this.levels[this.currentLevel - 1].collectLeafs();
    } else if (this.state === 'gameover') {
      this.renderGameOverScreen();
      return;
    }

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
