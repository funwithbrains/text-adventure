define(['./imports/index', './math'], ({ _ }, { sample, sampleRange }) => {
  const createMarkovSource = (strings, order) => {
    const beginnings = [];
    const table = {};
    const endingTable = {};

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

      const endingKey = string.slice(-order - 1, -1);
      if (!endingTable[endingKey]) {
        endingTable[endingKey] = '';
      }
      endingTable[endingKey] += string[string.length - 1];
    });

    return {
      beginnings,
      table,
      endingTable
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

    const create = (rng, minLength, maxLength) => {
      const length = sampleRange(rng, minLength, maxLength);

      let order = minOrder;
      let string = sample(rng, sources[order - minOrder].beginnings);

      while (string.length < length) {
        const source = sources[order - minOrder];
        const key = string.slice(-order);

        if (length - string.length <= order && source.endingTable[key]) {
          string += sample(rng, source.endingTable[key]);
        } else {
          const items = source.table[key];
          if (items) {
            string += sample(rng, items);
            if (order < maxOrder) {
              order += 1;
            }
          } else {
            order -= 1;
            if (order < minOrder) { break; }
          }
        }
      }

      return string;
    };

    const createList = (rng, minLength, maxLength, count) => {
      return _.range(count).map(() => create(rng, minLength, maxLength));
    };

    return {
      strings,
      minOrder,
      maxOrder,
      sources,
      create,
      createList
    };
  };

  return {
    createMarkovGenerator,
    createBackOffGenerator
  };
});
