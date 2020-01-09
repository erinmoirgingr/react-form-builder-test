import React from 'react';
import FormElementStatic from './util/form-element-static.jsx';

import HeaderBar from './util/header-bar.jsx';

export default class Download extends FormElementStatic {
    static toolbarEntry() {
        return {
            element: 'Download',
            displayName: 'File Attachment',
            icon: 'fa fa-file',
            static: true
        };
    }

    static defaultOptions() {
        return {
            content: 'Placeholder file name ...',
            filePath: '',
            _href: ''
        }
    }

    renderComponent() {
        return (
            <a href={this.props.downloadPath + '?id=' + this.props.data.filePath}>{this.props.data.content}</a>
        );
    }
}
