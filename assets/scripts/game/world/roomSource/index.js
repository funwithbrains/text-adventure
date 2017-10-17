define(['utils', './roomModel'], (utils, { createRoomModel }) => {
  const { _, ko, math, jQuery } = utils;

  const createRoomSource = (seed) => {
    const savedRoomModels = {};
    const getRoomModel = (x, y) => {
      // TODO load from long-saved data
      const roomIndex = x + ',' + y;
      const savedRoomModel = savedRoomModels[roomIndex];
      if (savedRoomModel) {
        return savedRoomModel;
      }
  
      return (
        savedRoomModels[roomIndex] = createRoomModel(x, y, {})
      );
    };

    return {
      getRoomModel
    };
  };

  return {
    createRoomSource
  };
});
