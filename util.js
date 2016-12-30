/*
Utilities
*/
const assign = require('lodash/assign')
const isObject = require('lodash/isObject')
const isFunction = require('lodash/isFunction')

function ResolveOptions (optsArg, defaultOptions = {}) {
  return assign({}, (isObject(defaultOptions) ? defaultOptions : {}), (isObject(optsArg) ? optsArg : {}) )
}

function RecoverValues (thisArg, optsArg) {
  const opts = ResolveOptions(optsArg)
}

/* Alias RecoverValues to GetValue */
