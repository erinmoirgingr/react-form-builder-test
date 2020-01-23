import React from 'react';
import FormElement from './util/form-element.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

import { Well } from 'react-bootstrap';

export default class Password extends FormElement {

    constructor(props) {
      super(props);
      if(!this.refElems) {
        this.refElems = {};
      }
      this.refElems = {
        ...this.refElems,
        confirm: React.createRef(),
      }
    }

    static toolbarEntry() {
        return {
            element: 'Password',
            displayName: 'Password',
            icon: 'fa fa-key'
        };
    }

    static defaultOptions() {
        return {
            label:        'Password',
            suppressData: true
        }
    }

    static getFieldName() {
        return 'Password'
    }

    validate() {
        if (this.refElems.input.current.value !== this.refElems.confirm.current.value) {
            return 'Passwords do not match!';
        }

        return true;
    }

    renderReadOnly() {
        return '';
    }

    renderComponent() {
        let props = this.baseInputProps();
        props.type = "password";
        props.className = "form-control";

        return (
            <Well>
                <div className="form-group">
                    <input {...props} ref={this.refElems.input} />
                </div>
                <div className="form-group">
                    <label htmlFor={this.htmlId + '_confirm'}>{'Confirm ' + this.props.data.label}</label>
                    <input id={this.htmlId + '_confirm'} ref={this.refElems.confirm} type="password" className="form-control"/>
                </div>
            </Well>
        );
    }
}
