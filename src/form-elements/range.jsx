import React from 'react';
import FormElement from './util/form-element.jsx';

// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider'
 
// To include the default styles
// import 'react-rangeslider/lib/index.css'

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class Range extends FormElement {

    constructor(props) {
      super(props);
      if(!this.refElems) {
        this.refElems = {};
      }
      this.refElems = {
        ...this.refElems,
        rangeInput: React.createRef(),
      }

      this.state = {
        value: null,
      }

      this.setValue = this.setValue.bind(this)
    }

    static toolbarEntry() {
        return {
            element: 'Range',
            displayName: 'Range',
            icon: 'fa fa-sliders'
        };
    }

    static defaultOptions() {
        return {
            label: 'Placeholder Label',
            step: 1,
            defaultValue: 3,
            minValue: 1,
            maxValue: 5,
            minLabel: 'A Little',
            maxLabel: 'A Lot'
        }
    }

    setValue(val) {
        this.refElems.rangeInput.current.setState({
            value: val
        })

        this.setState({
            value: val,
        })
    }

     validateRequired() {
        return parseInt(this.state.value) >= 0 || parseInt(this.refElems.rangeInput.current.state.value) >= 0;
    }

    renderReadOnly() {
        let value = _.get(this.props, 'defaultValue', '');
        if (value) {
            return value + '/' + this.props.data.maxValue;
        } else {
            return '';
        }
    }

    renderComponent() {

        let props = this.baseInputProps();
        props.type = "range";
        props.list = "tickmarks_" + this.props.data.name;
        props.min = this.props.data.minValue;
        props.max = this.props.data.maxValue;
        props.step = this.props.data.step;

        props.defaultValue = this.props.defaultValue !== undefined ? parseInt(this.props.defaultValue, 10) : parseInt(this.props.data.defaultValue, 10);

        let datalist = [];
        for (var i=parseInt(this.props.data.minValue, 10); i <= parseInt(this.props.data.maxValue, 10); i += parseInt(this.props.data.step, 10)) {
            datalist.push(i);
        }

        let oneBig = 100 / (datalist.length - 1);

        let _datalist = datalist.map((d,idx) => {
            return <option key={props.list+'_'+idx}>{d}</option>
        })

        let visible_marks = datalist.map((d,idx) => {
            let option_props = {};
            let w = oneBig;
            if (idx === 0 || idx === datalist.length-1)
            w = oneBig/2;
            option_props.key = props.list+'_label_'+idx;
            option_props.style = {width: w + '%'};
            if (idx === datalist.length-1)
            option_props.style = {width: w + '%', textAlign: 'right'};
            return <label {...option_props}>{d}</label>
        })

        return (
            <div>
                <div className="range">
                    <div className="clearfix">
                        <span className="pull-left">{this.props.data.minLabel}</span>
                        <span className="pull-right">{this.props.data.maxLabel}</span>
                    </div>
                    <Slider 
                        ref={this.refElems.rangeInput}
                        value={this.state.value || props.defaultValue}
                        onChange={this.setValue}
                        
                        min={this.props.data.minValue}
                        max={this.props.data.maxValue}
                        step={this.props.data.step} />

                    <input type="hidden" name={props.name} value={this.state.value || props.defaultValue} />
                </div>
                <div className="visible_marks">
                    {visible_marks}
                </div>
                <datalist id={props.list}>
                    {_datalist}
                </datalist>
            </div>
        );
    }
}
