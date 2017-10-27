define(['utils'], (utils) => {
  const { _, ko, math, functions } = utils;
  const { lazify } = functions;

  const zoom = 8;
  const radius = 64;
  const radiusSquared = radius * radius;

  const getElevation = (x, y, seed) => {
    return math.getNoiseField(x * zoom, y * zoom, 'elevation' + seed) * (
      1 - (x*x + y*y) / radiusSquared
    );
  };

  const getTemperature = (x, y, seed, elevation) => {
    return ((1 - elevation) + 3 * math.getNoiseField(x, y, 'temperature' + seed)) / 4;
  };

  const getHumidity = (x, y, seed, elevation) => {
    return ((1 - elevation) + math.getNoiseField(x, y, 'humidity' + seed)) / 2;
  };

  const getFertility = (x, y, seed, elevation) => {
    return math.getNoiseField(x, y, 'fertility' + seed) / 2 + (0.5 - Math.abs(0.5 - elevation));
  };

  const getValue = (x, y, seed, elevation) => {
    return math.getNoiseField(x * zoom, y * zoom, 'value' + seed) / 2 + Math.abs(0.5 - elevation);
  };

  const getRoomType = (e, t, h) => {
    return e < 0.15 ? 'trench' : e < 0.3 ? 'water' : e < 0.60 ? 'land' : 'hill';
  };

  const typeIconMap = {
    'trench': 't',
    'water': '~',
    'land': '&nbsp;',
    'hill': 'h'
  };

  const createRoomModel = (x, y, roomState, worldConfig) => {
    const { seed } = worldConfig;

    const roomModel = {
      roomState,
      elevation: lazify(() => getElevation(x, y, seed)),
      temperature: lazify(() => getTemperature(x, y, seed, roomModel.elevation())),
      humidity: lazify(() => getHumidity(x, y, seed, roomModel.elevation())),
      fertility: lazify(() => getFertility(x, y, seed, roomModel.elevation())),
      value: lazify(() => getValue(x, y, seed, roomModel.elevation())),
      type: lazify(() => getRoomType(
        roomModel.elevation()//,
        //roomModel.temperature(),
        //roomModel.humidity()
      )),
      typeIcon: lazify(() => typeIconMap[roomModel.type()])
    };

    return roomModel;
  };

  return {
    createRoomModel
  };
});
