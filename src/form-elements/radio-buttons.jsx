import React from 'react';
import FormElementWithOptions from './util/form-element-with-options.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

import ID from '../UUID';

export default class RadioButtons extends FormElementWithOptions {
    static toolbarEntry() {
        return {
            element: 'RadioButtons',
            displayName: 'Multiple Choice',
            icon: 'fa fa-dot-circle-o'
        };
    }

    static defaultOptions() {
        return {
            label: 'Placeholder Label',
            options: [
                {value: 'place_holder_option_1', label: 'Place holder option 1', key: 'option_' + ID.uuid()},
                {value: 'place_holder_option_2', label: 'Place holder option 2', key: 'option_' + ID.uuid()},
                {value: 'place_holder_option_3', label: 'Place holder option 3', key: 'option_' + ID.uuid()}
            ]
        }
    }

    validateRequired() {
        for (let refName in this.refs) {
            if (refName.indexOf('option_') === 0) {
                if (this.refs[refName].checked) {
                    return true;
                }
            }
        }

        return false;
    }

    renderReadOnly() {
        if(this.props.defaultValue === '0') {

            if(this.props.inline) {
                return (
                    <span>False</span>
                )
            }

            return (
                <div>False</div>
            );
        }

        if(this.props.defaultValue === '1') {

            if(this.props.inline) {
                return (
                    <span>True</span>
                )
            }

            return (
                <div>True</div>
            );
        }
        
        if(this.props.inline) {
            return (
                <span>{this.props.defaultValue}</span>
            )
        }

        return (
            <div>{this.props.defaultValue}</div>
        );
    }

    renderComponent() {
        let self            = this;
        return (
            this.props.data.options.map(function (option) {
                // Do this in the loop since we modify props for each item
                let props           = self.baseInputProps();
                let defaultValue    = _.get(props, 'defaultValue', _.get(props, 'value', []));

                let this_key = 'preview_' + option.key;

                props.htmlId += '_' + option.key;
                props.name   = self.props.data.name;

                if(self.props.inputPrefix) {
                    props.name = self.props.inputPrefix + "[" + props.name + "]";
                }

                props.type = "radio"
                props.value = option.value;

                if (self.props.mutable) {
                    props.defaultChecked = defaultValue.indexOf(option.value) > -1;
                } else {
                    props.checked = defaultValue.indexOf(option.value) > -1;
                }

                props.ref = "option_" + option.key;

                return (
                    <label className="radio-label" key={this_key}>
                        <input {...props} /> {option.label}
                        </label>
                    )
                })
            );
        }
    }
