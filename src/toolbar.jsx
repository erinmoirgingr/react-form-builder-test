/**
  * <Toolbar />
  */

import React from 'react';
import ToolbarItem from './toolbar-item';
import ID from './UUID';
import ElementActions from './actions/ElementActions';

import * as FormElements from './form-elements';

export default class Toolbar extends React.Component {

  constructor(props) {
    super(props);

    var items = (this.props.items) ? this.props.items : this._defaultItems();

    this.state = {
      items: items
    };
  }

  _defaultItems() {
    return [
        FormElements.Header,
        FormElements.LineBreak,
        FormElements.Paragraph,
        FormElements.TextInput,
        FormElements.TextArea,
        FormElements.Hidden,
        FormElements.FirstName,
        FormElements.Email,
        FormElements.Password,
        FormElements.Telephone,
        FormElements.Hyperlink,
        FormElements.Dropdown,
        FormElements.Checkboxes,
        FormElements.RadioButtons,
        FormElements.TrueFalse,
        FormElements.Tags,
        FormElements.DatePicker,
        FormElements.Range,
        FormElements.Rating,
        FormElements.Download,
        FormElements.Signature,
        FormElements.Camera
    ]
  }

  _onClick(item) {
    var elementData = item.defaultOptions();
    elementData.id      = ID.uuid(); // Assign a temporary ID here so the preview doesn't get messed up if we have 2 items with the same ID
    elementData.element = item.toolbarEntry().element;

    if (elementData.label) {
      elementData.name = _.snakeCase(elementData.label);
    }

    ElementActions.createElement(elementData);
  }

  render() {
    return (
      <div className="react-form-builder-toolbar pull-right">
        <h4>
          Toolbox
          <br />
          <small>Click to add</small>
        </h4>
        <ul>
          {
            this.state.items.map(item => {
              let data = item.toolbarEntry();

              return <ToolbarItem data={data} key={data.element} onClick={this._onClick.bind(this, item) } />;
            })
          }
        </ul>
      </div>
    )
  }
}
