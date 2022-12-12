class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = 750;
    this.canvasHeight = 600;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 50;
    this.lives = 3;
    this.score = 0;
    this.level = 2;
    this.froggy = new Froggy(this.canvas);
    this.froggy.create();
    this.timer = null;
    this.obstacles = [];
    this.leafs = [];
    this.leafsCollected = [];
    this.animate = true;
    this.bonus = [];
    this.bonusCollected = [];
    this.keyBind();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') e.preventDefault();
      if (this.animate) this.froggy.move(e.code);
    });
  }

  start() {
    this.timer = new Date();
    this.getObstacles();
    this.getLeafs();
    this.gameLoop();
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

  getObstacles() {
    const levels = {
      level1: [
        {
          speed: 2.5,
          maxItems: 5,
        },

        {
          speed: 4,
          maxItems: 2,
        },
        {
          speed: 2.5,
          maxItems: 5,
        },
        {
          speed: 6,
          maxItems: 2,
        },
        {
          speed: 2.5,
          maxItems: 2,
        },
      ],
      level2: [
        {
          speed: 2.5,
          maxItems: 2,
        },
        {
          speed: 2.5,
          maxItems: 2,
        },
        {
          speed: 8.5,
          maxItems: 4,
        },
        {
          speed: 2.5,
          maxItems: 2,
        },
        {
          speed: 2.5,
          maxItems: 2,
        },
      ],
    };

    let rows = levels[`level${this.level}`];
    let index = 1;
    let totalGaps = 0;
    let clipY = 0;

    for (let i = 0; i < rows.length; i++) {
      index += 2;
      if (!rows[i]) continue;
      if (i % 2 != 0) rows[i].speed *= -1;
      totalGaps = 0;
      clipY = 400 * i;
      clipY %= 2000;
      for (let e = 0; e < 5; e++) {
        if (totalGaps + 150 > this.canvas.width) break;
        if (e + 1 > rows[i].maxItems) break;
        let sprite = new Sprite();
        let gap = getRandomInt(20, 200);
        e == 0 ? (totalGaps = 0) : (totalGaps += sprite.width + gap);
        sprite.posX = totalGaps;
        sprite.posY = this.canvas.height - this.gridSize * index;

        sprite.clipX = 700 * e;
        sprite.clipX %= 2800;

        sprite.clipY = clipY;

        sprite.speed = rows[i].speed;
        this.obstacles.push(sprite);
      }
    }
  }

  renderObstacles() {
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].render();
      if (this.animate) this.obstacles[i].move();
    }
  }

  getLeafs() {
    let num = (this.canvas.width - 50) / 50;

    for (let i = 0; i < 3; i++) {
      let ran = getRandomInt(0, num) * 50;
      const leaf = new Sprite('leaf.png', 50, 50, 840, 399);
      leaf.posY =
        getRandomInt(1, 5) * 100 - (leaf.posX < 500 ? leaf.height : 0);
      leaf.posX = ran;
      this.leafs.push(leaf);
    }
  }

  renderLeafs() {
    this.leafs.forEach((leaf) => leaf.render());
  }

  checkCollision() {
    let rowObstacles = this.obstacles.filter((obst) => {
      let posY =
        this.froggy.posY % 100 === 0 ? this.froggy.posY - 50 : this.froggy.posY;
      return obst.posY === posY;
    });

    rowObstacles.forEach((obst) => {
      let ox1 = obst.posX;
      let ox2 = obst.posX + obst.width;

      let fx1 = this.froggy.posX;
      let fx2 = this.froggy.posX + this.froggy.imgWidth;

      if (fx1 > ox1 && fx2 < ox2) {
        this.animate = false;
        this.lives--;
        this.writeText('Ouuuch');
        this.pauseAnimation(500);
        this.updateLivesDisplay();
        this.froggy.reset();
      }
    });
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
    this.renderLeafs();
    // this.updateLivesDisplay();
    this.froggy.render();
    this.renderObstacles();
    this.checkCollision();
    this.collectLeafs();

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
