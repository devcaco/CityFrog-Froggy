const renderInitialScreen = (game) => {
  game.ctx.fillStyle = 'rgba(0, 0, 0,.5)';
  game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

  game.ctx.fillStyle = 'white';
  game.ctx.font = '36px Arial';
  game.ctx.textAlign = 'center';
  game.ctx.fillText(
    'Click or Press [space bar] to Start!',
    game.canvas.width / 2,
    game.canvas.height / 2
  );
};

const renderGameOverScreen = (game) => {
  game.ctx.fillStyle = 'rgba(0, 0, 0,.8)';
  game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

  game.ctx.fillStyle = 'white';
  game.ctx.font = '26px Arial';
  game.ctx.textAlign = 'center';
  game.ctx.fillText(
    'GAME OVER! PRESS [R] TO PLAY AGAIN',
    game.canvas.width / 2,
    game.canvas.height / 2
  );
};
