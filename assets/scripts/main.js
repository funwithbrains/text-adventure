requirejs([
  'utils', 'siteData', 'game/index'
], (utils, siteData, gameIndex) => {
  window.siteData = siteData;

  const { _, ko, jQuery } = utils;

  const esnextWarnings = document.querySelectorAll('.esnext-warning');
  esnextWarnings.forEach(warning => {
    warning.remove();
  });

  const actions = [];
  const act = () => {
    // TODO insert in order of effect
  };

  const world = gameIndex.worldIndex.createWorld('');
  const getRoom = world.roomSource.getRoom;

  const xPosition = ko.observable(0);
  const yPosition = ko.observable(0);
  const currentRoom = ko.pureComputed(() => {
    return world.roomSource.getRoomModel(xPosition(), yPosition());
  });

  const mapRange = 8;
  const map = ko.pureComputed(() => {
    const x = xPosition();
    const y = yPosition();
    const minX = x - mapRange;
    const maxX = x + 1 + mapRange;
    const minY = y - mapRange;
    const maxY = y + 1 + mapRange;
    var htmlMap = '';

    for (var j = minY; j < maxY; ++j) {
      for (var i = minX; i < maxX; ++i) {
        if (i === x && j === y) {
          htmlMap += 'o';
        } else {
          htmlMap += world.roomSource.getRoomModel(i, j).typeIcon();
        }
      }

      htmlMap += '<br />';
    }

    return htmlMap;
  });

  const isPassable = room => {
    const type = room.type();
    if (type === 'water' || type === 'trench') {
      return false;
    }

    return true;
  };

  var lastMoveTime = 0;
  const moveDelay = 100;
  const move = (deltaX, deltaY) => {
    const now = Date.now();
    if (lastMoveTime + moveDelay > now) { return; }
    lastMoveTime = now;

    const destinationX = xPosition() + deltaX;
    const destinationY = yPosition() + deltaY;
    const destinationRoom = world.roomSource.getRoomModel(destinationX, destinationY);

    if (isPassable(destinationRoom)) {
      xPosition(destinationX);
      yPosition(destinationY);
    }
  };

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
    ko.applyBindings({
      currentRoom,
      map
    }, document.querySelector('body'));
  }, 100);
});
