define(['utils', './world/index', './world/name/index'], ({ ko }, World, Name) => {
  const isPassable = room => {
    const { type } = room;
    if (type === 'water' || type === 'trench') {
      return false;
    }

    return true;
  };

  const create = () => {
    // TODO create MainMenu to encapsulate menu logic
    const mode = ko.observable('mainMenu');
    const startGameplay = () => {
      mode('gameplay');
    };

    const seed = ko.observable(Name.createRandomPlaceName());
    const world = ko.computed(() => {
      if (mode() !== 'gameplay') { return null; }

      return World.create({
        seed: seed()
      });
    });

    const position = ko.observable({ x: 0, y: 0 });
    var lastMoveTime = 0;
    const moveDelay = 100;
    const move = (deltaX, deltaY) => {
      const w = world();
      if (!w) { return; }

      const now = Date.now();
      if (lastMoveTime + moveDelay > now) { return; }
  
      const { x, y } = position();
      const destinationX = x + deltaX;
      const destinationY = y + deltaY;
      const destinationRoom = w.roomSource.getRoom(destinationX, destinationY);
  
      if (isPassable(destinationRoom)) {
        lastMoveTime = now;

        position({
          x: destinationX,
          y: destinationY
        });
      }
    };
  
    const currentRoom = ko.pureComputed(() => {
      const w = world();
      if (!w) { return null; }

      const { x, y } = position();
      return w.roomSource.getRoom(x, y);
    });

    const mapRange = 8;
    const map = ko.pureComputed(() => {
      const w = world();
      if (!w) { return null; }

      const { x, y } = position();
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
            htmlMap += w.roomSource.getRoom(i, j).typeIcon;
          }
        }
  
        htmlMap += '<br />';
      }
  
      return htmlMap;
    });

    return {
      mode,
      startGameplay,

      seed,
      world,
      map,
      move,
      currentRoom
    };
  };

  return {
    create
  };
});
