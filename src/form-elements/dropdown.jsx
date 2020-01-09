import React from 'react';
import Select from 'react-select';
import FormElementWithOptions from './util/form-element-with-options.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

import ID from '../UUID';

export default class Dropdown extends FormElementWithOptions {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getOptions   = this.getOptions.bind(this);

        // Hold off on setting the value to the default until we have options
        let state = {
            asyncOptionsRetrieved:  false
        };

        if (props.optionsUrl) {
            state.value = this.parseValue(props.defaultValue);
        }

        this.state = _.extend(
            this.state,
            state
        );
    }

    static toolbarEntry() {
        return {
            element: 'Dropdown',
            displayName: 'Dropdown',
            icon: 'fa fa-caret-square-o-down'
        };
    }

    static defaultOptions() {
        return {
            label: 'Placeholder Label',
            options: [
                {value: 'place_holder_option_1', label: 'Place holder option 1', key: 'option_' + ID.uuid()},
                {value: 'place_holder_option_2', label: 'Place holder option 2', key: 'option_' + ID.uuid()},
                {value: 'place_holder_option_3', label: 'Place holder option 3', key: 'option_' + ID.uuid()}
            ],
            optionsUrl: '',
        }
    }

    onOptionsRetrieved() {
        if (this.state.options.length === 1 && !_.isUndefined(_.first(this.state.options).value)) {
            this.handleChange(this.parseValue(_.first(this.state.options).value));
        } else {
            this.setState({
                value: this.parseValue(this.props.defaultValue),
            });
        }
    }

    handleChange(value) {
        this.setState({
            value: value
        });
    }

    validateRequired() {
        return this.refs.input.state.value ? true : false;
    }

    renderComponent() {
        let props = this.baseInputProps();

        props.options = this.state.options;
        props.value = this.state.value;

        if (this.props.mutable) {
            props.onChange = this.handleChange;
            props.allowCreate = false;

            if(this.props.data.allowCreate) {
                props.allowCreate = true;
            }
        }

        return (
            <Select {...props} />
        );
    }
}
