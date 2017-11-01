define(['./imports/index'], ({ seedrandom }) => {
  const createSource = (seed) => {
    const rng = new seedrandom(seed);

    const createSubSource = (subSeed) =>  createSource(seed + subSeed);

    const sample = () => rng.double();
    const sampleRange = (a, b) => a + (b - a) * rng.double();
    const sampleIntRange = (a, b) => Math.floor(sampleRange(a, b));

    const sampleNormal = () => (
      rng.double() + rng.double() + rng.double() +
      rng.double() + rng.double() + rng.double()
    ) / 6;
    const sampleRangeNormal = (a, b) => a + (b - a) * sampleNormal();
    const sampleIntRangeNormal = (a, b) => Math.floor(sampleRangeNormal(a, b));

    const sampleList = (items) => {
      return items[Math.floor(sample() * items.length)];
    };
    
    return {
      sample,
      sampleRange,
      sampleIntRange,

      sampleNormal,
      sampleRangeNormal,
      sampleIntRangeNormal,

      sampleList,

      createSubSource
    };
  };

  return {
    createSource
  };
});