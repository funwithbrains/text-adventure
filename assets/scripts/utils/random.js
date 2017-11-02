define(['./imports/index'], ({ seedrandom }) => {
  const distribution = {
    uniform: rng => rng.double(),
    semiNormal: rng => (rng.double() + rng.double() + rng.double()) / 3,
    normal: rng => (
      rng.double() + rng.double() + rng.double() +
      rng.double() + rng.double() + rng.double()
    ) / 6
  };

  const createSource = (seed, dist = distribution.uniform) => {
    const rng = new seedrandom(seed);

    const createSubSource = (subSeed, subDist = dist) => {
      return createSource(seed + subSeed, subDist);
    };

    const sample = () => dist(rng);
    const sampleRange = (a, b) => a + (b - a) * sample();
    const sampleIntRange = (a, b) => Math.floor(sampleRange(a, b));

    const sampleList = (items) => {
      return items[Math.floor(sample() * items.length)];
    };
    
    return {
      sample,
      sampleRange,
      sampleIntRange,

      sampleList,

      createSubSource
    };
  };

  // TODO consider using tree structures if we ever need faster weighted sampling

  const computeTotalWeight = (items) => {
    let totalWeight = 0;

    for (let i = 0; i < items.length; ++i) {
      totalWeight += items[i].weight;
    }

    return totalWeight;
  };

  const createWeightedSampler = (items) => {
    if (items.length === 0) {
      return { sample: () => null };
    }

    const totalWeight = computeTotalWeight(items);

    return {
      sample: (rng) => {
        const weightedPosition = rng.sample() * totalWeight;
        let passedWeight = 0;
        for (let i = 0; i < items.length; ++i) {
          passedWeight += items[i].weight;
          if (passedWeight > weightedPosition) {
            return items[i];
          }
        }

        return null;
      }
    };
  };

  // "bucket" is meant to indicate that each item is removed when it is retrieved
  const createWeightedSamplerBucket = (items) => {
    if (items.length === 0) {
      return { sample: () => null };
    }

    items = items.slice(); // clone items because we're going to mutate it

    let totalWeight = computeTotalWeight(items);

    return {
      sample: (rng) => {
        const weightedPosition = rng.sample() * totalWeight;
        let passedWeight = 0;
        for (let i = 0; i < items.length; ++i) {
          passedWeight += items[i].weight;
          if (passedWeight > weightedPosition) {
            const result = items.splice(i, 1)[0];
            totalWeight -= result.weight;
            return result;
          }
        }

        return null;
      }
    };
  };

  return {
    distribution,

    createSource,

    createWeightedSampler,
    createWeightedSamplerBucket
  };
});