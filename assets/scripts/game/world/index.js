define(['utils', './roomSource/index'], (utils, roomSourceIndex) => {
  const createWorld = (seed) => {
    const roomSource = roomSourceIndex.createRoomSource(seed);

    // TODO
    // create World and WorldModel
    // create Layer and LayerModel
    // create Room and RoomModel
    // World has Layers which are lazily generated
    // Layer has Rooms which are generated at Layer creation time.

    return {
      roomSource
    };
  };

  return {
    createWorld
  };
});
