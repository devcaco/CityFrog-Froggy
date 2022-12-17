const renderLeafs = (game) => {
  game.levels[game.levelIndex].leafs.forEach((leaf) => {
    if (leaf.imgSrc === 'leaf.png') leaf.render();
    else {
      if (
        game.levels[game.levelIndex].nroOfLeafs ===
        game.levels[game.levelIndex].leafsCollected.length
      ) {
        leaf.visible = true;
        leaf.render();
      }
    }
  });
};

const renderFroggy = (game) => {
  game.froggy.render();
};

const renderCars = (game) => {
  game.levels[game.levelIndex].lanes.forEach((lane, index) => {
    lane.cars.forEach((car) => car.render());
  });
};

const renderLevelItems = (game) => {
  renderLeafs(game);
  renderFroggy(game);
  renderCars(game);
};
