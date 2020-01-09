import React from 'react';
import FormElement from './util/form-element.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class Hidden extends FormElement {
    static toolbarEntry() {
        return {
            element: 'Hidden',
            displayName: 'Hidden Input',
            icon: 'fa fa-eye-slash'
        };
    }

    static defaultOptions() {
        return {
            label: 'Placeholder Label',
            defaultValue: ''
        }
    }

    renderComponent() {
        let props = this.baseInputProps();
        props.type = "hidden";
        props.className = "form-control";

        return (<input {...props} />);
    }

    render() {
        if (this.props.mutable) {
            return this.renderComponent();
        } else {
            return super.render();
        }
    }
}
