import React from 'react';
import FormElement from './util/form-element.jsx';

import StarRating from 'react-star-rating';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class Rating extends FormElement {
  static toolbarEntry() {
    return {
      element: 'Rating',
      displayName: 'Rating',
      icon: 'fa fa-star'
    };
  }

  static defaultOptions() {
    return {
        label: 'Placeholder Label',
    };
  }

  validateRequired() {
    return this.refs.input.state.rating !== 0;
  }

  renderComponent() {
    let props = this.baseInputProps();
    props.ratingAmount = 5;
    props.rating = (this.props.defaultValue !== undefined && this.props.defaultValue.length) ? parseFloat(this.props.defaultValue, 10) : 0;

    return (<StarRating {...props} />);
  }
}
