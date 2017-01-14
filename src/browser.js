const FormElement = require('./FormElement.js')

exports = module.exports = FormElement

const o = process.env.NODE_ENV

if (process.env.npm_package_version !== undefined) {
  Object.defineProperty(FormElement, 'version', {
    enumerable: false,
    value: process.env.npm_package_version
  })
}
