define([
  './imports/index',
  './math', './random', './collection', './string', './functions', './tune'
], (
  { _, ko, seedrandom, jQuery, Tone },
  math, random, collection, string, functions, tune
) => {
  return {
    _,
    ko,
    seedrandom,
    jQuery,
    Tone,

    math,
    random,
    collection,
    string,
    functions,
    tune
  };
});
