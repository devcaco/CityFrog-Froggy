const defaultSettings = {
  nroOfLanes: 5,
  nroOfLives: 4,
  nroOfLevels: 6,
  horizontalWrap: true,
  enableTimer: true,
  enableSounds: true,
  gridSize: 50,
  canvas: {
    container: '#game-canvas-container',
    width: 950,
    height: 600,
  },
};

class Game {
  constructor(settings = defaultSettings) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.settings = { ...defaultSettings, ...settings };
    this.canvas.width =
      this.settings.canvas.width || defaultSettings.canvas.width;
    this.canvas.height =
      this.settings.canvas.height || defaultSettings.canvas.height;
    this.state = 'initial';
    this.animate = false;
    this.levels = [];
    this.lives = this.settings.nroOfLives;
    this.score = 0;
    this.timesUp = false;
    this.levelIndex = 0;
    this.froggy = new Froggy(this);
    this.timer = 0;
    this.timerID = null;
    this.sounds = {
      froggyJump: new Audio('./public/sounds/froggy-jump-2.wav'),
      froggyCrash: new Audio('./public/sounds/froggy-crash-2.wav'),
      froggyPick: new Audio('./public/sounds/froggy-pick.wav'),
      levelComplete: new Audio('./public/sounds/level-complete.wav'),
      timesUp: new Audio('./public/sounds/times-up-1.wav'),
    };
    const $this = this;
    Audio.prototype.play = function () {
      if (!$this.settings.enableSounds) return;
      this.__proto__.__proto__.play.call(this.cloneNode(true));
    };
    this.keyBind();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') e.preventDefault();
      if (this.state === 'playing' && this.animate) this.froggy.move(e.code);
      if (this.state === 'playing' && e.code === 'KeyP') this.pauseGame(false);
      if (this.state === 'paused' && e.code === 'KeyC') this.pauseGame(true);
      if (this.state === 'gameover' && e.code === 'KeyR') this.reset();
      if (this.state === 'initial' && e.code === 'KeyS') {
        this.state = 'playing';
        this.animate = true;
        this.startLevel();
        this.gameLoop();
      }
    });
  }

  mount() {
    const container = document.querySelector(this.settings.canvas.container);
    if (container) {
      container.appendChild(this.canvas);
      this.canvas.setAttribute('id', 'game-canvas');
      this.start();
    }
  }

  start() {
    this.createLevels();
    this.gameLoop();
    console.log(this.levels[this.levelIndex]);
  }

  startLevel() {
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
    this.levels.push(new Level(this, 'easy', 3, 4, _));
    this.levels.push(new Level(this, 'easy', 3, 4, _));
    this.levels.push(new Level(this, 'medium', 4, 4, _));
    this.levels.push(new Level(this, 'medium', 4, 4, _));
    this.levels.push(new Level(this, 'easy', 3, 4, _));
  }

  levelUp() {
    this.state = 'levelcomplete';
    this.pauseAnimation(1400);
    setTimeout(() => {
      this.endLevel();
      this.levelIndex++;
      this.levelIndex %= 5;
      this.startLevel();
    }, 1400);
  }

  pauseAnimation(time) {
    this.animate = false;
    this.levels[this.levelIndex].levelTimer('pause');

    setTimeout(() => {
      this.animate = true;
      if (this.state !== 'gameover' && this.state !== 'levelcomplete')
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
    renderTooltip(this, message);
    this.froggy.reset();
    livesDisplay(this.lives);
    this.pauseAnimation(500);
    if (!this.lives) {
      this.levels[this.levelIndex].reset();
      this.state = 'gameover';
    }
  }

  reset() {
    this.lives = 4;
    this.score = 0;
    this.levelIndex = 0;
    this.froggy.reset();
    this.levels = [];
    this.state = 'initial';
    this.animate = false;
    this.start();
  }

  gameLoop() {
    renderBackground(this);

    switch (this.state) {
      case 'initial':
        renderInitialScreen(this);
        break;
      case 'playing':
      case 'paused':
      case 'levelcomplete':
        renderLevelItems(this);
        this.levels[this.levelIndex].animateCars();
        if (this.state === 'paused') renderPausedMsg(this);
        if (this.state === 'levelcomplete') renderLevelCompleteMsg(this);
        if (this.froggy.collided) {
          this.loseLife('Ouuuch');
          this.sounds.froggyCrash.play();
          this.froggy.collided = false;
        }
        if (this.timesUp) {
          this.loseLife('TimesUp');
          this.timesUp = false;
        }
        break;
      case 'gameover':
        renderLevelItems(this);
        renderGameOverScreen(this);
        return;
      default:
        break;
    }

    if (!this.animate) return;

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
