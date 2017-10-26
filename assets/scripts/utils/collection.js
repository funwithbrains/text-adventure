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

  const sample = (rng, items) => {
    return items[Math.floor(rng.quick() * items.length)];
  };

  const sampleRange = (rng, min, max) => min + Math.floor(rng.quick() * (max - min));

  const createArraySource = (strings, order) => {
    const beginnings = [];
    const table = {};
    strings.forEach(string => {
      beginnings.push(string.slice(0, order));
      const end = string.length - order;
      for (let i = 0; i < end; ++i) {
        const key = string.slice(i, i + order);
        if (!table[key]) {
          table[key] = [];
        }
        table[key].push(string[i + order]);
      }
    });

    return {
      strings,
      order,
      beginnings,
      table,
      create: (rng, minLength = 3, maxLength = 8) => {
        const length = sampleRange(rng, minLength, maxLength);
        let string = sample(rng, beginnings);
        while (string.length < length) {
          const items = table[string.slice(-order)];
          if (!items) { break; }

          string += sample(rng, items);
        }

        return string;
      }
    };
  };

  return {
    createWeightedSampler,
    createArraySource
  };
});
