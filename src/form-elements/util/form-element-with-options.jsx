import React from 'react';
import FormElement from './form-element';

export default class FormElementWithOptions extends FormElement {
    constructor(props) {
        super(props);

        this.state = {
            options: props.data.options
        };
    }

    parseValue(value) {
        if (_.isString(value)) {
            return value.split(',');
        } else if (_.isArray(value)) {
            return value;
        } else if(_.isObject(value)) {
            return _.values(value);
        } else {
            return [];
        }
    }

    setOptions(options) {
        // This is a no-op if the options have already been set on the window, but do it here just for clarity
        _.set(window, ['ReactFormbuilder', 'Options', this.props.data.name], options);

        this.setState({
            asyncOptionsRetrieved:  true,
            options:                options,
        }, function() {
            if (this.onOptionsRetrieved) {
                this.onOptionsRetrieved(options);
            }
        });
    }

    getOptions() {
        if (_.get(window, ['ReactFormbuilder', 'Options', this.props.data.name])) {
            this.setOptions(_.get(window, ['ReactFormbuilder', 'Options', this.props.data.name]));
        } else {
            var xhr = new XMLHttpRequest();

            let url;

            if (this.props.data.optionsUrl) {
                url = encodeURI(this.props.data.optionsUrl);
            } else {
                url = encodeURI(this.props.optionsUrl);
            }

            if (this.props.requestParams) {
                url += (url.indexOf('?') > -1 ? '&' : '?') + this.props.requestParams;
            }

            xhr.open('GET', url);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    let options = JSON.parse(xhr.responseText);

                    this.setOptions(options);
                }
                else {
                    console.warn('Error retrieving async options');
                }
            }.bind(this);
            xhr.send();
        }
    }

    componentDidMount() {
        if (!this.state.asyncOptionsRetrieved && (this.props.data.optionsUrl || this.props.optionsUrl)) {
            this.getOptions();
        }
    }

    renderReadOnly() {
        let value = this.parseValue(this.props.defaultValue);

        let selected = _.filter(this.state.options || this.props.data.options, function(option) {
            return value.indexOf(option.value) >= 0;
        });

        if (selected.length > 1) {
            return (
                <ul>
                {
                    _.map(selected, function(item) {
                        return <li key={item.value}>{item.label}</li>;
                    })
                }
                </ul>
            );
        } else if(selected.length > 0) {
            return selected[0].label;
        }
    }
}
