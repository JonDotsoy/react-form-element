const isObject = require('lodash/isObject')
const isFunction = require('lodash/isFunction')
const isString = require('lodash/isString')

/**
 * Simulate UI Event
 * REF: https://www.w3.org/TR/uievents/
 */
const TYPE = Symbol('type')
const TARGET = Symbol('target')
const SUPEREVENT = Symbol('superEvent')

// const NONE = 0
// const CAPTURING_PHASE = 1
// const AT_TARGET = 2
// const BUBBLING_PHASE = 3

const PropertiesInspectEventAlias = [
  ['type', 'typeEvent'],
  ['target', 'targetEvent']
]

const PropertiesInspectEvent = [
  'currentTarget',
  'eventPhase',
  'bubbles',
  'cancelable',
  'defaultPrevented',
  'composed',
  'isTrusted',
  'timeStamp',
  'composedPath',
  'stopPropagation',
  'stopImmediatePropagation',
  'preventDefault'
]

function WrapperUIEvents (thisArg, typeArg, superEventArg) {
  if (!(this instanceof WrapperUIEvents)) return new WrapperUIEvents(thisArg, typeArg, superEventArg)

  if (!isObject(thisArg)) throw new TypeError('Failed to constructor \'WrapperUIEvents\': parameter 1 (\'thisArg\') is not a object.')
  if (!isString(typeArg)) throw new TypeError('Failed to constructor \'WrapperUIEvents\': parameter 2 (\'typeArg\') is not a string.')

  this[TYPE] = typeArg
  this[Symbol.toStringTag] = 'WrapperUIEvents(' + typeArg + ')'
  this[TARGET] = thisArg
  this[SUPEREVENT] = superEventArg

  if (isObject(superEventArg)) {
    PropertiesInspectEvent.forEach((propName) => {
      if ((propName in superEventArg)) {
        const description = {}

        if (isFunction(superEventArg[propName])) {
          description.get = () => superEventArg[propName].bind(superEventArg)
        } else {
          description.get = () => superEventArg[propName]
        }

        Object.defineProperty(this, propName, description)
      }
    })

    PropertiesInspectEventAlias.forEach(([propName, propAliasName]) => {
      if ((propName in superEventArg)) {
        const description = {}

        if (isFunction(superEventArg[propName])) {
          description.get = () => superEventArg[propName].bind(superEventArg)
        } else {
          description.get = () => superEventArg[propName]
        }

        Object.defineProperty(this, propAliasName, description)
      }
    })
  }

  Object.defineProperty(this, 'type', {
    get: () => this[TYPE]
  })

  Object.defineProperty(this, 'target', {
    get: () => this[TARGET]
  })

  Object.defineProperty(this, 'superEvent', {
    get: () => this[SUPEREVENT]
  })

  this.toString = Object.prototype.toString.bind(this)
}

// WrapperUIEvents.NONE = NONE
// WrapperUIEvents.CAPTURING_PHASE = CAPTURING_PHASE
// WrapperUIEvents.AT_TARGET = AT_TARGET
// WrapperUIEvents.BUBBLING_PHASE = BUBBLING_PHASE

exports = module.exports
exports.default = WrapperUIEvents
exports.WrapperUIEvents = WrapperUIEvents
