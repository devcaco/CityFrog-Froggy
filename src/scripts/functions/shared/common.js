window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

const _ = undefined;

getRandomInt = function (min, max, round = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let result = Math.random() * (max - min) + min;
  return Number(result.toFixed(round));
};

getRandomColor = function () {
  var red = getRandomInt(0, 257);
  var green = getRandomInt(0, 257);
  var blue = getRandomInt(0, 257);
  return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
};

shuffle = (array) => {
  let oldElement;
  for (let i = array.length - 1; i > 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    oldElement = array[i];
    array[i] = array[rand];
    array[rand] = oldElement;
  }
  return array;
};
