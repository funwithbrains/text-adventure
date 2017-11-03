define(['./imports/index'], ({ _ }) => {

  const mapRange = (start, end, f) => {
    const result = [];

    for (let i = start; i < end; ++i) {
      result.push(f(i));
    }

    return result;
  };

  return {
    mapRange
  };
});
