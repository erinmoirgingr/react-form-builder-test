import React from 'react';
import FormElementWithOptions from './util/form-element-with-options.jsx';
import Select from 'react-select';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

import ID from '../UUID';

export default class Tags extends FormElementWithOptions {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: this.parseValue(props.defaultValue)
        };
    }

    static toolbarEntry() {
        return {
            element: 'Tags',
            displayName: 'Tags',
            icon: 'fa fa-tags'
        };
    }

    static defaultOptions() {
        return {
            label: 'Placeholder Label',
            multiple: true,
            options: [
                {value: 'place_holder_tag_1', label: 'Place holder tag 1', key: 'tag_' + ID.uuid()},
                {value: 'place_holder_tag_2', label: 'Place holder tag 2', key: 'tag_' + ID.uuid()},
                {value: 'place_holder_tag_3', label: 'Place holder tag 3', key: 'tag_' + ID.uuid()}
            ],
            optionsUrl: '',
        }
    }

    handleChange(e) {
        this.setState({value: e});
    }

    validateRequired() {
        return (this.refs.input.state.value.length > 0);
    }

    renderComponent() {
        let props = this.baseInputProps();
        props.multi = true;
        props.value = this.state.value;
        props.ref = 'input';

        props.options = this.props.data.options;
        if (!this.props.mutable) {props.value = this.props.data.options[0].value} // to show a sample of what tags looks like
        if (this.props.mutable) {
            props.onChange = this.handleChange;
        }
        return (<Select {...props} />);
    }
}
