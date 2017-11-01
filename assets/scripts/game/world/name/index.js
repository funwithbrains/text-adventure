define(['utils', 'siteData'], ({ _, seedrandom, string }, siteData) => {
  const { toNameCase, createMarkovGenerator, createBackOffGenerator } = string;
  
  // TODO get a proper name database
  // TODO generate cultural contexts when making a faction's name generator
  const peopleNames = siteData.game.world.names.people;
  const peopleNameGenerator = createBackOffGenerator(peopleNames, 2, 4);

  const createSource = (worldConfig) => {
    // TODO allow multiple different generators for different cultural contexts
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

  return {
    peopleNameGenerator,
    createMarkovGenerator,
    peopleNames,
    createSource
  };
});
