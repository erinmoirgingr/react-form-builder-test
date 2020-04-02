/**
* <Form />
*/

import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter} from 'fbemitter';
import FormValidator from './form-validator';
import serializeForm from 'form-serialize';
import * as FormElements from './form-elements';

export default class ReactForm extends React.Component {

    constructor(props) {
        super(props);
        this.emitter = new EventEmitter();

        this.state = {
            _data: _.get(props, 'data', []),
            isDirty: false,
        }

        this.refElems = {
          form: React.createRef(),
        };

        this.formRefs = {};
    }

    componentDidMount() {
      const self = this;
        if (this.props.url !== undefined) {
            $.get(
                this.props.url,
                function(response) {
                    self.setState({
                        _data: response
                    });
                },
                'json'
            );
        }
    }

    _checkboxesDefaultValue(item) {
        let defaultChecked = [];
        item.options.forEach(option => {
            defaultChecked.push(this.props.answerData['option_'+option.key])
        })
        return defaultChecked;
    }

    /**
    * Validate the form and return errors
    * @return {Promise} Resolves an array of error strings.  The array is empty if the form is valid
    */

    validate() {
        let self = this;
        let errors = [];
        let promises = [];

        self.state._data.forEach(item => {
            let $item = self.formRefs[item.name];

            // Don't validate items that weren't actually rendered (like an admin item on a public form)
            if ($item === undefined || $item === null) {
                return;
            }

            if($item.props.isVisible === false) {
                return;
            }

            // Run default required validation, or a custom function if available
            if ($item.props.data.required === true) {
                if(
                    (
                        !_.isUndefined(self.props.reservationTypeIds) &&
                        self.props.reservationTypeIds.length > 0 &&
                        !_.isUndefined($item.props.data.reservationTypesRequired) &&
                        $item.props.data.reservationTypesRequired.length > 0 &&
                        _.intersection($item.props.data.reservationTypesRequired, self.props.reservationTypeIds).length > 0
                    ) ||
                    _.isUndefined($item.props.data.reservationTypesRequired) ||
                    $item.props.data.reservationTypesRequired.length === 0 ||
                    _.isUndefined(self.props.reseravtionTypeIds) ||
                    self.props.reservationTypeIds.length === 0
                ) {
                    if (_.isFunction($item.validateRequired)) {
                        let isValid = $item.validateRequired();

                        if (isValid !== true) {
                            errors.push($item.props.data.label + ' is required!');
                        }
                    }
                }
            }

            // Handle custom validation
            if (_.isFunction($item.validate)) {
                if(
                    (
                        !_.isUndefined(self.props.reservationTypeIds) &&
                        self.props.reservationTypeIds.length > 0 &&
                        !_.isUndefined($item.props.data.reservationTypesRequired) &&
                        $item.props.data.reservationTypesRequired.length > 0 &&
                        _.intersection($item.props.data.reservationTypesRequired, self.props.reservationTypeIds).length > 0
                    ) ||
                    _.isUndefined($item.props.data.reservationTypesRequired) ||
                    $item.props.data.reservationTypesRequired.length === 0 ||
                    _.isUndefined(self.props.reseravtionTypeIds) ||
                    self.props.reservationTypeIds.length === 0
                ) {

                    let isValid = $item.validate();

                    // Allow async validation.  Process all promises later if available.
                    if (isValid instanceof Promise) {
                        promises.push(isValid);
                    } else {
                        if (isValid !== true) {
                            errors.push(isValid);
                        }
                    }
                }
            }
        });

        // Resolve all error promises
        return new Promise(function(resolve, reject) {
            Promise.all(promises).then(
                function(values) {
                    _.each(values, function(value) {
                        if (value !== true) {
                            errors.push(value);
                        }
                    });

                    if (errors.length > 0) {
                        if (self.props.handleInvalid) {
                            self.props.handleInvalid(errors);
                        }
                    }

                    // Resolve errors - send back the empty array if no errors
                    resolve(errors);

                    if (self.props.showErrors !== false) {
                        // publish errors, if any
                        self.emitter.emit('formValidation', errors);
                    }
                },
                function(error) {
                    console.error(error);
                }
            );
        });
    }

