define(['./imports/index'], ({ seedrandom }) => {
  const interpolateLinear = (a, b, t) => a + t * (b - a);
  const interpolateCubic = (a, b, t) => a + (3 - 2 * t) * t * t * (b - a);

  const getRandom = (x, y, entropy) => {
      const rng = new seedrandom(x + '|' + y + '|' + entropy);
      return rng.quick();
  };

  var getSingleNoise = (x, y, entropy) => {
    const xInt = Math.floor(x);
    const yInt = Math.floor(y);
    const x0y0 = getRandom(xInt, yInt, entropy);
    const x1y0 = getRandom(xInt + 1, yInt, entropy);
    const x0y1 = getRandom(xInt, yInt + 1, entropy);
    const x1y1 = getRandom(xInt + 1, yInt + 1, entropy);

    const xt = x - xInt;
    const yt = y - yInt;

    return interpolateCubic(
      interpolateCubic(x0y0, x1y0, xt),
      interpolateCubic(x0y1, x1y1, xt),
      yt
    );
};

// noise algorithm based on techniques described at http://www.angelcode.com/dev/perlin/perlin.html

  const INTENSITY_SCALE = 32 / 63; // 2 ^ (n - 1) / (2 ^ n - 1) where n = 6
  const SCALE_0 = 1 / 32;
  const ENTROPY_0 = 'g;xa[[c53';
  const SCALE_1 = 1 / 16;
  const ENTROPY_1 = 'a2vap0vm54';
  const SCALE_2 = 1 / 8;
  const ENTROPY_2 = ' 8zs9nb6kts';
  const SCALE_3 = 1 / 4;
  const ENTROPY_3 = 'a203b=n.hj';
  const SCALE_4 = 1 / 2;
  const ENTROPY_4 = 'c2gc12hc4';
  const SCALE_5 = 1;
  const ENTROPY_5 = ']]8\ 8\ 5';

  const getNoiseField = (x, y, seed) => {
    return INTENSITY_SCALE * (
      getSingleNoise(x * SCALE_0, y * SCALE_0, seed + ENTROPY_0) +
      INTENSITY_SCALE * (
        getSingleNoise(x * SCALE_1, y * SCALE_1, seed + ENTROPY_1) +
        INTENSITY_SCALE * (
          getSingleNoise(x * SCALE_2, y * SCALE_2, seed + ENTROPY_2) +
          INTENSITY_SCALE * (
            getSingleNoise(x * SCALE_3, y * SCALE_3, seed + ENTROPY_3) +
            INTENSITY_SCALE * (
              getSingleNoise(x * SCALE_4, y * SCALE_4, seed + ENTROPY_4) +
              INTENSITY_SCALE * (
                getSingleNoise(x * SCALE_5, y * SCALE_5, seed + ENTROPY_5)
              )
            )
          )
        )
      )
    );
  };

  return {
    getRandom: getRandom,
    interpolateCubic: interpolateCubic,
    getSingleNoise: getSingleNoise,
    getNoiseField: getNoiseField
  };
});
