import React from 'react';
import FormElement from './util/form-element.jsx';
import SliderNativeBootstrap from 'react-bootstrap-native-slider';

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

     validateRequired() {
        return parseInt(this.refElems.rangeInput.current.state.value) >= 0;
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
                    <SliderNativeBootstrap
                        ref={this.refElems.rangeInput}
                        name={props.name}
                        value={props.defaultValue}
                        step={this.props.data.step}
                        max={this.props.data.maxValue}
                        min={this.props.data.minValue} />
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
