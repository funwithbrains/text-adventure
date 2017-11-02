define([
  'utils', 'siteData'
], (
  { _, random, collection }, siteData
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
    const seed = worldConfig.seed + 'element';
    const uniformRng = random.createSource(seed);
    const normalRng = random.createSource(seed, random.distribution.normal);

    const elementCount = normalRng.sampleIntRange(3, 8);
    const elementSampler = createElementSamplerBucket();

    const elementKeys = _.range(elementCount).map(() => {
      return elementSampler.sample(uniformRng).key;
    });
    const elementNames = elementKeys.map(key => elementNameSamplerMap[key].sample(uniformRng).name);

    // TODO preserve information about tendencies and opposites

    return {
      elementNames
    };
  };

  return {
    createSystem
  };
});
