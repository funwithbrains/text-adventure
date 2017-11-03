define(['./imports/index'], ({ _ }) => {
  const mapRange = (start, end, f) => {
    const result = [];

    for (let i = start; i < end; ++i) {
      result.push(f(i));
    }

    return result;
  };

  const createLazyTable = (f) => {
    const table = {};

    return {
      get: (x, y) => {
        const key = x + '|' + y;
        if (!table[key]) {
          table[key] = f(x, y);
        }

        return table[key];
      }
    };
  };

  return {
    mapRange,
    createLazyTable
  };
});
