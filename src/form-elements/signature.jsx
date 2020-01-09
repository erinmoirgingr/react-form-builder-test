import React from 'react';
import ReactDOM from 'react-dom';
import FormElement from './util/form-element.jsx';

import SignaturePad from 'react-signature-pad';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class Signature extends FormElement {

    constructor(props) {
        super(props);

        this.state = {
            showPad: false
        };
    }
    static toolbarEntry() {
        return {
            element: 'Signature',
            displayName: 'Signature',
            icon: 'fa fa-pencil-square-o'
        };
    }

    static defaultOptions() {
        return {
            label: 'Signature'
        }
    }

    validate() {
        let isEmpty     = (this.props.defaultValue !== undefined && this.props.defaultValue.length > 0 ? false : true);
        let $input_sig  = ReactDOM.findDOMNode(this.refs.input);

        if(this.refs.canvas) {
            let $canvas_sig  = this.refs.canvas;
            let base64       = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
            isEmpty          = $canvas_sig.isEmpty();
            $input_sig.value = base64;
        }

        if(isEmpty === undefined) {
            isEmpty = true;
        }

        if(isEmpty) {
            $input_sig.value = "";
        }

        return true;
    }

    componentDidMount() {
        if (this.props.defaultValue !== undefined && this.props.defaultValue.length > 0 && this.state.showPad) {
            let canvas = this.refs.canvas;
            canvas.fromDataURL('data:image/png;base64,' + this.props.defaultValue);
        }
    }

    toggleShowPad() {
        this.setState({
            showPad: !this.state.showPad
        }, function() {
            if(this.props.defaultValue !== undefined && this.props.defaultValue.length > 0) {
                let canvas = this.refs.canvas;
                canvas.fromDataURL('data:image/png;base64,' + this.props.defaultValue);
            }
        })
    }

    onChange(data) {
       if(this.refs.canvas) {
            let $input_sig   = ReactDOM.findDOMNode(this.refs.input);
            let $canvas_sig  = this.refs.canvas;
            let base64       = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
            $input_sig.value = base64;
        }
    }

    renderComponent() {
        let props = this.baseInputProps();
        props.type = "hidden";

        let pad_props = {};
        pad_props.clearButton = {true};
        pad_props.height = 200;
        pad_props.width  = $(".container").width() || window.innerWidth;
        if (this.props.mutable) {
            pad_props.defaultValue = this.props.defaultValue;
            pad_props.ref = 'canvas';
            pad_props.onEnd = this.onChange.bind(this);
        }
        return (
            <div>
                {(this.state.showPad) ?
                    <div>
                        <SignaturePad {...pad_props} />
                    </div>
                :
                    <a className="btn btn-default" onClick={this.toggleShowPad.bind(this)}>
                        {"I'm ready to sign"}
                    </a>
                }   
                <input {...props} />
            </div>
        );
    }

    renderReadOnly() {
        if(this.props.defaultValue) {
            return (
                <img src={"data:image/png;base64," + this.props.defaultValue} style={{maxHeight: "100px", width: "100%"}} />
            )
        }

        return (
            <div></div>
        )
    }
}
