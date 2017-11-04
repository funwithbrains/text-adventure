define([
  'utils',
  './name/index', './element/index', './race/index', './room/index', './faction/index'
], (
  { random },
  Name, Element, Race, Room, Faction
) => {
  window.Name = Name; // TEMP

  const create = (worldConfig) => {
    const worldRng = random.createSource(worldConfig.seed);

    const nameSystem = Name.createSystem({
      worldRng,
      worldConfig
    });
    const elementSystem = Element.createSystem({
      worldRng,
      worldConfig
    });
    const raceSystem = Race.createSystem({
      worldRng,
      worldConfig,
      elementSystem
    });
    const roomSource = Room.createSource({
      worldRng,
      worldConfig
    });
    const factionSystem = Faction.createSystem({
      worldRng,
      worldConfig,
      raceSystem
    });

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
