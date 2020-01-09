import React from 'react';
import Select from 'react-select';
import DynamicOptionList from './dynamic-option-list';
import TextAreaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

export default class FormElementsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            element: this.props.element,
            data: this.props.data,
            dirty: false,
            options: [],
            defaultValue: false
        }
    }

    getOptions(url) {
        var xhr = new XMLHttpRequest();

        if (this.props.requestParams) {
            url += (url.indexOf('?') > -1 ? '&' : '?') + this.props.requestParams;
        }

        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let options = JSON.parse(xhr.responseText);

                this.setState({
                    options: options
                })
            }
            else {
                console.warn('Error retrieving async options');
            }
        }.bind(this);
        xhr.send();
    }

    toggleRequired() {
        let thisElement = this.state.element;
    }

    editTags(value) {
        let thisElement = this.state.element;
        thisElement.tags = value;

        this.setState({
            element: thisElement,
            dirty: true
        });
    }

     editReservationTypesVisible(value) {
        console.log('edit res type visible');
        console.log(value);

            value       = value.split(',');
        let thisElement = this.state.element;

        if(_.isEmpty(_.first(value))) {
            value = [];
        }

        thisElement.reservationTypesVisible  = value;

        this.setState({
            element: thisElement,
            dirty: true
        });
    }

    editReservationTypesRequired(value) {
            value       = value.split(',');
        let thisElement = this.state.element;

        if(_.isEmpty(value) || _.isEmpty(_.first(value))) {
            value = [];
        }

        if(_.isUndefined(thisElement.reservationTypesVisible)) {
            thisElement.reservationTypesVisible = [];
        }

        thisElement.reservationTypesRequired = value;
        thisElement.reservationTypesVisible  = _.uniq(thisElement.reservationTypesVisible.concat(value));

        this.setState({
            element: thisElement,
            dirty: true
        });
    }

    editDefaultValue(value) {
        let thisElement = this.state.element;
        thisElement.defaultValue = value;

        this.setState({
            element:  thisElement,
            defaultValue: value,
            dirty: true
        })
    }

    editVisibility(value) {
        let thisElement = this.state.element;
        
        if(value === '') {
            thisElement.adminOnly  = false;
            thisElement.publicOnly = false;
        } else if(value === 'employees') {
            thisElement.adminOnly  = true;
            thisElement.publicOnly = false;
        } else if(value === 'customers') {
            thisElement.adminOnly  = false;
            thisElement.publicOnly = true;
        }

        this.setState({
            element:  thisElement,
            dirty: true
        })
    }

    editRequired(value) {
            value       = value.split(',');
        let thisElement = this.state.element;
        
        if(_.isEmpty(value) || value.length === 0) {
            thisElement.requiredPublic  = false;
            thisElement.requiredAdmin   = false;
        } else {
            if(value.indexOf('employees') > -1) {
                thisElement.requiredAdmin   = true;
            } else {
                thisElement.requiredAdmin   = false;
            }
            
            if(value.indexOf('customers') > -1) {
                thisElement.requiredPublic  = true;
            } else {
                thisElement.requiredPublic  = false;
            }
        }

        this.setState({
            element:  thisElement,
            dirty: true
        })
    }

    editElementProp(elemProperty, targProperty, e) {
        // elemProperty could be content or label
        // targProperty could be value or checked
        let thisElement = this.state.element;

        // Auto update the name field if the user hasn't manually updated it yet
        let nameChanged = _.snakeCase(thisElement.label) !== thisElement.name;

        thisElement[elemProperty] = e.target[targProperty];

        // Change field name automatically
        if (
            elemProperty === 'label'
            && !nameChanged
            && !_.get(this.props.element, 'systemField', false)
            && (_.isUndefined(thisElement.fieldExists) || !thisElement.fieldExists)
        ) {
            thisElement.name = _.snakeCase(e.target[targProperty]).substring(0, 254);
        }

        this.setState({
            element: thisElement,
            dirty: true
        }, () => {
            if (targProperty === 'checked') {this.updateElement();};
        });
    }
    updateElement() {
        let thisElement = this.state.element;

        // Parse out any default values here if we have an option list
        if (thisElement.options !== undefined) {
            let defaults = _.filter(thisElement.options, (option) => {
                return option.default === true;
            });
            defaults = _.map(defaults, 'value');

            if (defaults.length > 0) {
                thisElement.defaultValue = defaults;
            }
        }

        this.props.updateElement.call(this.props.preview, thisElement);
        this.setState({dirty: false});
    }

    componentDidMount() {
        if(this.props.element.optionsUrl) {
            this.getOptions(this.props.element.optionsUrl);
        }
    }

    render() {
        let requiredChecked         = _.get(this.props.element, 'required', false);
        let cannotRemoveChecked     = _.get(this.props.element, 'cannotRemove', false);
        let systemFieldChecked      = _.get(this.props.element, 'systemField', false);
        let hiddenChecked           = _.get(this.props.element, 'hidden', false);
        let searchableChecked       = _.get(this.props.element, 'searchable', false);
        let suppressDataChecked     = _.get(this.props.element, 'suppressDataChecked', false);
        let allowCreateChecked      = _.get(this.props.element, 'allowCreate', false);
        let sendEmail               = _.get(this.props.element, 'sendEmail', false);
        let checkExists             = _.get(this.props.element, 'checkExists', false);
        let hideOnCreate            = _.get(this.props.element, 'hideOnCreate', false);
        let allowFuture             = _.get(this.props.element, 'allowFuture', false);

        let thisFiles = this.props.files.length ? this.props.files : [];
        if (thisFiles.length < 1 || thisFiles.length > 0 && thisFiles[0].id !== "") {
            thisFiles.unshift({id: '', file_name: ''});
        }

        let publicOnlyChecked       = _.get(this.props.element, 'publicOnly', false);
        let adminOnlyChecked        = _.get(this.props.element, 'adminOnly', false);
        var visibility              = '';

        if(publicOnlyChecked) {
            visibility = 'customers';
        } else if(adminOnlyChecked) {
            visibility = 'employees';
        }

        let requiredPublicChecked   = _.get(this.props.element, 'requiredPublic', false);
        let requiredAdminChecked    = _.get(this.props.element, 'requiredAdmin', false);
        let required                = [];

        if(requiredPublicChecked) {
            required.push('customers');
        }

        if(requiredAdminChecked) {
            required.push('employees');
        }

        return (
            <div>
                <div className="clearfix">
                    <h4 className="pull-left">{this.props.element.text}</h4>
                    <i className="pull-right fa fa-times dismiss-edit" onClick={this.props.manualEditModeOff}></i>
                </div>
                { this.props.element.hasOwnProperty('content') &&
                    <div className="form-group">
                        <label>Text to display:</label>
                        <TextAreaAutosize type="text" className="form-control" defaultValue={this.props.element.content} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'content', 'value')} />
                    </div>
                }
                { this.props.element.hasOwnProperty('filePath') &&
                    <div className="form-group">
                        <label>File URL:</label>
                        <input defaultValue={this.props.element.filePath} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'filePath', 'value')} />    
                    </div>
                }
                { this.props.element.hasOwnProperty('href') &&
                    <div className="form-group">
                        <label>Link to:</label>
                        <TextAreaAutosize type="text" className="form-control" defaultValue={this.props.element.href} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'href', 'value')} />
                    </div>
                }
                { this.props.element.hasOwnProperty('label') &&
                    <div className="form-group">
                        <label>Display Label</label>
                        <input type="text" className="form-control" defaultValue={this.props.element.label} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'label', 'value')} />
                        <br />
                        <label>Display Description</label>
                        <textarea className="form-control" defaultValue={this.props.element.description} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'description', 'value')}></textarea>
                        <br />
                        <label>Field Name</label>
                        <input type="text" disabled={systemFieldChecked && !this.props.isSuperUser} className={classNames({'form-control': true, 'grayed-input': _.snakeCase(this.props.element.label) === this.props.element.name})} defaultValue={this.props.element.name} value={this.state.element.name} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'name', 'value')} />
                        <br/>
                        {
                            /*
                                <label>
                                    <input type="checkbox" checked={requiredChecked} value={true} onChange={this.editElementProp.bind(this, 'required', 'checked')} /> Required for All Forms
                                </label>
                                <br />
                            */
                        }
                        <label>
                            <input type="checkbox" checked={hideOnCreate} value={true} onChange={this.editElementProp.bind(this, 'hideOnCreate', 'checked')} /> Hide on Customer Registration Form?
                        </label>
                        <br />
                        <br />
                        <div className="form-group">
                            <div className="form-group-range">
                                <label>Who Is Required to Complete This Field?</label>
                                <Select
                                    multi     = {true}
                                    options   = {
                                        [
                                            {
                                                value: 'customers',
                                                label: 'Customers',
                                            },
                                            {
                                                value: 'employees',
                                                label: 'Employees',
                                            }
                                        ]
                                    }
                                    onChange  = {this.editRequired.bind(this)}
                                    onBlur    = {this.updateElement.bind(this)}
                                    value     = {required} />
                            </div>
                        </div>
                        {this.props.reservationTypes.length > 0 && required.length > 0 && 
                            <div className="form-group">
                                <div className="form-group-range">
                                    <label>For Which Reservation Types is This Field Required?</label>
                                    <Select
                                        multi       = {true}
                                        options     = {
                                            _.map(this.props.reservationTypes, (type) => {return {value: type.id, label: type.type}})
                                        }
                                        onChange    = {this.editReservationTypesRequired.bind(this)}
                                        onBlur      = {this.updateElement.bind(this)}
                                        value       = {this.state.element.reservationTypesRequired || []}
                                        placeholder = "All Reservation Types" />
                                </div>
                            </div>
                        }
                    </div>
                }
                <div className="form-group">
                    <div className="form-group-range">
                        <label>Who Can See/Edit This Field?</label>
                        <Select
                            options   = {
                                [
                                    {
                                        value: '',
                                        label: 'Everyone',
                                    },
                                    {
                                        value: 'customers',
                                        label: 'Only Customers',
                                    },
                                    {
                                        value: 'employees',
                                        label: 'Only Employees',
                                    }
                                ]
                            }
                            onChange  = {this.editVisibility.bind(this)}
                            onBlur    = {this.updateElement.bind(this)}
                            value     = {visibility} />
                    </div>
                </div>
                {this.props.reservationTypes.length > 0 &&
                    <div className="form-group">
                        <div className="form-group-range">
                            <label>Which Reservation Type(s) Is This Field Used For?</label>
                            <Select
                                multi     = {true}
                                options   = {
                                    _.map(this.props.reservationTypes, (type) => {return {value: type.id, label: type.type}})
                                }
                                onChange  = {this.editReservationTypesVisible.bind(this)}
                                onBlur    = {this.updateElement.bind(this)}
                                value     = {this.state.element.reservationTypesVisible || []}
                                placeholder = "All Reservation Types" />
                        </div>
                    </div>
                }
                <div className={'form-group ' + classNames({'hidden': this.props.isSuperUser !== true})}>
                    <label>
                        <input type="checkbox" checked={cannotRemoveChecked} value={true} onChange={this.editElementProp.bind(this, 'cannotRemove', 'checked')} /> Cannot Remove
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" checked={systemFieldChecked} value={true} onChange={this.editElementProp.bind(this, 'systemField', 'checked')} /> System Field (Locks the Name for non Super Users)
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" checked={hiddenChecked} value={true} onChange={this.editElementProp.bind(this, 'hidden', 'checked')} /> Hidden (For non Super Users)
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" checked={searchableChecked} value={true} onChange={this.editElementProp.bind(this, 'searchable', 'checked')} /> Searchable
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" checked={suppressDataChecked} value={true} onChange={this.editElementProp.bind(this, 'suppressData', 'checked')} /> Do not transmit back sensitive data (Try not to edit this)
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" checked={allowCreateChecked} value={true} onChange={this.editElementProp.bind(this, 'allowCreate', 'checked')} /> Allow Creation of New Option?
                    </label>
                </div>
                { !_.isUndefined(this.props.element.sendEmail) &&
                    <div className="form-group">
                        <label>
                            <input type="checkbox" checked={sendEmail} value={true} onChange={this.editElementProp.bind(this, 'sendEmail', 'checked')} /> Send System Generated Emails?
                        </label>
                    </div>
                }
                { !_.isUndefined(this.props.element.checkExists) &&
                    <div className="form-group">
                        <label>
                            <input type="checkbox" checked={checkExists} value={true} onChange={this.editElementProp.bind(this, 'checkExists', 'checked')} /> Check if Email Exists in System?
                        </label>
                    </div>
                }
                { !_.isUndefined(this.props.element.allowFuture) &&
                    <div className="form-group">
                        <label>
                            <input type="checkbox" checked={allowFuture} value={true} onChange={this.editElementProp.bind(this, 'allowFuture', 'checked')} /> Include Future Years?
                        </label>
                    </div>
                }
                { this.props.hasOwnProperty('tags') &&
                    <div className="form-group">
                        <div className="form-group-range">
                            <label>Tags (These control where data is displayed)</label>
                            <Select
                                multi     = {true}
                                options   = {
                                    _.map(this.props.tags, (tag) => {return {value: _.snakeCase(tag), label: tag}})
                                }
                                onChange  = {this.editTags.bind(this)}
                                onBlur    = {this.updateElement.bind(this)}
                                value     = {this.state.element.tags} />
                        </div>
                    </div>
                }
                { this.props.element.hasOwnProperty('step') &&
                    <div className="form-group">
                        <div className="form-group-range">
                            <label>Step</label>
                            <input type="number" className="form-control" defaultValue={this.props.element.step} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'step', 'value')} />
                        </div>
                    </div>
                }
                { this.props.element.hasOwnProperty('minValue') &&
                    <div className="form-group">
                        <div className="form-group-range">
                            <label>Min</label>
                            <input type="number" className="form-control" defaultValue={this.props.element.minValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'minValue', 'value')} />
                            <input type="text" className="form-control" defaultValue={this.props.element.minLabel} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'minLabel', 'value')} />
                        </div>
                    </div>
                }
                { this.props.element.hasOwnProperty('maxValue') &&
                    <div className="form-group">
                        <div className="form-group-range">
                            <label>Max</label>
                            <input type="number" className="form-control" defaultValue={this.props.element.maxValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'maxValue', 'value')} />
                            <input type="text" className="form-control" defaultValue={this.props.element.maxLabel} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'maxLabel', 'value')} />
                        </div>
                    </div>
                }
                { this.props.element.hasOwnProperty('defaultValue') && !this.props.element.hasOwnProperty('options') &&
                    <div className="form-group">
                        <label>Default Value</label>
                        <input type="text" className="form-control" defaultValue={this.props.element.defaultValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'defaultValue', 'value')} />
                    </div>
                }
                { this.props.element.hasOwnProperty('options') && !this.props.element.optionsUrl &&
                    <div className="form-group">
                        <DynamicOptionList ref="options" data={this.props.preview.state.data} updateElement={this.updateElement.bind(this)} preview={this.props.preview} element={this.props.element} key={this.props.element.options.length} isSystemField={systemFieldChecked} />
                    </div>
                }
                { this.props.element.hasOwnProperty('optionsUrl') &&
                    <div>
                        <div className="form-group">
                            <label>Options URL</label>
                            <input type="text" className="form-control" defaultValue={this.props.element.optionsUrl} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'optionsUrl', 'value')} />
                        </div>
                        <div className="form-group">
                            <label>Default Value</label>
                            <Select
                                multi     = {false}
                                options   = {this.state.options}
                                onChange  = {this.editDefaultValue.bind(this)}
                                onBlur    = {this.updateElement.bind(this)}
                                value     = {this.props.element.defaultValue} />
                        </div>
                    </div>
                }
                <button className="pull-right btn btn-primary" onClick={this.props.manualEditModeOff}>Save</button>
            </div>
        );
    }
}

FormElementsEdit.defaultProps = {
    className: 'edit-element-fields',
    isSuperUser: false
}
