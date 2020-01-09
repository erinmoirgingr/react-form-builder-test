import React from 'react';
import FormElementStatic from './util/form-element-static.jsx';

import HeaderBar from './util/header-bar.jsx';

export default class Paragraph extends FormElementStatic {
    static toolbarEntry() {
        return {
            element: 'Paragraph',
            displayName: 'Paragraph',
            icon: 'fa fa-paragraph',
            static: true
        };
    }

    static defaultOptions() {
        return {
            content: 'Placeholder Text...'
        }
    }

    renderComponent() {
        return (
            <p className="static">{this.props.data.content}</p>
        );
    }
}
