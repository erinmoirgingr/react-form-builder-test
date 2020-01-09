import React from 'react';
import FormElementStatic from './util/form-element-static.jsx';

import HeaderBar from './util/header-bar.jsx';

export default class LineBreak extends FormElementStatic {
  static toolbarEntry() {
    return {
      element: 'LineBreak',
      displayName: 'Line Break',
      static: true,
      hasOptions: false,
      icon: 'fa fa-arrows-h'
    };
  }

  static defaultOptions() {
      return {
      };
  }

renderComponent() {
    return (<hr />);
}
}
