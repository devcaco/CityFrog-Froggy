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
    '.game__container--body--modal--header-close'
  );

  const modalOverlay = document.querySelector('.modal__overlay');
  const modal = document.querySelector('.game__container--body-modal');
  const modalHeader = document.querySelector(
    '.game__container--body--modal-header'
  );
  const modalHeaderTitle = document.querySelector(
    '.game__container--body--modal--header-title'
  );
  const modalBody = document.querySelector(
    '.game__container--body--modal-body'
  );
  const modalLogoContainer = document.querySelector(
    '.game__container--body--modal--header-logo'
  );
  const modalCloseBtn = document.querySelector(
    '.game__container--body--modal--header-close img'
  );
  const modalLogo = document.createElement('img');
  const logo = document.querySelector('.game__container--header-logo > img');
  const gameBody = document.querySelector('.game__container-body');

  const soundIcon = document.querySelector(
    '.game__container--header--right-sound img'
  );

  //EVENT LISTENERS
  settingsBtn.addEventListener('click', () => {
    toggleModal('settings');
  });
  infoBtn.addEventListener('click', () => {
    toggleModal('welcome');
  });
  closeBtn.addEventListener('click', toggleModal);
  modalOverlay.addEventListener('click', toggleModal);
  soundIcon.addEventListener('click', () => {
    toggleSound(true);
  });

  toggleSound();
  toggleModal('welcome');

  function toggleModal(mode) {
    modalOverlay.classList.toggle('hidden');
    logo.classList.toggle('hidden');
    modal.classList.toggle('hidden');

    if (game && game.state === 'playing') {
      game.pauseGame(false);
    }

    switch (mode) {
      case 'welcome':
        renderWelcome();
        break;
      case 'settings':
        // default:
        renderSettings();
        break;
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
    let icon = game.settings.enableSounds
      ? './public/images/icons/sound-on.png'
      : './public/images/icons/sound-off.png';

    soundIcon.src = icon;

    const soundSlider = modalBody.querySelector('#enableSounds');
    if (soundSlider && set) soundSlider.checked = game.settings.enableSounds;
  }

  function renderWelcome() {
    modalBody.innerHTML = '';
    modalHeaderTitle.innerHTML = 'WELCOME';
    modalLogo.src = './public/images/welcome-logo.png';
    modalLogo.alt = 'Froggy Welcome to Game';
    modalLogo.id = 'body-modal-logo-welcome';
    modalLogoContainer.innerHTML = '';
    modalLogoContainer.appendChild(modalLogo);
    modalCloseBtn.classList.add('hidden');

    const welcomeHTML = `
    <div class="game__container--body--modal--body-welcome">
        <div class="game__container--body--modal--body--welcome-sec1">
          <span>FROGGY</span>
          <p>
            Hi, I'm Froggy and my goal is to cross the busy highway while
            collecting 4 leafs to take back to my cove
          </p>
          <p>Finish all 5 levels and you'll be a Froggy Master!</p>
        </div>
        <div class="game__container--body--modal--body--welcome-sec2">
          <span>HOW TO PLAY</span>
          <div
            class="game__container--body--modal--body--welcome--sec2-row"
          >
            <div>
              <img
                src="./public/images/arrowkeys.png"
                alt="froggy-arrow-keys"
              />
            </div>
            <div>
              Move Up/Down/Right/Left with the KeyBoard arrow Keys
            </div>
          </div>
          <div
            class="game__container--body--modal--body--welcome--sec2-row"
          >
            <div style="align-self: center">
              Stand over each of the 4 green leafs to collect them
            </div>
            <div>
              <img src="./public/images/leaf.png" alt="froggy-leaf" />
            </div>
          </div>
          <div
            class="game__container--body--modal--body--welcome--sec2-row"
          >
            <div>
              <img
                src="./public/images/golden-leaf.png"
                alt="froggy-golden-leaf"
              />
            </div>
            <div>
              Once all 4 leafs have been collected grab the golden leaf to
              complete the level
            </div>
          </div>
        </div>
      </div>
      <div
        class="game__container--body--modal--body--welcome-footer"
      >LET'S PLAY!</div>
    `;

    modalBody.innerHTML = welcomeHTML;

    const letsPlayBtn = modalBody.querySelector(
      '.game__container--body--modal--body--welcome-footer'
    );
    letsPlayBtn.addEventListener('click', toggleModal);
  }

  function renderSettings() {
    modalBody.innerHTML = '';
    modalHeaderTitle.innerHTML = 'SETTINGS';
    modalLogo.src = './public/images/settings-logo.png';
    modalLogo.alt = 'Froggy-Settings';
    modalLogo.id = 'body-modal-logo-settings';
    modalLogoContainer.innerHTML = '';
    modalLogoContainer.appendChild(modalLogo);

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
      <div class="game__container--body--modal--body--settings-row">
        <div
          class="game__container--body--modal--body--settings--row-left"
        >
          ${row.title}
          <span>${row.subtitle}</span>
        </div>
        <div
          class="game__container--body--modal--body--settings--row-right"
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
      modalBody.innerHTML += settingsRow;
    });

    const settingsInput = modalBody.querySelectorAll('input');

    settingsInput.forEach((input) =>
      input.addEventListener('change', () => {
        changeGameSetting(input.id, input.checked);
      })
    );
    const soundSlider = modalBody.querySelector('#enableSounds');
    soundSlider.checked = game.settings.enableSounds;
  }
});
