# React From Element
Plugin react to describe HTML Form Elements. Invoke properties to work with this type elements.


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