import React from 'react';
import FormElementStatic from './util/form-element-static.jsx';

import HeaderBar from './util/header-bar.jsx';

export default class Header extends FormElementStatic {
    static toolbarEntry() {
        return {
            element: 'Header',
            displayName: 'Header Text',
            icon: 'fa fa-header',
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
            <h3 className="static">{this.props.data.content}</h3>
        )
    }

}
