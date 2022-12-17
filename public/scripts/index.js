const settings = {
  canvas: {
    container: '#game-canvas-container',
  },
  nroOfLives: 5,
  enableTimer: false,
};

window.addEventListener('load', () => {
  console.log('scripts are connected');

  const game = new Game(settings);
  game.mount();
});
