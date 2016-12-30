# React From Element
[![dependencies Status](https://david-dm.org/jondotsoy/react-form-element/status.svg)](https://david-dm.org/jondotsoy/react-form-element)

Plugin react to describe HTML Form Elements. Invoke properties to work with this type elements.


**Features:**
- Apply a React Component as Form Element (Only a simulation).
- Dispatch to events.
- Update state by events.

## Examples

```javascript
const {FormElement} = require('react-form-element')

class MyComp extends React.Component {
  constructor (props) {
    this.state = {value:''}
  }
  render () {
    render <div>
      <div>
        <input type="text"
          onChange={FormElement.invokeChange(this, 'value')}
          value={this.state.value} />
      </div>
      <div>
        <div>
          <h2>Preview</h2>
          <h4>{this.state.value}</h4>
        </div>
      </div>
    </div>
  }
}
```

## API

### `FormElement`