define([
  'utils', 'siteData'
], (
  { _, random, collection }, siteData
) => {
  const elementConfigs = siteData.game.world.elements;
  const { createWeightedSampler, createWeightedSamplerBucket } = random;

  const createElementSamplerBucket = () => {
    return createWeightedSamplerBucket(elementConfigs);
  };
  const elementNameSamplerMap = elementConfigs.reduce((memo, elementConfig) => {
    memo[elementConfig.key] = createWeightedSampler(elementConfig.names);
    return memo;
  }, {});

  const createSystem = ({
    worldRng,
    worldConfig
  }) => {
    const uniformRng = worldRng.createSubSource('elementUniform');
    const normalRng = worldRng.createSubSource('elementNormal', random.distribution.normal);

    const elementCount = normalRng.sampleIntRange(3, 8);
    const elementSampler = createElementSamplerBucket();

    const elementKeys = collection.mapRange(0, elementCount, () => {
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
