const debug = require('debug')

const expect = require('expect.js')
const isObject = require('lodash/isObject')
const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const set = require('lodash/set')
const get = require('lodash/get')
const assign = require('lodash/assign')
const isFunction = require('lodash/isFunction')

// debug.enable('MyCustomMyComponent')
// debug.enable('MyCustomMyComponent:constructor')
// debug.enable('MyCustomMyComponent:state')

const logMyCustomMyComponent = debug('MyCustomMyComponent')
const logMyCustomMyComponentConstructor = debug('MyCustomMyComponent:constructor')
const logMyCustomMyComponentCurrentState = debug('MyCustomMyComponent:state')

class MyCustomMyComponent {
  constructor (InitialState, pathExpectValue = ['state', 'value'], valueExpect, doneCallback) {
    logMyCustomMyComponent(`Making custom component`)

    if (!isObject(InitialState)) throw new TypeError(`Failed to construct 'MyCustomMyComponent': parameter 1 ('InitialState') is not an object.`)
    if (!(isArray(pathExpectValue) || isString(pathExpectValue))) throw new TypeError(`Failed to construct 'MyCustomMyComponent': parameter 2 ('pathExpectValue') is not an array or an string.`)
    // if (!isFunction(doneCallback)) throw new TypeError(`Failed to construct 'MyCustomMyComponent': parameter 4 ('doneCallback') is not an function.`)

    this.state = InitialState
    this.pathExpectValue = pathExpectValue
    this.valueExpect = valueExpect
    this.doneCallback = doneCallback

    logMyCustomMyComponentCurrentState(`Current State`)
    logMyCustomMyComponentCurrentState(this.state)
  }
  setState (newState, cb) {
    this.state = assign(this.state, newState)
    // this.doneCallback()

    logMyCustomMyComponentCurrentState(`Setter new state`)
    logMyCustomMyComponentCurrentState(this.state)

    expect(get(this, this.pathExpectValue)).to.be(this.valueExpect)

    if (isFunction(cb)) {
      logMyCustomMyComponent('Load callback by setState')
      cb()
    }

    logMyCustomMyComponent('End')
    if (isFunction(this.doneCallback)) {
      logMyCustomMyComponent('Load callback by component')
      this.doneCallback()
    }
  }
}

// debug.enable('MyCustomEventTOInputFormElement')
// debug.enable('MyCustomEventTOInputFormElement:constructor')

const LogMyCustomEventTOInputFormElement = debug('MyCustomEventTOInputFormElement')
const LogMyCustomEventTOInputFormElementConstructor = debug('MyCustomEventTOInputFormElement:constructor')

class MyCustomEventTOInputFormElement {
  constructor(typeEvent, value) {
    LogMyCustomEventTOInputFormElement(`Making Custom Event`)
    if (!isString(typeEvent)) throw new TypeError(`Failed to construct 'MyCustomEventChange': parameter 1 ('typeEvent') is not an string.`)

    this.typeEvent = typeEvent
    this.type = typeEvent
    set(this, ['target', 'value'], value)

    LogMyCustomEventTOInputFormElement(`Load new target value`)
    LogMyCustomEventTOInputFormElement(this)
  }
}

exports = module.exports
exports.MyCustomMyComponent = MyCustomMyComponent
exports.MyCustomEventTOInputFormElement = MyCustomEventTOInputFormElement
