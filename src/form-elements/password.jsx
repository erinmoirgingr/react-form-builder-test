import React from 'react';
import FormElement from './util/form-element.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

import { Well } from 'react-bootstrap';

export default class Password extends FormElement {
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
        if (this.refs.input.value !== this.refs.confirm.value) {
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
                    <input {...props} />
                </div>
                <div className="form-group">
                    <label htmlFor={this.htmlId + '_confirm'}>{'Confirm ' + this.props.data.label}</label>
                    <input id={this.htmlId + '_confirm'} ref="confirm" type="password" className="form-control"/>
                </div>
            </Well>
        );
    }
}
