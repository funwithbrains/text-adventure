define(['./imports/index', './math'], ({ _ }, { sample, sampleRange }) => {
  const createMarkovSource = (strings, order) => {
    const beginnings = [];
    const table = {};

    strings.forEach(string => {
      beginnings.push(string.slice(0, order));
      const end = string.length - order;
      for (let i = 0; i < end; ++i) {
        const key = string.slice(i, i + order);
        if (!table[key]) {
          table[key] = '';
        }
        table[key] += string[i + order];
      }
    });

    return {
      beginnings,
      table
    };
  };

  const createMarkovGenerator = (strings, order) => {
    const { beginnings, table } = createMarkovSource(strings, order);

    return {
      strings,
      order,
      beginnings,
      table,
      create: (rng, minLength, maxLength) => {
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

  const createBackOffGenerator = (strings, minOrder, maxOrder) => {
    const sources = _.range(minOrder, maxOrder + 1).map(order => {
      return createMarkovSource(strings, order);
    });

    return {
      strings,
      minOrder,
      maxOrder,
      sources,
      create: (rng, minLength, maxLength) => {
        const length = sampleRange(rng, minLength, maxLength);

        let order = sampleRange(rng, minOrder, maxOrder);
        let string = sample(rng, sources[order - minOrder].beginnings);
        while (string.length < length) {
          const items = sources[order - minOrder].table[string.slice(-order)];
          if (!items) {
            order -= 1;
            if (order < minOrder) { break; }

            continue;
          }

          string += sample(rng, items);
          if (order < maxOrder) {
            order += 1;
          }
        }

        return string;
      }
    };
  };

  return {
    createMarkovGenerator,
    createBackOffGenerator
  };
});
