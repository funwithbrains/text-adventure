define([
  './lodash', './knockout', './seedrandom', 'jquery', './tone',
  './yaml'
  // YAML gets dumped into the global namespace,
  // but since it's temporary we'll leave it there.
], function (_, ko, seedrandom, jQuery, Tone) {
  return {
    _,
    ko,
    seedrandom,
    jQuery,
    Tone
  };
});
