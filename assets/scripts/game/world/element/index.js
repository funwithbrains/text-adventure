define([
  'utils', 'siteData'
], (
  { _, seedrandom, collection }, siteData
) => {
  const elementConfigs = siteData.game.world.elements;
  const { createWeightedSampler, createWeightedSamplerBucket } = collection;

  const createElementSamplerBucket = () => {
    return createWeightedSamplerBucket(elementConfigs);
  };
  const elementNameSamplerMap = elementConfigs.reduce((memo, elementConfig) => {
    memo[elementConfig.key] = createWeightedSampler(elementConfig.names);
    return memo;
  }, {});

  const createSystem = (worldConfig) => {
    const rng = new seedrandom(worldConfig.seed + 'element');

    const elementCount = Math.floor(3 + rng.quick() * 5);
    const elementSampler = createElementSamplerBucket();

    const elementKeys = _.range(elementCount).map(() => {
      return elementSampler.sample(rng).key;
    });
    const elementNames = elementKeys.map(key => elementNameSamplerMap[key].sample(rng).name);

    // TODO preserve information about tendencies and opposites

    return {
      elementNames
    };
  };

  return {
    createSystem
  };
});
