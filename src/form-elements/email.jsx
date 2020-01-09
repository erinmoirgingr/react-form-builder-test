import React from 'react';
import FormElement from './util/form-element.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class Email extends FormElement {
    constructor(props) {

        super(props);

        this.state = {
            value: null,
        };
    }

    static toolbarEntry() {
        return {
            element: 'Email',
            displayName: 'Email',
            icon: 'fa fa-envelope'
        };
    }

    static defaultOptions() {
        return {
            label: 'Email',
            isUnique: false,
            sendEmail: false,
            checkExists: true
        }
    }

    renderComponent() {
        let props = this.baseInputProps();
        props.type = "email";
        props.className = "form-control";

        if (this.props.mutable) {
            if(!_.isNull(this.state.email)) {
                props.value = this.state.value;
            }

        }

        return (
            <input {...props} />
        );
    }
}
