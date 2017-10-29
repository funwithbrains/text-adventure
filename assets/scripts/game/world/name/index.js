define(['utils'], ({ _, seedrandom, string }) => {
  const { createMarkovGenerator, createBackOffGenerator } = string;
  
  // TODO get a proper name database and generate cultural contexts when making a faction's name generator
  const names = {
    myth: {
      roman: {
        genderedFemale: 'juno minerva tellus terra venus'.split(' '),
        genderedMale: 'janus jupiter neptune pluto ulysses'.split(' ')
      },
      greek: {
        genderedFemale: 'aphrodite athena gaea gaia hera'.split(' '),
        genderedMale: 'cronus hades hermes odysseus poseidon zeus'.split(' ')
      }
    },
    american: {
      genderedFemale: 'alexandra amanda amelia andrea angela ann annie becky beth betty betsy catharine catherine cathy cindy daisy danielle deborah delilah eliza elizabeth emilia emily emma erica eve francine guinevere gwen gwendolyn hanna hannah harriet helga hermione hilda irma jan jane janet janie jen jenifer jennifer jenny jill jillian kate katharine katherine kathy liz lizzie lisa lucy maria marie mary mindy molly mona morgana olivia pam pamela patty patricia peach rebekah rose rosalyn sally samantha samus sandra sara sarah scarlet silvia sophia sophie stephanie sylvia tina valerie vanessa zelda zoe'.split(' '),
      genderedMale: 'adam alexander allan angelo arthur benjamin bill brian cain dale dan daniel dave david donald donatello edgar eric ezekiel frank franklin fredrick gary george glen goliath hank harry james jeff jeffery jeffry jesus jim jimmy john ian kane kyle larry leon leonardo link lionel louis louie luigi lucifer mario martin matt mathew maximilian maxwell mercury michael michelangelo mickey micky mike mitchel morton murray ollie peter raphael raymond rob robby robert richard rick ryan samson samuel scott sean simon stanley steven ted teddy theodore thomas timmy timothy tom tony uranus victor wade waldo wayne william willy'.split(' '),
      genderedNeutral: 'alex beck dana morgan pat sam sammy'.split(' ')
    }
  };
  const peopleNames = _.flatten([
    names.myth.greek.genderedFemale,
    names.myth.greek.genderedMale,
    names.myth.roman.genderedFemale,
    names.myth.roman.genderedMale,
    names.american.genderedFemale,
    names.american.genderedMale,
    names.american.genderedNeutral
  ]);

  const peopleNameGenerator = createBackOffGenerator(peopleNames, 2, 4);

  const createSource = (worldConfig) => {
    // TODO allow multiple different generators for different cultural contexts
    const rng = new seedrandom(worldConfig.seed + 'name');
    const rootNames = [];
    for (let i = 0; i < 50; ++i) {
      rootNames.push(peopleNameGenerator.create(rng, 3, 12));
    }
    const localGenerator = createBackOffGenerator(rootNames, 2, 5);

    return {
      localGenerator,
      roll: (rng) => {
        return localGenerator.create(rng, 3, 12);
      },
      rollList: (rng, count) => {
        return localGenerator.createList(rng, 3, 12, count);
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
