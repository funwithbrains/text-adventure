define([
  './imports/index',
  './math', './collection', './string', './functions', './tune'
], (
  { _, ko, seedrandom, jQuery, Tone },
  math, collection, string, functions, tune
) => {
  return {
    _,
    ko,
    seedrandom,
    jQuery,
    Tone,

    math,
    collection,
    string,
    functions,
    tune
  };
});
