window.addEventListener('load', () => {
  console.log('scripts are connected');

  const settings = {
    canvas: {
      container: '#game-canvas-container',
    },
    nroOfLives: 5,
    enableTimer: false,
    soundControl: toggleSound,
  };

  const game = new Game(settings);
  game.mount();

  //DOM ELEMENTS
  const settingsBtn = document.querySelector(
    '.game__container--header--left-settings > img:first-child'
  );
  const infoBtn = document.querySelector(
    '.game__container--header--left-settings > img:nth-child(2)'
  );
  const closeBtn = document.querySelector(
    '.game__container--body--modal-close'
  );

  const modal = document.querySelector('.game__container--body-modal');
  const modalOverlay = document.querySelector('.modal__overlay');
  const logo = document.querySelector('.game__container--header-logo > img');
  const gameBody = document.querySelector('.game__container-body');
  const settingsInput = renderSettings().querySelectorAll('input');
  const soundIcon = document.querySelector(
    '.game__container--header--right-sound img'
  );
  const soundSlider = document.querySelector('#enableSounds');

  //EVENT LISTENERS
  settingsBtn.addEventListener('click', toggleModal);
  infoBtn.addEventListener('click', toggleModal);
  closeBtn.addEventListener('click', toggleModal);
  modalOverlay.addEventListener('click', toggleModal);
  soundIcon.addEventListener('click', () => {
    toggleSound(true);
  });
  settingsInput.forEach((input) =>
    input.addEventListener('change', () => {
      changeGameSetting(input.id, input.checked);
    })
  );

  toggleSound();

  function toggleModal() {
    console.log('opening modal');
    modalOverlay.classList.toggle('hidden');
    logo.classList.toggle('hidden');
    modal.classList.toggle('hidden');

    if (game && game.state === 'playing') {
      game.pauseGame(false);
    }
  }

  function changeGameSetting(setting, value) {
    if (game) {
      game.settings[setting] = value;
    }
    toggleSound();
  }

  function toggleSound(set) {
    if (set) game.settings.enableSounds = !game.settings.enableSounds;
    let icon = {
      true: './public/images/icons/sound-on.png',
      false: './public/images/icons/sound-off.png',
    }[game.settings.enableSounds];

    soundIcon.src = icon;
    if (set) soundSlider.checked = game.settings.enableSounds;
  }

  function renderSettings() {
    settingsContainer = gameBody.querySelector(
      '.game__container--body--modal--settings-body'
    );

    settingsContainer.innerHTML = '';

    let settingsArr = [
      {
        id: 'enableSounds',
        title: 'Enable Sounds',
        subtitle: '',
      },
      {
        id: 'hardMode',
        title: 'Hard Mode',
        subtitle:
          'Adds a 30s timer to each level and moves each leaf at a random interval decreasing its point value',
      },
      {
        id: 'horizontalWrap',
        title: 'Horizontal Wrap',
        subtitle:
          'Enables Froggy to go out one end and re-appears on the other end',
      },
      {
        id: 'autoContinue',
        title: 'Auto Continue',
        subtitle: 'Continues automatically after each level',
      },
      {
        id: 'gameLoop',
        title: 'Game Loop',
        subtitle:
          'After completing the last level, continue playing from level 1 accumulating points until out of lives',
      },
    ];

    settingsArr.forEach((row) => {
      let settingsRow = `
      <div class="game__container--body--modal--settings--body-row">
        <div
          class="game__container--body--modal--settings--body--row-left"
        >
          ${row.title}
          <span>${row.subtitle}</span>
        </div>
        <div
          class="game__container--body--modal--settings--body--row-right"
        >
          <label class="switch">
            <input type="checkbox" ${
              game.settings[row.id] ? 'checked' : ''
            } id="${row.id}" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      `;
      settingsContainer.innerHTML += settingsRow;
    });

    return settingsContainer;
  }
});
