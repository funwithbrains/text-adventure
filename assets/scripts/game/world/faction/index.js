define(['utils'], ({ _, seedrandom }) => {
  const createFaction = (rng, diversity, civility, raceSystem) => {
    // TODO select faction ideology based on diversity and civility
    const raceSampler = raceSystem.createSampler(civility);
    
    const races = _.range(diversity).map(() => {
      return raceSampler.sample(rng);
    });

    return {
      races
    };
  };

  const createSystem = (worldConfig, raceSystem) => {
    const rng = new seedrandom(worldConfig.seed + 'faction');
    const wilderness = createFaction(rng, 30, 0, raceSystem);

    const civilizationCount = 1 + Math.floor(rng.quick() * 10);
    const civilizations = _.range(civilizationCount).map(() => {
      const diversity = 1 + Math.floor(rng.quick() * 5); // TODO normalize
      return createFaction(rng, diversity, 100, raceSystem);
    });

    return {
      wilderness,
      civilizations
    };
  };

  return {
    createSystem
  };
});
