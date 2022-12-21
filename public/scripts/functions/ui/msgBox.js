const renderPausedMsg = (game) => {
  game.ctx.beginPath();
  game.ctx.fillStyle = 'rgba(208, 80, 32, .9)';
  game.ctx.strokeStyle = '#fff';
  game.ctx.lineWidth = 5;
  game.ctx.rect(
    300,
    200,
    game.canvas.width / 2 - 150,
    game.canvas.height / 2 - 100
  );
  game.ctx.fill();
  game.ctx.stroke();

  game.ctx.font = 'normal bold 18px arial';
  game.ctx.fillStyle = '#fff';
  let posX = game.canvas.width / 2;
  let posY = game.canvas.height / 2;
  game.ctx.textAlign = 'center';
  game.ctx.textBaseline = 'middle';
  game.ctx.fillText(`GAME PAUSED`, posX - 10, posY);

  game.ctx.font = 'normal 15px arial';
  game.ctx.fillText(`press [c] to continue`, posX - 10, posY + 80);
};

const renderLevelCompleteMsg = (game) => {
  game.ctx.beginPath();
  game.ctx.fillStyle = 'rgba(208, 80, 32, .9)';
  game.ctx.strokeStyle = '#fff';
  game.ctx.lineWidth = 5;
  game.ctx.rect(
    300,
    200,
    game.canvas.width / 2 - 150,
    game.canvas.height / 2 - 100
  );
  game.ctx.fill();
  game.ctx.stroke();

  game.ctx.font = 'normal bold 18px arial';
  game.ctx.fillStyle = '#fff';
  let posX = game.canvas.width / 2;
  let posY = game.canvas.height / 2 - 20;
  game.ctx.textAlign = 'center';
  game.ctx.textBaseline = 'middle';
  game.ctx.fillText(`LEVEL ${game.levelIndex + 1} COMPLETE`, posX - 10, posY);

  game.ctx.font = 'normal 15px arial';
  game.ctx.fillText(`SCORE: ${game.score}`, posX - 10, posY + 30);
  const levelTime = +(
    (game.levels[game.levelIndex].timeLimit -
      game.levels[game.levelIndex].timer) /
    10
  ).toFixed(2);
  game.ctx.font = 'normal 15px arial';
  if (game.settings.hardMode) {
    game.ctx.fillText(`TIME: ${levelTime} seconds`, posX - 10, posY + 50);
  }
  if (!game.settings.autoContinue) {
    game.ctx.font = 'normal 15px arial';
    game.ctx.fillText(`press [c] to continue`, posX - 10, posY + 105);
  }
};

const renderTooltip = (game, text) => {
  game.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
  game.ctx.rect(game.froggy.posX - 25, game.froggy.posY + 50, 100, 35);
  game.ctx.fill();
  game.ctx.font = 'normal bold 18px arial';
  game.ctx.fillStyle = '#fff';
  let posX = game.canvas.width / 2;
  let posY = 30;
  game.ctx.textAlign = 'center';
  game.ctx.textBaseline = 'alphabetic';
  game.ctx.fillText(text, game.froggy.posX + 25, game.froggy.posY + 73);
};
