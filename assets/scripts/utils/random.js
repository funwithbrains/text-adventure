define(['./imports/index', './math'], ({ seedrandom }, { interpolateCubic }) => {
  const getPureRandom = (x, y, entropy) => {
    const rng = new seedrandom(x + '|' + y + '|' + entropy);
    return rng.quick();
  };

  const getSimplePureNoiseField = (x, y, entropy) => {
    const xInt = Math.floor(x);
    const yInt = Math.floor(y);
    const x0y0 = getPureRandom(xInt, yInt, entropy);
    const x1y0 = getPureRandom(xInt + 1, yInt, entropy);
    const x0y1 = getPureRandom(xInt, yInt + 1, entropy);
    const x1y1 = getPureRandom(xInt + 1, yInt + 1, entropy);

    const xt = x - xInt;
    const yt = y - yInt;

    return interpolateCubic(
      interpolateCubic(x0y0, x1y0, xt),
      interpolateCubic(x0y1, x1y1, xt),
      yt
    );
  };

  // noise algorithm based on techniques described at http://www.angelcode.com/dev/perlin/perlin.html

  const INTENSITY_SCALE = 32 / 63; // 2 ^ (n - 1) / (2 ^ n - 1) where n = 6
  const SCALE_0 = 1 / 32;
  const ENTROPY_0 = 'g;xa[[c53';
  const SCALE_1 = 1 / 16;
  const ENTROPY_1 = 'a2vap0vm54';
  const SCALE_2 = 1 / 8;
  const ENTROPY_2 = ' 8zs9nb6kts';
  const SCALE_3 = 1 / 4;
  const ENTROPY_3 = 'a203b=n.hj';
  const SCALE_4 = 1 / 2;
  const ENTROPY_4 = 'c2gc12hc4';
  const SCALE_5 = 1;
  const ENTROPY_5 = ']]8\ 8\ 5';

  const getPureNoiseField = (x, y, seed) => {
    return INTENSITY_SCALE * (
      getSimplePureNoiseField(x * SCALE_0, y * SCALE_0, seed + ENTROPY_0) +
      INTENSITY_SCALE * (
        getSimplePureNoiseField(x * SCALE_1, y * SCALE_1, seed + ENTROPY_1) +
        INTENSITY_SCALE * (
          getSimplePureNoiseField(x * SCALE_2, y * SCALE_2, seed + ENTROPY_2) +
          INTENSITY_SCALE * (
            getSimplePureNoiseField(x * SCALE_3, y * SCALE_3, seed + ENTROPY_3) +
            INTENSITY_SCALE * (
              getSimplePureNoiseField(x * SCALE_4, y * SCALE_4, seed + ENTROPY_4) +
              INTENSITY_SCALE * (
                getSimplePureNoiseField(x * SCALE_5, y * SCALE_5, seed + ENTROPY_5)
              )
            )
          )
        )
      )
    );
  };

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

    const getNoiseField = (x, y) => getPureNoiseField(x, y, seed);
    
    return {
      sample,
      sampleRange,
      sampleIntRange,

      sampleList,

      getNoiseField,

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