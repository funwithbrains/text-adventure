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

  return {
    distribution,

    createSource
  };
});