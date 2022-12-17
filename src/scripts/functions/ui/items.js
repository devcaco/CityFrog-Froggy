function renderLeafs(game) {
  game.levels[game.levelIndex].leafs.forEach((leaf) => {
    //   console.log('rendering-leafs');
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
}

function renderFroggy(game) {
  game.froggy.render();
}

function renderCars(game) {
  game.levels[game.levelIndex].lanes.forEach((lane, index) => {
    lane.cars.forEach((car) => car.render());
  });
}

function renderLevelItems(game) {
  renderLeafs(game);
  renderFroggy(game);
  renderCars(game);
}
