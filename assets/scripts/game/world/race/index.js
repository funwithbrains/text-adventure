define(['utils', 'siteData'], ({ _, seedrandom }, siteData) => {
  const possibleRaces = siteData.game.world.races;
  const minimumFantasy = 0;
  const maximumFantasy = 100;

  const getSpread = (rng, min, max) => {
    const midpointBase = rng.double();
    const midpoint = midpointBase * midpointBase * (max - min);
    const radius = rng.double() * (max - min) * 0.75;
    return {
      min: Math.max(min, Math.floor(midpoint - radius)),
      max: Math.min(max, Math.floor(midpoint + radius))
    };
  };
  
  const createSource = world => {
    const { seed } = world;
    const rng = new seedrandom(seed);

    const {
      min: minFantasy,
      max: maxFantasy 
    } = getSpread(rng, minimumFantasy, maximumFantasy);

    const {
      races,
      totalWeight
    } = _.reduce(possibleRaces, (memo, properties, name) => {
      if (minFantasy <= properties.fantasy && properties.fantasy <= maxFantasy) {
        memo.races.push({ name, properties });
        memo.totalWeight += properties.weight;
      }
  
      return memo;
    }, {
      races: [],
      totalWeight: 0
    });

    const civilityDeviation = rng.double() * 20 - 10;
    
    const getOne = () => {
      const weightedPosition = rng.double() * totalWeight;
      let passedWeight = 0;
      for (let i = 0; i < races.length; ++i) {
        passedWeight += races[i].properties.weight;
        if (passedWeight > weightedPosition) {
          return races[i];
        }
      }

      throw new Error('The race weights are inconsistent.');
    };

    return {
      minFantasy,
      maxFantasy,
      races,
      getOne,
      createSource // TEMP
    };
  };

  return {
    createSource
  };
});
