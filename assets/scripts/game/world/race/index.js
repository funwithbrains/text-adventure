define(['utils', 'siteData'], ({ _, math, random, string }, siteData) => {
  const { toNameCase } = string;

  const possibleRaces = _.map(siteData.game.world.races, ({
    weight,
    fantasy,
    civility
  }, name) => {
    return { name, weight, fantasy, civility };
  });
  const fullSampler = random.createWeightedSampler(possibleRaces);
  
  const finalizeRaceName = (rng, name, elementSystem) => {
    return name.replace(/#\{race\}/g, match => {
      return finalizeRaceName(rng, fullSampler.sample(rng).name, elementSystem);
    }).replace(/#\{element\}/g, match => {
      return rng.sampleList(elementSystem.elementNames);
    });
  };

  const minimumFantasy = 0;
  const maximumFantasy = 100;
  const minimumCivility = 0;
  const maximumCivility = 100;

  const rollSpread = (rng, min, max) => {
    const midpointBase = rng.sample();
    const midpoint = midpointBase * midpointBase * (max - min);
    const radius = rng.sampleIntRange(min, max) * 0.75;
    return {
      min: Math.max(min, Math.floor(midpoint - radius)),
      max: Math.min(max, Math.floor(midpoint + radius))
    };
  };
  
  const createSystem = (worldConfig, elementSystem) => {
    const rng = random.createSource(worldConfig.seed + 'race', random.distribution.normal);

    const {
      min: minFantasy,
      max: maxFantasy 
    } = rollSpread(rng, minimumFantasy, maximumFantasy);

    const civilityDeviation = rng.sampleRange(minimumCivility, maximumCivility);

    const races = possibleRaces.filter(race => {
      return minFantasy <= race.fantasy && race.fantasy <= maxFantasy;
    });

    const minCivility = races.reduce((memo, race) => {
      return memo < race.civility ? memo : race.civility;
    }, maximumCivility);
    const maxCivility = races.reduce((memo, race) => {
      return memo > race.civility ? memo : race.civility;
    }, minimumCivility);
    
    const createSamplerBucket = (civility) => {
      civility = math.clamp(minCivility, maxCivility, civility);
      const allowedRaces = races.filter(race => {
        return Math.abs(race.civility - civility) < civilityDeviation;
      });

      const localSampler = random.createWeightedSamplerBucket(allowedRaces);

      return {
        sample: (rng) => {
          // TODO get other properties, not just name
          const race = localSampler.sample(rng);
          if (!race) { return null; }

          return toNameCase(finalizeRaceName(rng, race.name, elementSystem));
        }
      };
    };

    return {
      minFantasy,
      maxFantasy,
      races,
      createSamplerBucket
    };
  };

  return {
    createSystem
  };
});
