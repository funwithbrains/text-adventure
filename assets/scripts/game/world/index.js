define([
  'utils', './name/index', './element/index', './race/index', './room/index', './faction/index'
], (
  utils, Name, Element, Race, Room, Faction
) => {
  window.Name = Name; // TEMP

  const create = (worldConfig) => {
    const nameSystem = Name.createSystem(worldConfig);
    const elementSystem = Element.createSystem(worldConfig);
    const raceSystem = Race.createSystem(worldConfig, elementSystem);
    const roomSource = Room.createSource(worldConfig);
    const factionSystem = Faction.createSystem(worldConfig, raceSystem);

    // TODO
    // create World and WorldModel
    // create Layer and LayerModel
    // create Room and RoomModel
    // World has Layers which are lazily generated
    // Layer has Rooms which are generated at Layer creation time.

    return {
      nameSystem,
      elementSystem,
      raceSystem,
      roomSource,
      factionSystem
    };
  };

  return {
    create
  };
});
