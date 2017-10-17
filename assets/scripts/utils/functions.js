define(['./imports/index'], (imports) => {
  var uninitialized = {}; /* A unique identity.*/
  var lazify = (f) => {
    var result = uninitialized;
    return () => {
      if (result === uninitialized) {
        result = f();
      }

      return result;
    };
  };

  return {
    lazify: lazify
  };
});
