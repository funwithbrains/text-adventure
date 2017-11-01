define(['utils', 'siteData'], ({ _, seedrandom, string }, siteData) => {
  const { toNameCase, createMarkovGenerator, createBackOffGenerator } = string;
  
  // TODO get a proper name database
  // TODO generate cultural contexts when making a faction's name generator
  const {
    places: placeNames,
    people: peopleNames
  } = siteData.game.world.names;
  const peopleNameGenerator = createBackOffGenerator(peopleNames, 2, 4);

  const createSystem = (worldConfig) => {
    const createPeopleNameSource = () => { // TODO take a faction config?
      const rng = new seedrandom(worldConfig.seed + 'name');
      
      const rootNames = [];
      for (let i = 0; i < 50; ++i) {
        rootNames.push(peopleNameGenerator.create(rng, 3, 12));
      }
      const localGenerator = createBackOffGenerator(rootNames, 2, 5);
  
      return {
        localGenerator,
        roll: (rng) => {
          return toNameCase(localGenerator.create(rng, 3, 12));
        },
        rollList: (rng, count) => {
          return localGenerator.createList(rng, 3, 12, count).map(toNameCase);
        }
      };
    };

    const createPlaceNameSource = () => {
      const localGenerator = createBackOffGenerator(placeNames, 2, 4);
      return {
        localGenerator,
        roll: (rng) => {
          return toNameCase(localGenerator.create(rng, 5, 12));
        },
        rollList: (rng, count) => {
          return localGenerator.createList(rng, 5, 12, count).map(toNameCase);
        }
      };
    };
  
    return {
      createPeopleNameSource,
      createPlaceNameSource
    };
  };

  return {
    peopleNameGenerator,
    createMarkovGenerator,
    peopleNames,
    createSystem
  };
});
