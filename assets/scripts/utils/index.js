define([
  './imports/index',
  './math', './collection', './strings', './functions', './tune'
], (
  { _, ko, seedrandom, jQuery, Tone },
  math, collection, strings, functions, tune
) => {
  return {
    _,
    ko,
    seedrandom,
    jQuery,
    Tone,

    math,
    collection,
    strings,
    functions,
    tune
  };
});
