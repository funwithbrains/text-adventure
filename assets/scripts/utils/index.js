define([
  './imports/index', './math', './strings', './functions'
], ({ _, ko, seedrandom, jQuery }, math, strings, functions) => {
  return {
    _,
    ko,
    seedrandom,
    jQuery,

    math,
    strings,
    functions
  };
});
