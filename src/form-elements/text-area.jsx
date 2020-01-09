import React from 'react';
import FormElement from './util/form-element.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class TextArea extends FormElement {
    static toolbarEntry() {
        return {
            element: 'TextArea',
            displayName: 'Multi-line Input',
            icon: 'fa fa-text-height'
        };
    }

    static defaultOptions() {
        return {
            label: 'Placeholder Label'
        }
    }

    renderReadOnly() {
        return (
            <p dangerouslySetInnerHTML={{__html: this.props.defaultValue}}></p>
        )
    }

    renderComponent() {
        let props = this.baseInputProps();
        props.className = "form-control formbuilder";
        props.defaultValue = this.props.defaultValue;

        if (this.props.mutable) {
            props.ref = 'input';
        }

        return (<textarea {...props} />);
    }
}
