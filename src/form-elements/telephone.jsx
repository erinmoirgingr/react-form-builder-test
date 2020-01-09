import React from 'react';
import FormElement from './util/form-element.jsx';
import MaskedInput from 'react-input-mask';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class Telephone extends FormElement {
  static toolbarEntry() {
    return {
      element: 'Telephone',
      displayName: 'Telephone',
      icon: 'fa fa-phone'
    };
  }

  static defaultOptions() {
      return {
          label: 'Telephone'
      }
  }

  renderComponent() {
    let props = this.baseInputProps();
    props.type = "telephone";
    props.className = "form-control telephone";
    props.mask = _.get(this.props.data, 'telephoneFormat', this.props.telephoneFormat);
    props.defaultValue = this.props.defaultValue;
    props.ref = 'input';

    return (<MaskedInput {...props} />);
  }
}

Telephone.defaultProps = _.extend(
    _.clone(Telephone.defaultProps),
    {
        telephoneFormat: '(999) 999-9999'
    }
);
