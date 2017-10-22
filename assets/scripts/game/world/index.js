define(['utils', './race/index', './roomSource/index'], (utils, Race, roomSourceIndex) => {
  const createWorld = (seed) => {
    const world = { seed };

    const raceSource = Race.createSource(world);
    const roomSource = roomSourceIndex.createRoomSource(seed);

    // TODO
    // create World and WorldModel
    // create Layer and LayerModel
    // create Room and RoomModel
    // World has Layers which are lazily generated
    // Layer has Rooms which are generated at Layer creation time.

    world.raceSource = raceSource;
    world.roomSource = roomSource;

    return world;
  };

  return {
    createWorld
  };
});
