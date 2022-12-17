function renderPausedMsg(game) {
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
}

function renderLevelCompleteMsg(game) {
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
  game.ctx.fillText(`LEVEL ${game.levelIndex + 1} COMPLETE`, posX - 10, posY);
}

function renderTooltip(game, text) {
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
}
