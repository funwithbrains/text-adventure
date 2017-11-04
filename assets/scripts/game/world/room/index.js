define(['utils'], ({ _, random, collection }) => {
  const { createLazyTable } = collection;

  const typeIconMap = Object.freeze({
    'water': '~',
    'land': '&nbsp;',
    'hill': 'h'
  });

  const zoom = 16;
  const radius = 32;
  const radiusSquared = radius * radius;

  const computeElevation = (rng, x, y) => {
    return rng.createSubSource('elevation').getNoiseField(x * zoom, y * zoom) * (
      1 - (x*x + y*y) / radiusSquared
    );
  };

  const computeTemperature = (rng, x, y, elevation) => {
    return (
      (1 - elevation) + 3 * rng.createSubSource('temperature').getNoiseField(x, y)
    ) / 4;
  };

  const computeHumidity = (rng, x, y, elevation) => {
    return (
      (1 - elevation) + rng.createSubSource('humidity').getNoiseField(x, y)
    ) / 2;
  };

  const computeRoomType = (e, t, h) => {
    return e < 0.3 ? 'water' : e < 0.60 ? 'land' : 'hill';
  };

  const createRoom = (rng, x, y) => {
    const elevation = computeElevation(rng, x, y);
    const temperature = computeTemperature(rng, x, y, elevation);
    const humidity = computeHumidity(rng, x, y, elevation);
    const type = computeRoomType(elevation); // TODO temperature & humidity
    const typeIcon = typeIconMap[type];

    return {
      elevation,
      temperature,
      humidity,
      type,
      typeIcon
    };
  };

  const createSource = ({
    worldRng,
    worldConfig
  }) => {
    const rng = worldRng.createSubSource('room');
    const roomTable = createLazyTable((x, y) => createRoom(rng, x, y));

    const getRoom = roomTable.get;

    return {
      getRoom
    };
  };

  return {
    createSource
  };
});
