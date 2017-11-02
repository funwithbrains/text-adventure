define(['utils'], ({ _, random }) => {
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
    const seed = worldConfig.seed + 'faction';
    const uniformRng = random.createSource(seed);
    const normalRng = random.createSource(seed, random.distribution.normal);
    const wilderness = createFaction(uniformRng, 30, 0, raceSystem);

    const civilizationCount = normalRng.sampleIntRange(1, 10);
    const civilizations = _.range(civilizationCount).map(() => {
      const diversity = normalRng.sampleIntRange(1, 5);
      return createFaction(uniformRng, diversity, 100, raceSystem);
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
