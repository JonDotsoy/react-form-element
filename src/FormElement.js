const assign = require('lodash/assign')
const bind = require('lodash/bind')
const bindAll = require('lodash/bindAll')
const get = require('lodash/get')
const isArray = require('lodash/isArray')
const toPath = require('lodash/toPath')
const isFunction = require('lodash/isFunction')
const isSymbol = require('lodash/isSymbol')
const isObject = require('lodash/isObject')
const isNull = require('lodash/isNull')
const isString = require('lodash/isString')
const set = require('lodash/set')
const toString = require('lodash/toString')
const {WrapperUIEvents} = require('./WrapperUIEvents')
const React = require('react')

// const EventEmitter = require('events')
class FormElement extends React.Component {
  LoadGetValue () { return FormElement.LoadGetValue(this) }
  InvokeChange (optsArg, callbackArg) { return FormElement.InvokeChange(this, optsArg, callbackArg) }
  get value () { return this.LoadGetValue() }
  get values () { return this.LoadGetValue() }
}

/**
 * Load the value from Component.
 *
 * @param {Object} thisArg - Identify the object to work.
 */
FormElement.LoadGetValue = function (thisArg) {
  return isFunction(thisArg.getValue)
    ? thisArg.getValue()
    : isFunction(thisArg.getValues)
      ? thisArg.getValues()
      : get(thisArg, get(thisArg, ['FormElementDefaultPath'], ['state', 'value']), null)
}

/**
 * Update the current state by a event function, such as an `onChange`.
 *
 * @param {Object}   thisArg                              - Identify the object to work.
 * @param {Object}   [optsArg]                            - Options to Invoke the function.
 * @param {Object}   [optsArg.source='[0].target.value']  - Where the value comes from.
 * @param {Object}   [optsArg.path='state.value']         - Where to update the new value.
 * @param {*}        [optsArg.defaultValue=null]          - Value when you do not find any other value to set.
 * @param {Function} [callbackArg]                        - The Callback function.
 *
 * @return {Function} Function Callback
 */
FormElement.InvokeChange = function (thisArg, firstArg, secondArg) {
  /*
    Example Load Function:

    FormElement.InvokeChange(MyComponent)
    FormElement.InvokeChange(MyComponent, MyOpts)
    FormElement.InvokeChange(MyComponent, MyHandle)
    FormElement.InvokeChange(MyComponent, MyOpts, MyHandle)
  */
  let preOpts
  let callback
  let definedCallback = false

  if (isFunction(firstArg)) {
    definedCallback = true
    callback = firstArg
  } else {
    preOpts = (isArray(firstArg) || isString(firstArg))
      ? {path: firstArg}
      : (isObject(firstArg))
        ? firstArg
        : {}

    if (isFunction(secondArg)) {
      definedCallback = true
      callback = secondArg
    }
  }

  const opts = assign({
    source: [0, 'target', 'value'],
    path: get(thisArg, ['FormElementDefaultPath'], ['state', 'value']),
    pathState: [ 'state' ],
    defaultValue: null,
    callbackAfterSetState: false,
    updater: thisArg.setState,
    transform: null
  }, preOpts)

  function CallbackEvent (...eventArgs) {
    const runCallback = (definedCallback === true)
      ? bind(callback, thisArg, ...(WrapperUIEvents.parse(thisArg, ...eventArgs)))
      : null

    const sourceValue = get(eventArgs, opts.source, opts.defaultValue)
    const currentPathState = get(thisArg, opts.path, opts.defaultValue)

    const postThisArg = set(
      thisArg,
      opts.path,
      (
        isFunction(opts.transform)
          ? opts.transform(sourceValue)
          : sourceValue
      )
    )

    const currentState = get(postThisArg, opts.pathState, opts.defaultValue)

    if (isFunction(opts.updater)) {
      opts.updater.apply(
        postThisArg,
        [
          currentState,
          (
            (opts.callbackAfterSetState === true && definedCallback === true)
              ? runCallback
              : void (0)
          )
        ]
      )

      if (opts.callbackAfterSetState !== true && definedCallback === true) {
        runCallback()
      }
    } else if (definedCallback === true) {
      runCallback()
    }
  }

  return CallbackEvent
  return bind(CallbackEvent, thisArg)
}

const TYPE_FORM_ELEMENT = Symbol('Type Form Element')
const enrich = ['InvokeChange', 'transferDOMEvent']
const Invokers = {}

function GetValueLoader () {
  return FormElement.LoadGetValue(this)
}

const InstallValuePropertie = function (elementArg, optsArg) {
  const opts = assign({
    nameProperty: 'value',
    functionGetValue: 'getValue'
  }, optsArg || {})

  Object.defineProperty(elementArg, opts.nameProperty, {get: GetValueLoader})
}

Invokers.InvokeChange = FormElement.InvokeChange

FormElement.transferDOMEvent = (thisArg, ...partials) => Invokers.transferDOMEvent.apply(thisArg, partials)

Invokers.transferDOMEvent = function (propNameArg, optsArg) {
  if (!isString(propNameArg) && !isSymbol(propNameArg)) throw new TypeError('Prop Name Arg is not a String or a Symbol.')

  const opts = assign({
    pathProp: isArray(propNameArg) ? propNameArg : ['props', propNameArg],
    reberseArgs: false
  }, optsArg || {})

  const self = this
  const HandleEvent = get(this, opts.pathProp)
  const isValidHandleEvent = isFunction(HandleEvent)

  return function (...partials) {
    if (isValidHandleEvent) {
      // const newEvent = new WrapperUIEvents(self, toString(event.type) + 'Transfer', event)

      // const argsToHandleEvent = [newEvent, ...partials]
      const argsToHandleEvent = WrapperUIEvents.parse(self, ...partials)

      if (opts.reberseArgs === true) argsToHandleEvent.reverse()

      HandleEvent.apply(self, argsToHandleEvent)
    }
  }
}

FormElement.implement = function (elementArg, optsArg) {
  if (FormElement.isApplied(elementArg)) return void (0)

  const opts = assign({
    defineValue: true,
    defineAliasValue: true
  }, optsArg || {})

  enrich.forEach(function (invokerName) {
    elementArg[invokerName] = bind(FormElement[invokerName], elementArg, elementArg)
  })

  if (opts.defineValue === true) {
    InstallValuePropertie(elementArg)
    if (opts.defineAliasValue === true) {
      InstallValuePropertie(elementArg, {nameProperty: 'values'})
    }
  }

  Object.defineProperty(elementArg, TYPE_FORM_ELEMENT, {get: () => true})

  return elementArg
}

FormElement.isApplied = function (elementCompareArg) {
  return elementCompareArg[TYPE_FORM_ELEMENT] === true
}

exports = module.exports
exports.default = FormElement
exports.FormElement = FormElement
