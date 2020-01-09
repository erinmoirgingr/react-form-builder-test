import React from 'react';
import ReactDOM from 'react-dom';

import SortableItem from 'react-sortable-items/SortableItem';

import HeaderBar from './header-bar.jsx';
import HeaderLabels from './header-labels.jsx';

export default class FormElement extends SortableItem {
    constructor(props) {
        super(props);

        this.htmlId = _.uniqueId('react-form-builder_' + props.data.name + '_');
    }

    static toolbarEntry() {
        console.error('toolbarEntry is required on all input classes');
    }

    static defaultOptions() {
        console.error('defaultOptions is required on all input classes');
    }

    headerBarProps() {
        return {
            parent:         this.props.parent,
            editModeOn:     this.props.editModeOn,
            data:           this.props.data,
            onDestroy:      this.props._onDestroy,
            onEdit:         this.props.onEdit,
            static:         this.props.data.static,
            required:       this.props.data.required,
            displayName:    this.constructor.toolbarEntry().displayName
        }
    }

    headerLabelProps() {
        return {
            data:      this.props.data,
            label:     this.props.data.label,
            description: this.props.data.description,
            htmlFor:   this.htmlId,
            mutable:   this.props.mutable,
            readOnly:  this.props.readOnly
        }
    }

    baseInputProps() {
        let props = {
            ref:            'input',
            id:             this.htmlId,
            name:           this.props.data.name,
            readOnly:       this.props.mutable === false,
            disabled:       this.props.mutable === false,
        }

        if(this.props.inputPrefix) {
            props.name = this.props.inputPrefix + "[" + props.name + "]";
        }

        if (this.props.autoComplete === false) {
            props.autoComplete = 'nope';
        }

        if (this.props.suppressData !== true && this.props.defaultValue !== undefined) {
            if (this.props.mutable) {
                props.defaultValue = this.props.defaultValue;
            } else {
                props.value = this.props.defaultValue;
            }
        }

        return props;
    }

    /**
    * Default required validation that just checks if there's input in the element
    * Override if needed
    * @return {boolean}} True if this element has a value, false if not
    */
    validateRequired() {
        if (this.refs.input !== undefined) {
            let item = ReactDOM.findDOMNode(this.refs.input);

            return item.value.trim().length > 0;
        }
    }

    renderReadOnly() {
        return _.get(this.props, 'defaultValue', '');
    }

    renderComponent() {
        console.error('All form elements must define their own renderComponent method');
    }

    render() {
        let element;
        let item;

        if(this.props.readOnly === true) {
            item = this.renderReadOnly();
        }
        else if(this.props.isTable) {
            item = (<td>{this.renderReadOnly()}</td>);
        } else {
            item = this.renderComponent();
        }

        if(this.props.isTable) {
            return item;
        }

        // Show the full item with padding if we're editing and we're not static
        // Just display the element if it's static though, since otherwise there's too much padding around it
        if (!this.props.mutable || !this.static) {
            element = (
                <div className={'rfb-item ' + (this.props.inline ? 'rfb-inline ' : '') + (this.props.hidden || !this.props.isVisible ? ' rfb-hidden' : '')}>
                    { !this.props.mutable &&
                        <HeaderBar {...this.headerBarProps()} />
                    }
                    <div className="form-group">
                        {
                            !this.static && !this.props.inline &&
                            <HeaderLabels {...this.headerLabelProps()}/>
                        }
                        {
                            !this.static && this.props.inline
                            ?
                            <div>
                                <HeaderLabels {...this.headerLabelProps()}/>
                                <span>: </span>
                                {item}
                            </div>
                            :
                            <div>
                                {item}
                            </div>
                        }

                    </div>
                </div>
            );
        } else if(this.props.inline || this.props.hidden || !this.props.isVisible) {
            element = <div className={'rfb-item ' + (this.props.inline ? 'rfb-inline ' : '') + (this.props.hidden || !this.props.isVisible ? ' rfb-hidden' : '')}>{item}</div>;
        } else {
            element = item;
        }

        if (!this.props.mutable) {
            return this.renderWithSortable(element);
        } else {
            return element;
        }
    }
}
