requirejs([
  'utils', 'siteData', 'game/index'
], (utils, siteData, Game) => {

  // TEMP
  window.utils = utils;
  window.siteData = siteData;
  window.rng = new utils.seedrandom('');

  const { ko, jQuery } = utils;

  const esnextWarnings = document.querySelectorAll('.esnext-warning');
  esnextWarnings.forEach(warning => {
    warning.remove();
  });

  const actions = [];
  const act = () => {
    // TODO insert in order of effect
  };

  const game = Game.create();
  const { move } = game;

  // TODO design input shortcuts for actual game commands
  jQuery('body').on('keydown', (e) => {
    const code = e.keyCode;
    if (code === 37) {
      move(-1, 0);
    } else if (code == 38) {
      move(0, -1);
    } else if (code == 39) {
      move(1, 0);
    } else if (code == 40) {
      move(0, 1);
    }
  });
  
  setTimeout(() => {
    ko.applyBindings(game, document.querySelector('body'));
  }, 100);
});
