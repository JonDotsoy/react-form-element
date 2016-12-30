const assign = require('lodash/assign')
const bind = require('lodash/bind')
const bindAll = require('lodash/bindAll')
const get = require('lodash/get')
const isArray = require('lodash/isArray')
const isFunction = require('lodash/isFunction')
const isNull = require('lodash/isNull')
const isString = require('lodash/isString')
const set = require('lodash/set')
const toString = require('lodash/toString')
const {WrapperUIEvents} = require('./WrapperUIEvents')

// const EventEmitter=require('events')
class FormElement {}

const TYPE_FORM_ELEMENT = Symbol('Type Form Element')
const enrich = ['invokeChange', 'transferDOMEvent']
const Invokers = {}

function GetValueLoader () {
  if (isFunction(this.getValue)) return this.getValue()
  else return get(this, ['state', 'value'], null)
}

const InstallValuePropertie = function (elementArg, optsArg) {
  const opts = assign({
    nameProperty: 'value',
    functionGetValue: 'getValue'
  }, optsArg || {})

  Object.defineProperty(elementArg, opts.nameProperty, {get: GetValueLoader})
}

FormElement.invokeChange = (thisArg, ...partials) => Invokers.invokeChange.apply(thisArg, partials)

Invokers.invokeChange = function (optsArg, callback) {
  optsArg = (isArray(optsArg) || isString(optsArg)) ? {path: optsArg} : optsArg

  const opts = assign({
    scope: null,
    path: ['value'],
    pathState: ['state'],
    pathValue: ['target', 'value'],
    argNumber: 0,
    defaultValue: null,
    callbackSetState: undefined,
    callbackAfter: false
  }, optsArg || {})

  const self = !isNull(opts.scope) ? opts.scope : this

  return function (...eventArgs) {
    const currentState = get(self, opts.pathState, {})
    const currentValueFromArg = get(eventArgs[opts.argNumber], opts.pathValue, opts.defaultValue)
    const updateStateState = set(currentState, opts.path, currentValueFromArg)

    self.setState(updateStateState, (...cbArgs) => {
      if (isFunction(opts.callbackSetState)) opts.callbackSetState.apply(null, cbArgs)
      if (opts.callbackAfter === true && isFunction(callback)) callback.apply(null, eventArgs)
    })

    if (opts.callbackAfter !== true && isFunction(callback)) callback.apply(null, eventArgs)
  }
}

FormElement.transferDOMEvent = (thisArg, ...partials) => Invokers.transferDOMEvent.apply(thisArg, partials)

Invokers.transferDOMEvent = function (propNameArg, optsArg) {
  const opts = assign({
    pathProp: isArray(propNameArg) ? propNameArg : ['props', propNameArg],
    reberseArgs: false
  }, optsArg || {})

  const self = this
  const HandleEvent = get(this, opts.pathProp)
  const isValidHandleEvent = isFunction(HandleEvent)

  return function (event, ...optionalOptions) {
    if (isValidHandleEvent) {
      const newEvent = new WrapperUIEvents(self, toString(event.type) + 'Transfer', event)

      const argsToHandleEvent = [newEvent, ...optionalOptions]

      if (opts.reberseArgs === true) argsToHandleEvent.reverse()

      HandleEvent.apply(self, argsToHandleEvent)
    }
  }
}

FormElement.apply = function (elementArg, optsArg) {
  if (FormElement.isApplied(elementArg)) return void(0)

  const opts = assign({
    defineValue: true,
    defineAliasValue: true
  }, optsArg || {})

  enrich.forEach(function (invokerName) {
    elementArg[invokerName] = bind(Invokers[invokerName], elementArg)
  })

  if (opts.defineValue === true) {
    InstallValuePropertie(elementArg)
    if (opts.defineAliasValue === true) {
      InstallValuePropertie(elementArg, {nameProperty: 'values'})
    }
  }

  Object.defineProperty(elementArg, TYPE_FORM_ELEMENT, {get: () => true})
}

FormElement.isApplied = function (elementCompareArg) {
  return elementCompareArg[TYPE_FORM_ELEMENT] === true
}

exports = module.exports
exports.default = FormElement
exports.FormElement = FormElement
