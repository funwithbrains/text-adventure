define([
  'utils', './name/index', './race/index', './room/index', './faction/index'
], (
  utils, Name, Race, Room, Faction
) => {
  window.Name = Name; // TEMP

  const createWorld = (worldConfig) => {
    const nameSource = Name.createSource(worldConfig);
    const raceSystem = Race.createSystem(worldConfig);
    const roomSource = Room.createSource(worldConfig);
    const factionSystem = Faction.createSystem(worldConfig, raceSystem);

    // TODO
    // create World and WorldModel
    // create Layer and LayerModel
    // create Room and RoomModel
    // World has Layers which are lazily generated
    // Layer has Rooms which are generated at Layer creation time.

    return {
      nameSource,
      raceSystem,
      roomSource,
      factionSystem
    };
  };

  return {
    createWorld
  };
});
