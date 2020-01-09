import React from 'react';
import FormElementStatic from './util/form-element-static.jsx';

import HeaderBar from './util/header-bar.jsx';

export default class Hyperlink extends FormElementStatic {
    static toolbarEntry() {
        return {
            element: 'Hyperlink',
            displayName: 'Web site',
            icon: 'fa fa-link',
            static: true
        };
    }

    static defaultOptions() {
        return {
            content: 'Placeholder Web site link ...',
            href: 'http://www.example.com'
        }
    }

    renderComponent() {
        return (<a target="_blank" href={this.props.data.href}>{this.props.data.content}</a>);
    }
}
