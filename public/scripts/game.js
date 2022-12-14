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
    this.levelup = false;
    this.froggy = new Froggy(this.canvas);
    this.timer = 0;
    this.timerID = null;
    this.keyBind();
    this.froggy.create();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') e.preventDefault();
      if (this.state === 'playing' && this.animate) this.froggy.move(e.code);
      if (this.state === 'gameover' && e.code === 'KeyR') this.reset();
      if (this.state === 'initial' && e.code === 'KeyS') {
        if (!this.levels.length) this.start();
        this.state = 'playing';
        this.levels[this.currentLevel - 1].levelTimer('start');
        this.updateLivesDisplay();
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

  loseLife(message) {
    this.lives--;
    this.updateLivesDisplay();
    this.writeText(message);
    this.froggy.reset();
    this.pauseAnimation(500);
    if (!this.lives) {
      this.state = 'gameover';
      //   return;
    }
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
    // Display Current Level Number
    if (this.state === 'playing') {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '18px Arial';
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(
        `level - ${this.currentLevel}`,
        game.canvas.width - 15,
        15
      );
    }

    // Display Current Score
    if (this.state === 'playing') {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '18px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(`score - ${this.score}`, 15, 15);
    }

    // Display Timer
    if (this.state === 'playing') {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '18px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'alphabetic';
      this.ctx.fillText(
        `time - ${(this.levels[this.currentLevel - 1].timeLimit / 10).toFixed(
          1
        )}`,
        15,
        this.canvasHeight - 15
      );
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
    if (!this.levels[this.currentLevel - 1].leafs.length) {
      this.levels[this.currentLevel - 1].setLeafs();
      this.setLeafsDisplay();
    }
    this.levels[this.currentLevel - 1].leafs.forEach((leaf) => leaf.render());
  }

  renderGoldenLeaf() {
    let temp = (this.canvas.width - 50) / 50;
    let posX = (temp / 2) * 50;
    let goldenLeaf = new Sprite('golden-leaf.png', 50, 50, 900, 900);
    goldenLeaf.posX = posX;
    goldenLeaf.posY = 0;
    if (
      this.levels[this.currentLevel - 1].leafs.length ===
      this.levels[this.currentLevel - 1].leafsCollected.length
    ) {
      goldenLeaf.render();
      //check if Froggy reaches golden leaf
      if (
        this.froggy.posX === goldenLeaf.posX &&
        this.froggy.posY === goldenLeaf.posY
      ) {
        this.score += 100;
        this.pauseAnimation(1500);
        this.levelup = true;
      }
    }
  }

  pauseAnimation(time) {
    this.animate = false;
    this.levels[this.currentLevel - 1].levelTimer('pause');
    setTimeout(() => {
      this.animate = true;
      if (this.state !== 'gameover')
        this.levels[this.currentLevel - 1].levelTimer('start');
      this.gameLoop();
    }, time || 1000);
  }

  writeText(text) {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    this.ctx.rect(this.froggy.posX - 25, this.froggy.posY + 50, 100, 35);
    this.ctx.fill();
    this.ctx.font = 'normal bold 18px arial';
    this.ctx.fillStyle = '#fff';
    let posX = this.canvas.width / 2;
    let posY = 30;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.froggy.posX + 25, this.froggy.posY + 73);
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

  changeLevels() {
    console.log('leveling-up');
    this.levelup = false;
    this.ctx.fillStyle = 'rgba(208, 80, 32, .9)';
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 5;
    this.ctx.rect(
      300,
      200,
      this.canvas.width / 2 - 150,
      this.canvas.height / 2 - 100
    );
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = 'normal bold 18px arial';
    this.ctx.fillStyle = '#fff';
    let posX = this.canvas.width / 2;
    let posY = this.canvas.height / 2;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`LEVEL ${this.currentLevel} COMPLETE`, posX - 10, posY);

    setTimeout(() => {
      this.currentLevel < 5 ? this.currentLevel++ : (this.currentLevel = 1);
      this.froggy.reset();
      this.setLeafsDisplay(true);
      this.setLeafsDisplay();
    }, 1400);
  }

  reset() {
    this.lives = 4;
    this.score = 0;
    this.currentLevel = 1;
    this.froggy.reset();
    this.levels = [];
    this.updateLivesDisplay();
    this.state = 'initial';
    this.start();
  }

  gameLoop() {
    if (!this.animate) return;
    this.renderBackground();
    if (this.state === 'initial') {
      this.renderInitialScreen();
    } else if (this.state === 'playing') {
      this.renderGoldenLeaf();
      this.renderLeafs();
      this.froggy.render();
      this.renderCars();
      this.froggy.checkCollision();
      this.levels[this.currentLevel - 1].collectLeafs();
      if (this.levelup) this.changeLevels();
    } else if (this.state === 'gameover') {
      this.renderCars();
      this.renderGameOverScreen();
      return;
    }

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
