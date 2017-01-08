const debug = require('debug')

/* global it describe */
const sample = require('lodash/sample')
const expect = require('expect.js')
const get = require('lodash/get')
const set = require('lodash/set')
const isObject = require('lodash/isObject')
const isArray = require('lodash/isArray')
const assign = require('lodash/assign')
const isUndefined = require('lodash/isUndefined')
const isString = require('lodash/isString')
const isFunction = require('lodash/isFunction')
const chance = new (require('chance'))()
const FormElement = require('..').FormElement
const WrapperUIEvents = require('../WrapperUIEvents').WrapperUIEvents

const {MyCustomMyComponent, MyCustomEventTOInputFormElement} = require('./Util')

describe('FormElement', () => {
  describe('FormElement.InvokeChange', () => {
    it('Run InvokeChange(MyComponent)', (done) => {
      const d100 = chance.d100()
      const MyComponent = new MyCustomMyComponent({value:null}, void(0), d100, done)
      const MyEvent = new MyCustomEventTOInputFormElement('change', d100)

      FormElement.InvokeChange(MyComponent)(MyEvent)
    })

    it('Run InvokeChange(MyComponent, MyOpts = {path: [\'state\', \'value\', \'names\']})', (done) => {
      const name = chance.name()
      const MyComponent = new MyCustomMyComponent({value: {names: null}}, ['state', 'value', 'names'], name, done)
      const MyEventChange = new MyCustomEventTOInputFormElement('change', name)

      FormElement.InvokeChange(MyComponent, {path: ['state', 'value', 'names']})(MyEventChange)
    })

    it('Run InvokeChange(MyComponent, MyOpts = {path: \'state.value.names\'})', (done) => {
      const name = chance.name()
      const MyComponent = new MyCustomMyComponent({value: null}, ['state', 'value', 'names'], name, done)
      const MyEventChange = new MyCustomEventTOInputFormElement('change', name)

      FormElement.InvokeChange(MyComponent, {path: 'state.value.names'})(MyEventChange)
    })

    it('Run InvokeChange(MyComponent, callback)', (done) => {
      const name = chance.name()
      const MyComponent = new MyCustomMyComponent({value: null}, ['state', 'value'], name, void(0))
      const MyEventChange = new MyCustomEventTOInputFormElement('change', name)

      FormElement.InvokeChange(MyComponent, function (event) {
        expect(MyComponent.state.value).to.be(name)

        expect(event.target).to.be(MyComponent)
        expect(event).to.be.an(WrapperUIEvents)

        expect(this).to.be(MyComponent)
        expect(this).to.be.an(MyCustomMyComponent)

        done()
      })(MyEventChange)
    })

    it('Run InvokeChange(MyComponent, MyOpts = {path: \'state.value.firstName\'}, callback)', (done) => {
      const firstName = chance.first()
      const MyOpts = {
        path: 'state.value.firstName'
      }
      const MyComponent = new MyCustomMyComponent({value:{firstName: ''}}, ['state', 'value', 'firstName'], firstName, void(0))
      const MyEventChange = new MyCustomEventTOInputFormElement('change', firstName)

      FormElement.InvokeChange(MyComponent, MyOpts, function (event) {
        expect(MyComponent.state.value.firstName).to.be(firstName)

        expect(event.target).to.be(MyComponent)
        expect(event).to.be.an(WrapperUIEvents)

        expect(this).to.be(MyComponent)
        expect(this).to.be.an(MyCustomMyComponent)

        done()
      })(MyEventChange)
    })

  })

  describe('FormElement.LoadGetValue', () => {

    it('Run LoadGetValue(Component: {getValue()})', () => {
      const name = chance.name()

      const MyComponent = {
        getValue: () => name
      }

      expect(FormElement.LoadGetValue(MyComponent)).to.be(name)
    })

    it('Run LoadGetValue(Component: {getValues()})', () => {
      const name = chance.name()

      const MyComponent = {
        getValues: () => name
      }

      expect(FormElement.LoadGetValue(MyComponent)).to.be(name)
    })

    it('Run LoadGetValue(Component: {state: {value}})', () => {
      const val = sample([chance.name.bind(chance), chance.paragraph.bind(chance)])()

      const MyComponent = {
        state: {
          value: val
        }
      }

      expect(FormElement.LoadGetValue(MyComponent)).to.be(val)
    })

    it('Run LoadGetValue(Component: {ref: {myCustomValue}, FormElementDefaultPath: ["ref", "myCustomValue"]})', () => {
      const val = sample([chance.name.bind(chance), chance.paragraph.bind(chance)])()

      const MyComponent = {
        FormElementDefaultPath: ['ref', 'myCustomValue'],
        ref: {
          myCustomValue: val
        }
      }

      expect(FormElement.LoadGetValue(MyComponent)).to.be(val)
    })

  })

  describe('Apply FormElement', () => {

    it('FormElement.implement: formElement', () => {
      const MyComponent = FormElement.implement({})
      expect(FormElement.isApplied(MyComponent)).to.be.ok()
      expect(MyComponent).to.have.property('transferDOMEvent')
      expect(MyComponent).to.have.property('InvokeChange')
      expect(MyComponent).to.have.property('value')
      expect(MyComponent).to.have.property('values')
    })

    it('formElement.transferDOMEvent("myEvent")', (done) => {
      const val = sample([chance.name.bind(chance), chance.paragraph.bind(chance)])()
      const myEvent = function (p) {
        expect(p).to.be(val)
        done()
      }
      const MyComponent = FormElement.implement({props:{myEvent}})

      MyComponent.transferDOMEvent('myEvent')(val)
    })

  })
})
