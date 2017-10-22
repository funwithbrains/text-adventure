define([
  'utils', './name/index', './race/index', './room/index'
], (
  utils, Name, Race, Room
) => {
  window.Name = Name; // TEMP

  const createWorld = (worldConfig) => {
    const nameSource = Name.createSource(worldConfig);
    const raceSource = Race.createSource(worldConfig);
    const roomSource = Room.createSource(worldConfig);

    // TODO
    // create World and WorldModel
    // create Layer and LayerModel
    // create Room and RoomModel
    // World has Layers which are lazily generated
    // Layer has Rooms which are generated at Layer creation time.

    return {
      nameSource,
      raceSource,
      roomSource
    };
  };

  return {
    createWorld
  };
});
