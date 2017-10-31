define(['./imports/index'], ({ _ }) => {
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
        const weightedPosition = rng.double() * totalWeight;
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
        const weightedPosition = rng.double() * totalWeight;
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
    createWeightedSampler,
    createWeightedSamplerBucket
  };
});
