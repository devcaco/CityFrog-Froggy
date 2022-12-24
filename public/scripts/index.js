window.addEventListener('load', () => {
  console.log('scripts are connected');

  //OVERRIDES DEFAULT SETTINGS DEFINED IN GAME CLASS
  const settings = {
    canvas: {
      container: '#game-canvas-container',
    },
    nroOfLives: 5,
    gameLoop: false,
    soundControl: toggleSound,
    modalControl: toggleModal,
  };

  //NEW INSTANCE OF OUR GAME CLASS
  const game = new Game(settings);
  game.mount();

  //DOM ELEMENTS
  const settingsBtn = document.querySelector(
    '.game__container--header--left-settings > img:first-child'
  );
  const infoBtn = document.querySelector(
    '.game__container--header--left-settings > img:nth-child(3)'
  );
  const helpBtn = document.querySelector(
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

  //DOM ELEMENTS EVENT LISTENERS
  settingsBtn.addEventListener('click', () => {
    toggleModal('settings');
  });
  infoBtn.addEventListener('click', () => {
    toggleModal('credits');
  });
  helpBtn.addEventListener('click', () => {
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
      case 'win':
        renderWin();
        break;
      case 'gameover':
        renderGameOver();
        break;
      case 'credits':
        renderCredits();
        break;
      case 'settings':
      default:
        renderSettings();
        break;
    }
  }

  function changeGameSetting(setting, value) {
    console.log('changing settings');
    if (game) game.settings[setting] = value;
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

  function renderCredits() {
    modalBody.innerHTML = '';
    modalHeaderTitle.innerHTML = 'CREDITS';
    modalLogo.src = './public/images/credits-logo.png';
    modalLogo.alt = 'CityFrog Froggy Credits';
    modalLogo.id = 'body-modal-logo-credits';
    modalLogoContainer.innerHTML = '';
    modalLogoContainer.appendChild(modalLogo);
    modalCloseBtn.classList.remove('hidden');

    const creditsHTML = `
    <div class="game__container--body--modal--body-credits">
      <div class="game__container--body--modal--body--credits-version">
        Version <br />
        1.0
      </div>
      <div class="game__container--body--modal--body--credits-info">
        <div
          class="game__container--body--modal--body--credits--info-tech"
        >
          Technologies:
          <li>Javascript</li>
          <li>HTML5</li>
          <li>CSS3</li>
        </div>
        <div
          class="game__container--body--modal--body--credits--info-credits"
        >
          <p>
            Graphics provided by: <br />
            <span>stock.adobe.com</span>
          </p>
          <p>
            Sounds provided by: <br />
            <span>zapslat.com</span>
          </p>
        </div>
      </div>
      <div class="game__container--body--modal--body--credits-github">
        <a
          href="https://github.com/devcaco/CityFrog-Froggy"
          target="_blank"
          ><img
            src="./public/images/github-logo.png"
            alt="Contribute in Github"
        /></a>
      </div>
      <div class="game__container--body--modal--body--credits-author">
        <p>
          Developed by <br />
          <span>Carlos Sosa (devcaco)</span>
        </p>
      </div>
      <div class="game__container--body--modal--body--credits-ironhack">
        <p>IronHack <br /><span>Miami, Fl, Dec 2022</span></p>
      </div>
    </div>
    `;

    modalBody.innerHTML = creditsHTML;
  }

  function renderWin() {
    modalBody.innerHTML = '';
    modalHeaderTitle.innerHTML = 'YOU WIN';
    modalLogo.src = './public/images/win-logo.png';
    modalLogo.alt = 'Froggy Mastered All Levels';
    modalLogo.id = 'body-modal-logo-win';
    modalLogoContainer.innerHTML = '';
    modalLogoContainer.appendChild(modalLogo);
    modalCloseBtn.classList.add('hidden');

    const winHTML = `
    <div class="game__container--body--modal--body-win">
        <div class="game__container--body--modal--body--win-title">
          Froggy Master
        </div>
        <div class="game__container--body--modal--body--win-points">
          POINTS: ${game.score}
        </div>
        <div class="game__container--body--modal--body--win-subtext">
          Congratulations, you finished and mastered all ${
            game.settings.nroOfLevels
          } levels.
        </div>
        <div class="game__container--body--modal--body--win-leafs">
          <img src="./public/images/golden-leaf.png" alt="froggy-golder-leaf" />
          <img src="./public/images/golden-leaf.png" alt="froggy-golder-leaf" />
          <img src="./public/images/golden-leaf.png" alt="froggy-golder-leaf" />
          <img src="./public/images/golden-leaf.png" alt="froggy-golder-leaf" />
          <img src="./public/images/golden-leaf.png" alt="froggy-golder-leaf" />
          <img src="./public/images/golden-leaf.png" alt="froggy-golder-leaf" />
        </div>
        <div class="game__container--body--modal--body--win-challenge">
         ${!game.settings.hardMode ? 'NEXT CHALLENGE: Play in HARD MODE' : ''} 
        </div>
      </div>
      <div class="game__container--body--modal--body--win-footer">
        play again
      </div>
    `;

    modalBody.innerHTML = winHTML;

    const playAgainBtn = modalBody.querySelector(
      '.game__container--body--modal--body--win-footer'
    );
    playAgainBtn.addEventListener('click', toggleModal);
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
            Hi! I'm Froggy, my goal for each level is to cross this busy highway and
            collect 4 leafs to take back to my cove
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

  function renderGameOver() {
    modalBody.innerHTML = '';
    modalHeaderTitle.innerHTML = 'GAMEOVER';
    modalLogo.src = './public/images/gameover-logo.png';
    modalLogo.alt = 'Froggy-Settings';
    modalLogo.id = 'body-modal-logo-gameover';
    modalLogoContainer.innerHTML = '';
    modalLogoContainer.appendChild(modalLogo);
    modalCloseBtn.classList.add('hidden');
    // modalHeader.classList.add('black_bg');

    const gameOverHTML = `
    <div class="game__container--body--modal--body-gameover">
      <div class="game__container--body--modal--body--gameover-title">
        <p>Froggy is out of lives! It needs time to recover</p>
        <p>Here is your game summary:</p>
      </div>
      <div class="game__container--body--modal--body--gameover-leafs">
        <div
          class="game__container--body--modal--body--gameover--leafs-row"
        >
          <div class="game__container--body--modal--body--gameover--leafs--row-img"><img src="./public/images/leaf.png" alt="froggy green leaf" /></div>
          <div class="game__container--body--modal--body--gameover--leafs--row-title">GREEN LEAFS</div>
          <div class="game__container--body--modal--body--gameover--leafs--row-amount">${game.leafsCollected.green.length}</div>
        </div>
        <div
          class="game__container--body--modal--body--gameover--leafs-row"
        >
          <div class="game__container--body--modal--body--gameover--leafs--row-img"><img src="./public/images/golden-leaf.png" alt="froggy golden leaf" /></div>
          <div class="game__container--body--modal--body--gameover--leafs--row-title">GOLDEN LEAFS</div>
          <div class="game__container--body--modal--body--gameover--leafs--row-amount">${game.leafsCollected.golden.length}</div>
        </div>
      </div>
      <div class="game__container--body--modal--body--gameover-points">
        ${game.score} <br />
        TOTAL POINTS
      </div>
    </div>
    <div class="game__container--body--modal--body--gameover-footer">
      Play Again
    </div>
    `;

    modalBody.innerHTML = gameOverHTML;

    const playAgainBtn = modalBody.querySelector(
      '.game__container--body--modal--body--gameover-footer'
    );
    playAgainBtn.addEventListener('click', toggleModal);
  }

  function renderSettings() {
    modalBody.innerHTML = '';
    modalHeaderTitle.innerHTML = 'SETTINGS';
    modalLogo.src = './public/images/settings-logo.png';
    modalLogo.alt = 'Froggy-Settings';
    modalLogo.id = 'body-modal-logo-settings';
    modalLogoContainer.innerHTML = '';
    modalLogoContainer.appendChild(modalLogo);
    modalCloseBtn.classList.remove('hidden');

    const settingsDiv = document.createElement('div');
    settingsDiv.classList.add('game__container--body--modal--body-settings');
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
      settingsDiv.innerHTML += settingsRow;
    });

    modalBody.appendChild(settingsDiv);
    modalBody.innerHTML += `
    <div
        class="game__container--body--modal--body--settings-footer"
      >SAVE</div>
    `;

    const settingsInput = modalBody.querySelectorAll('input');

    settingsInput.forEach((input) =>
      input.addEventListener('change', () => {
        changeGameSetting(input.id, input.checked);
      })
    );
    const soundSlider = modalBody.querySelector('#enableSounds');
    soundSlider.checked = game.settings.enableSounds;

    const saveBtn = modalBody.querySelector(
      '.game__container--body--modal--body--settings-footer'
    );
    saveBtn.addEventListener('click', toggleModal);
  }
});
