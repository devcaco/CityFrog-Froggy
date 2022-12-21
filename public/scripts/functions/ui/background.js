const renderBackground = (game) => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  game.ctx.fillStyle = 'darkgreen';
  game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
  game.ctx.fillStyle = '#4E4E4F';
  game.ctx.fillRect(
    0,
    game.settings.gridSize,
    game.canvas.width,
    game.canvas.height - game.settings.gridSize * 2
  );

  game.ctx.strokeStyle = '#FFF';
  for (let i = 0; i <= game.canvas.height / game.settings.gridSize - 2; i++) {
    game.ctx.beginPath();
    if (i % 2 === 0) {
      game.ctx.setLineDash([]);
      game.ctx.lineWidth = 5;
    } else {
      game.ctx.setLineDash([15, 35]);
      game.ctx.lineWidth = 2;
    }
    game.ctx.moveTo(0, game.settings.gridSize * (i + 1));
    game.ctx.lineTo(game.canvas.width, game.settings.gridSize * (i + 1));
    game.ctx.stroke();
  }
  // Display Current Level Number
  if (
    game.state === 'playing' ||
    game.state === 'paused' ||
    game.state === 'gameover'
  ) {
    game.ctx.fillStyle = 'white';
    game.ctx.font = '18px Arial';
    game.ctx.textAlign = 'right';
    game.ctx.textBaseline = 'top';
    game.ctx.fillText(
      `Level - ${game.levelIndex + 1}`,
      game.canvas.width - 15,
      15
    );
  }

  // Display Current Score
  if (
    game.state === 'playing' ||
    game.state === 'paused' ||
    game.state === 'gameover'
  ) {
    game.ctx.fillStyle = 'white';
    game.ctx.font = '18px Arial';
    game.ctx.textAlign = 'left';
    game.ctx.textBaseline = 'top';
    game.ctx.fillText(`Score - ${game.score}`, 15, 15);
  }

  // Display Timer
  if (
    (game.state === 'playing' || game.state === 'paused') &&
    game.settings.hardMode
  ) {
    game.ctx.fillStyle = 'white';
    game.ctx.font = '18px Arial';
    game.ctx.textAlign = 'left';
    game.ctx.textBaseline = 'alphabetic';
    game.ctx.fillText(
      `Time Left: - ${(game.levels[game.levelIndex].timer / 10).toFixed(1)}`,
      15,
      game.canvas.height - 15
    );
  }
  // Display Pause/Play Buttons
  const pauseBtn = new Image();
  const playBtn = new Image();
  pauseBtn.src = `./public/images/icons/pause.png`;
  playBtn.src = `./public/images/icons/play.png`;

  if (game.state === 'paused') {
    playBtn.onload = renderBtn(game, playBtn);
  } else {
    pauseBtn.onload = renderBtn(game, pauseBtn);
  }
};

const renderBtn = (game, btn) => {
  if (game.state !== 'initial' && game.state !== 'gameover') {
    game.ctx.drawImage(
      btn,
      0,
      0,
      300,
      300,
      game.canvas.width - 50,
      game.canvas.height - 40,
      35,
      35
    );
  }
};

const leafsDisplay = (game) => {
  const container = document.querySelector('.game__container-body');
  let leafsDisplayDiv = container.querySelector('.game__container--body-leafs');

  if (!leafsDisplayDiv) {
    leafsDisplayDiv = document.createElement('div');
    leafsDisplayDiv.classList.add('game__container--body-leafs');
    container.append(leafsDisplayDiv);
  }

  if (game.levels.length) {
    leafsDisplayDiv.innerHTML = '';
    for (let i = 0; i < game.levels[game.levelIndex].nroOfLeafs; i++) {
      const img = document.createElement('img');
      img.src = './public/images/leaf.png';
      img.alt = 'leaf';
      img.classList.add('greyscaled');
      leafsDisplayDiv.appendChild(img);
    }

    if (game.levels[game.levelIndex].leafsCollected.length) {
      const leafsImg = leafsDisplayDiv.querySelectorAll('img');
      const collectedLeafs = game.levels[game.levelIndex].leafsCollected;
      collectedLeafs.forEach((leaf, index) =>
        leafsImg[index].classList.remove('greyscaled')
      );
    }
  }

  container.append(leafsDisplayDiv);
};

const livesDisplay = (nroOfLives) => {
  const container = document.querySelector('.game__container-body');
  let livesDisplayDiv = container.querySelector('.game__container--body-lives');

  if (!livesDisplayDiv) {
    livesDisplayDiv = document.createElement('div');
    livesDisplayDiv.classList.add('game__container--body-lives');
    container.append(livesDisplayDiv);
  }

  livesDisplayDiv.innerHTML = '';

  for (let i = 0; i < nroOfLives; i++) {
    const img = document.createElement('img');
    img.src = './public/images/froggy.png';
    img.alt = 'froggy-live';
    livesDisplayDiv.append(img);
  }
  container.append(livesDisplayDiv);
};
