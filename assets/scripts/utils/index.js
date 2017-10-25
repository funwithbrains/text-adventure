define([
  './imports/index', './math', './strings', './functions', './tune'
], ({ _, ko, seedrandom, jQuery, Tone }, math, strings, functions, tune) => {
  return {
    _,
    ko,
    seedrandom,
    jQuery,
    Tone,

    math,
    strings,
    functions,
    tune
  };
});
