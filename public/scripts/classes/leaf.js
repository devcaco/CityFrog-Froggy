class Leaf extends Sprite {
  constructor(canvas, imgSrc = 'leaf.png', pointValue = 50) {
    super(canvas, imgSrc, 50, 50, 840, 399, 50);
    this.collected = false;
    this.intervalID = null;
    this.pointValue = pointValue;
    this.move();
  }
  move() {
    const grid = (this.canvas.width - game.gridSize) / game.gridSize;
    this.posX = getRandomInt(0, grid) * 50;
    this.posY =
      getRandomInt(1, 5) * 100 -
      (this.posX < getRandomInt(100, 700) ? this.height : 0);
    game.levels[game.levelIndex].checkIfOverLeaf();
  }

  render() {
    if (this.imgSrc === 'golden-leaf.png') {
      this.clipW = 900;
      this.clipH = 900;
    }
    super.render();
  }
}
