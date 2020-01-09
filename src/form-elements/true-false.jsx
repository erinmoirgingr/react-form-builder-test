import React from 'react';
import FormElement from './util/form-element.jsx';

import RadioButtons from './radio-buttons.jsx';

import ID from '../UUID';

export default class TrueFalse extends RadioButtons {
  static toolbarEntry() {
    return {
      element: 'TrueFalse',
      displayName: 'True / False',
      icon: 'fa fa-dot-circle-o'
    };
  }

  static defaultOptions() {
    return {
      label: 'True or False',
      options: [
        {value: '1', label: 'Yes', key: 'option_' + ID.uuid()},
        {value: '0', label: 'No', key: 'option_' + ID.uuid()}
      ]
    };
  }
}