    /**
    * Serialize the form
    * @return {Object} The serialized form
    */
    serialize() {
        return serializeForm(this.refElems.form.current, {hash: true})
    }

    submitForm(e, second) {
        if (this.props.handleSubmit) {
            if(second) {
                this.props.secondHandleSubmit(e, this.serialize())
            } else {
                this.props.handleSubmit(e, this.serialize());
            }
        } else {
            let $form = ReactDOM.findDOMNode(this.refElems.form.current);
            $form.submit();
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        let self = this;
        let errors  = [];

        if (self.props.validate !== false) {
            self.validate().then(function(errors) {
                if (errors.length === 0) {
                    self.submitForm(e);
                }
            });
        } else {
            self.submitForm(e);
        }
    }

    handleSecondSubmit(e) {
        e.preventDefault();

        let self = this;
        let errors  = [];

        if (self.props.validate !== false) {
            self.validate().then(function(errors) {
                if (errors.length === 0) {
                    self.submitForm(e, true);
                }
            });
        } else {
            self.submitForm(e, true);
        }
    }

    setDirty() {
        if(!this.state.isDirty) {
            this.setState({isDirty: true});
        }
    }

    getFieldName(str) {
        if(this.props.inputPrefix) {
            return this.props.inputPrefix + "[" + str + "]";
        }

        return str;
    }

    render() {
        let items = [];
        let isEditing = Object.keys(this.props.answerData).length > 0;

        this.state._data.forEach( item => {
            var isVisible = true;

            if (!this.props.readOnly && (item.publicOnly && this.props.isAdmin === true) || (item.adminOnly && this.props.isAdmin !== true)) {
                isVisible = false;
            }

            if(!isEditing && !this.props.isAdmin && item.hideOnCreate) {
                isVisible = false;
            }


            if(this.props.reservationTypeIds.length > 0 && !_.isUndefined(item.reservationTypesVisible) && item.reservationTypesVisible.length > 0 &&  _.intersection(item.reservationTypesVisible, this.props.reservationTypeIds).length === 0) {
                isVisible = false;
            }

            // Only show properly tagged elements
            if (this.props.tags.length > 0) {
                if (!item.tags) {
                    isVisible = false;
                } else {
                    let tags = item.tags.split(',');

                    if (_.intersection(this.props.tags, tags).length === 0) {
                        isVisible = false;
                    }
                }
            }

            if(this.props.readOnly && !item.tags && item.element.indexOf(['Header', 'LineBreak', 'Paragraph']) > -1) {
                isVisible = false;
            }

            // See if the item is required on this public/admin form
            // But if the data for this item is suppressed and we're editing, make it not required
            item.required = item.required || (item.requiredAdmin && this.props.isAdmin === true) || (item.requiredPublic && this.props.isAdmin !== true);

            if (item.suppressData === true && isEditing) {
                item.required = false;
            }

            if(!isVisible) {
                item.required = false;
            }

            let props = {
                mutable:        true,
                key:            item.id + '-' + (item.required ? '1' : '0'),
                data:           item,
                readOnly:       this.props.readOnly,
                isTable:        this.props.isTable,
                requestParams:  this.props.requestParams,
                inline:         this.props.inline,
                autoComplete:   this.props.autoComplete,
                inputPrefix:    this.props.inputPrefix,
                isVisible:      isVisible,
                ref:            (el) => {this.formRefs[item.name] = el},
            }

            // Use this.props.answerData if available, otherwise use the item's default value
            let defaultValue = _.get(this.props, ['answerData', item.name], _.get(item, 'defaultValue', false));

            if (defaultValue) {
                props.defaultValue = defaultValue;
            }

            // Hide empty read only fields if applicable
            if (this.props.hideEmptyReadOnlyFields === true && !defaultValue) {
                return;
            }

            // Attach any additional props necessary here
            switch (item.element) {
                case "Download":
                    props.downloadPath = this.props.downloadPath;
                    break;
                case "Telephone":
                    if (this.props.telephoneFormat) {
                        props.telephoneFormat = this.props.telephoneFormat;
                        props.telephoneFormat = props.telephoneFormat.replace(/[0-9]/g, '9');
                    }
                    break;
            }

            if (item.adminOnly && !this.props.isAdmin) {
                isVisible = false;
            }

            // Use the element in custom elements if it's found in there, otherwise use the one in the default FormElements
            let element = _.find(this.props.customElements, (element) => {
                return element.toolbarEntry().element === item.element;
            }) || FormElements[item.element];

            props.setDirty = this.setDirty.bind(this);

            if (element) {
                let reactElement = React.createElement(
                    element,
                    props
                );
                if (item.hidden && !this.props.isSuperUser) {
                    items.push(
                        <div className="hidden" key={item.id}>{reactElement}</div>
                    );
                } else {
                  items.push(reactElement);
                }
            } else {
                console.warn('Invalid element type ' + item.element);
            }
        });

        let formTokenStyle = {
            display: 'none'
        }

        let actions = this.props.children ?
        this.props.children : (
            <div className="text-right">
                {
                    this.props.back_action &&
                    <a href={this.props.back_action} className="btn btn-default btn-cancel btn-big"> Cancel</a>
                }
                <a className="btn btn-primary btn-big btn-agree" onClick={this.handleSubmit.bind(this)}>
                    {this.props.submitLabel}
                </a>
                {
                    this.props.secondSubmitLabel &&
                    <span>
                        &nbsp;&nbsp;
                        <a className="btn btn-info btn-big btn-agree" onClick={this.handleSecondSubmit.bind(this)}>
                            {this.props.secondSubmitLabel}
                        </a>
                    </span>
                }
            </div>
        );

        if(this.props.isTable) {
            if(this.props.inline) {
                return _.first(items);
            }

            return (
                <tr>
                    {items}
                </tr>
            );
        }

        return (
            <div>
                <FormValidator emitter={this.emitter} />
                <div className="react-form-builder-form">
                    {!this.props.isInlineForm &&
                        <form
                            encType         = "multipart/form-data"
                            ref             = {this.refElems.form}
                            action          = {this.props.formAction}
                            method          = {this.props.formMethod}
                            onSubmit        = {this.handleSubmit.bind(this)}
                            onChange        = {this.setDirty.bind(this)}
                            autoComplete    = {this.props.autoComplete === true ? 'on' : 'nope'}>
                            { this.props.authenticity_token &&
                                <div style={formTokenStyle}>
                                    <input name="utf8" type="hidden" value="&#x2713;" />
                                    <input name="authenticity_token" type="hidden" value={this.props.authenticity_token} />
                                    <input name="task_id" type="hidden" value={this.props.task_id} />
                                </div>
                            }
                            <input name="is_dirty" value={this.state.isDirty} type="hidden" />
                            {items}
                            {!this.props.readOnly && actions}
                        </form>
                    }

                    {this.props.isInlineForm &&
                        <div>
                            { this.props.authenticity_token &&
                                <div style={formTokenStyle}>
                                    <input name={this.getFieldName('utf8')} type="hidden" value="&#x2713;" />
                                    <input name={this.getFieldName('authenticity_token')} type="hidden" value={this.props.authenticity_token} />
                                    <input name={this.getFieldName('task_id')} type="hidden" value={this.props.task_id} />
                                </div>
                            }
                            <input name={this.getFieldName('is_dirty')} value={this.state.isDirty} type="hidden" />
                            {items}
                        </div>
                    }
                </div>
                <FormValidator emitter={this.emitter} />
            </div>
        )
    }
}

ReactForm.defaultProps = {
    answerData:                 {},
    validate:                   true,
    showErrors:                 true,
    submitLabel:                'Submit',
    customElements:             [],
    tags:                       [],
    isAdmin:                    false, // This is whether or not the user is an admin or not on an app basis
    readOnly:                   false, // Whether or not this entire form is read only
    requestParams:              null,
    inline:                     false, // If the form is inline, there won't be a line break between a field's label and the value
                                       // If a field is inherently a block element, it will still display on a new line though
    hideEmptyReadOnlyFields:    false, // Hide empty fields on read only
    autoComplete:               true,  // Allow autocomplete on this form
    reservationTypeIds:         [],
    isTable:                    false,
    isInlineForm:               false,
    inputPrefix:                null
};
