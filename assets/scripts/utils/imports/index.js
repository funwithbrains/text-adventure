define([
  './lodash', './knockout', './seedrandom', 'jquery'
], function (_, ko, seedrandom, jQuery) {
  return {
    _: _,
    ko: ko,
    seedrandom: seedrandom,
    jQuery: jQuery
  };
});
