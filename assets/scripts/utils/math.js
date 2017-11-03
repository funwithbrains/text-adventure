define(['./imports/index'], ({ seedrandom }) => {
  const clamp = (min, max, value) => {
    if (value < min) { return min; }
    if (value > max) { return max; }
    return value;
  };

  const interpolateLinear = (a, b, t) => a + t * (b - a);
  const interpolateCubic = (a, b, t) => a + (3 - 2 * t) * t * t * (b - a);

  return Object.freeze({
    clamp,

    interpolateLinear,
    interpolateCubic
  });
});
