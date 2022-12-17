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
    this.animate = false;
    this.nroOfLevels = 5;
    this.nroOfLanes = 5;
    this.horizontalWrap = true;
    this.timeLimit = true;
    this.levels = [];
    this.lives = 4;
    this.score = 0;
    this.levelIndex = 0;
    this.currentLevel = this.levelIndex + 1;
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
      if (this.state === 'playing' && e.code === 'KeyP') this.pauseGame(false);
      if (this.state === 'paused' && e.code === 'KeyC') this.pauseGame(true);
      if (this.state === 'gameover' && e.code === 'KeyR') this.reset();
      if (this.state === 'initial' && e.code === 'KeyS') {
        if (!this.levels.length) this.start();
        this.state = 'playing';
        this.animate = true;
        this.startLevel();
        this.gameLoop();
      }
    });
  }

  start() {
    this.createLevels();
    this.gameLoop();
    console.log(this.levels[this.levelIndex]);
  }

  startLevel() {
    console.log('starting level', this.levelIndex);
    this.levels[this.levelIndex].setLeafs();
    this.levels[this.levelIndex].levelTimer('start');
    this.froggy.reset();
    this.state = 'playing';
    leafsDisplay(this);
    livesDisplay(this.lives);
  }

  endLevel() {
    this.levels[this.levelIndex].reset();
  }

  createLevels() {
    this.levels.push(new Level(1, 3, 4));
    this.levels.push(new Level(2, 3, 4));
    this.levels.push(new Level(2, 4, 4));
    this.levels.push(new Level(1, 3));
    this.levels.push(new Level(1, 3));
  }

  levelUp() {
    this.state = 'levelcomplete';
    this.pauseAnimation(1500);
    setTimeout(() => {
      const oldLevelIndex = this.levelIndex;
      this.levelIndex++;
      this.levelIndex %= 6;
      this.startLevel();
      this.levels[oldLevelIndex].reset();
    }, 1400);
  }

  pauseAnimation(time) {
    this.animate = false;
    this.levels[this.levelIndex].levelTimer('pause');

    setTimeout(() => {
      this.animate = true;
      if (this.state !== 'gameover')
        this.levels[this.levelIndex].levelTimer('start');
      this.gameLoop();
    }, time || 1000);
  }

  pauseGame(resume) {
    if (resume) {
      this.animate = true;
      this.state = 'playing';
      this.levels[this.levelIndex].levelTimer('start');
      this.gameLoop();
      return;
    }
    this.animate = false;
    this.state = 'paused';
    this.levels[this.levelIndex].levelTimer('pause');
  }

  loseLife(message) {
    this.lives--;
    // this.updateLivesDisplay();
    renderTooltip(this, message);
    this.froggy.reset();
    livesDisplay(this.lives);
    this.pauseAnimation(500);
    if (!this.lives) {
      this.state = 'gameover';
      //   return;
    }
  }

  carCollision() {
    game.loseLife('Ouuuch');
  }

  reset() {
    this.lives = 4;
    this.score = 0;
    this.currentLevel = 1;
    this.froggy.reset();
    this.levels = [];
    this.state = 'initial';
    this.start();
  }

  gameLoop() {
    renderBackground(this);
    if (this.state === 'initial') {
      renderInitialScreen(this);
    } else if (
      this.state === 'playing' ||
      this.state == 'paused' ||
      this.state == 'levelcomplete'
    ) {
      renderLevelItems(this);
      this.levels[this.levelIndex].animateCars();
      if (this.state === 'paused') renderPausedMsg(this);
      if (this.state === 'levelcomplete') renderLevelCompleteMsg(this);

      if (this.froggy.collided) {
        this.loseLife('Ouuuch');
        this.froggy.collided = false;
      }
    } else if (this.state === 'gameover') {
      renderLevelItems(this);
      renderGameOverScreen(this);
      return;
    }
    if (!this.animate) return;

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
