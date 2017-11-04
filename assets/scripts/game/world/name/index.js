define(['utils', 'siteData'], ({ _, random, string }, siteData) => {
  const { toNameCase, createBackOffGenerator } = string;
  
  // TODO get a proper name database
  // TODO generate cultural contexts when making a faction's name generator
  const {
    places: placeNames,
    people: peopleNames
  } = siteData.game.world.names;
  const placeNameGenerator = createBackOffGenerator(placeNames, 2, 4);
  const peopleNameGenerator = createBackOffGenerator(peopleNames, 2, 4);

  const placeNameLengthMinimum = 5;
  const placeNameLengthMaximum = 12;

  const peopleNameLengthMinimum = 3;
  const peopleNameLengthMaximum = 12;
  
  const createRandomPlaceName = () => {
    const rng = random.createSource();
    return toNameCase(
      placeNameGenerator.create(rng, placeNameLengthMinimum, placeNameLengthMaximum)
    );
  };

  const createSystem = ({
    worldRng,
    worldConfig
  }) => {
    const createPeopleNameSource = () => { // TODO take a faction config?
      const rng = worldRng.createSubSource('namePeople');
      
      const rootNames = [];
      for (let i = 0; i < 50; ++i) {
        rootNames.push(
          peopleNameGenerator.create(rng, peopleNameLengthMinimum, peopleNameLengthMaximum)
        );
      }

      const localGenerator = createBackOffGenerator(rootNames, 2, 5);

      return {
        localGenerator,
        roll: (rng) => {
          return toNameCase(localGenerator.create(rng, peopleNameLengthMinimum, peopleNameLengthMaximum));
        },
        rollList: (rng, count) => {
          return localGenerator.createList(rng, peopleNameLengthMinimum, peopleNameLengthMaximum, count).map(toNameCase);
        }
      };
    };

    const createPlaceNameSource = () => { // TODO take a faction config?
      const rng = worldRng.createSubSource('namePlace');
      
      const rootNames = [];
      for (let i = 0; i < 50; ++i) {
        rootNames.push(placeNameGenerator.create(rng, placeNameLengthMinimum, placeNameLengthMaximum));
      }
      const localGenerator = createBackOffGenerator(rootNames, 2, 5);

      return {
        localGenerator,
        roll: (rng) => {
          return toNameCase(
            localGenerator.create(rng, placeNameLengthMinimum, placeNameLengthMaximum)
          );
        },
        rollList: (rng, count) => {
          return localGenerator.createList(
            rng, placeNameLengthMinimum, placeNameLengthMaximum, count
          ).map(toNameCase);
        }
      };
    };

    return {
      createPeopleNameSource,
      createPlaceNameSource
    };
  };

  return {
    placeNameGenerator,
    peopleNameGenerator,

    placeNames,
    peopleNames,

    createRandomPlaceName,
    createSystem
  };
});
