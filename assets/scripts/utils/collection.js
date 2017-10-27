define(['./imports/index'], ({ _ }) => {
  const createWeightedSampler = (items) => {
    if (items.length === 0) {
      throw new Error('A sampler cannot be created from an empty array.');
    }

    let totalWeight = 0;
    for (let i = 0; i < items.length; ++i) {
      totalWeight += items[i].weight;
    }

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

        throw new Error('The weights are inconsistent.');
      }
    };
  };

  return {
    createWeightedSampler
  };
});
