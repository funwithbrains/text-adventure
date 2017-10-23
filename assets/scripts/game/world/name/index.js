define(['utils'], ({ _, seedrandom }) => {
  const peopleNames = 'adam,alex,alexander,alexandra,allan,amanda,amelia,andrea,angelo,ann,annie,arthur,athena,beck,becky,beth,betty,betsy,benjamin,bill,brian,cain,catherine,cindy,cronus,dan,dana,daniel,danielle,dave,david,deborah,delilah,donald,donatello,edgar,eliza,elizabeth,eric,erica,eve,ezekiel,francine,frank,franklin,fredrick,gaia,gary,george,glen,goliath,guinevere,gwen,gwendolyn,hades,hank,harriet,harry,hera,hermes,hermione,james,jan,jane,janet,janie,janus,jeff,jeffery,jeffry,jen,jenny,jesus,jill,jillian,jim,jimmy,john,juno,ian,irma,kane,kyle,larry,leon,leonardo,link,liz,lizzie,lisa,lionel,louis,louie,luigi,lucifer,lucy,maria,marie,mario,martin,mary,matt,mathew,maximilian,maxwell,mercury,michael,michelangelo,mickey,micky,mike,minerva,mindy,mitchel,mona,morgan,morgana,murray,neptune,olivia,ollie,pam,pamela,pat,patty,patricia,peach,peter,pluto,poseidon,raphael,raymond,rebekah,rose,rosalyn,ryan,sally,samantha,samson,samuel,samus,sandra,sarah,scarlet,scott,sean,silvia,simon,sophia,sophie,stanley,stephanie,steven,sylvia,ted,teddy,theodore,thomas,timmy,timothy,tom,tony,uranus,valerie,vanessa,victor,wade,waldo,wayne,william,willy,zelda,zeus'.split(',');

  const sample = (rng, items) => {
    return items[Math.floor(rng.quick() * items.length)];
  };

  const sampleRange = (rng, min, max) => min + Math.floor(rng.quick() * (max - min));

  const createMarkovGenerator = (strings, order) => {
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

  const peopleNameGenerator = createMarkovGenerator(peopleNames, 2);

  const createSource = (worldConfig) => {
    // TODO allow multiple different generators for different cultural contexts
    const rng = new seedrandom(worldConfig.seed + 'name');
    const rootNames = [];
    for (let i = 0; i < 32; ++i) {
      rootNames.push(peopleNameGenerator.create(rng, 5, 12));
    }
    const localGenerator = createMarkovGenerator(rootNames, 2);

    return {
      localGenerator,
      roll: () => { // TODO seed this directly for determinism
        return localGenerator.create(rng);
      },
      rollList: () => { // TODO seed this directly for determinism
        return _.range(32).map(() => localGenerator.create(rng));
      }
    };
  };

  return {
    peopleNameGenerator,
    createMarkovGenerator,
    peopleNames,
    createSource
  };
});
