requirejs([
  'utils', 'siteData', 'game/index'
], (utils, siteData, Game) => {

  // TEMP
  window.utils = utils;
  window.siteData = siteData;
  window.rng = utils.random.createSource('');

  const { ko, jQuery } = utils;

  const actions = [];
  const act = () => {
    // TODO insert in order of effect
  };

  const game = Game.create();
  const { move } = game;

  // TEMP
  window.game = game;
  game.world.subscribe(w => window.world = w);

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
