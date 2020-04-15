import React from 'react';
import FormElement from './util/form-element.jsx';

// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider'
 
// To include the default styles
// import 'react-rangeslider/lib/index.css'

export default class Range extends FormElement {
    constructor(props) {
        super(props);

        this.state = {
            value: props.defaultValue !== undefined ? parseInt(props.defaultValue, 10) : parseInt(props.data.defaultValue, 10),
        }

        this.setValue = this.setValue.bind(this)
    }

    setValue(val) {
        this.setState({
            value: val,
        })
    }

    renderComponent() {
        let self  = this;
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
            option_props.style = {width: w + '%', cursor: 'pointer'};
            if (idx === datalist.length-1)
            option_props.style = {width: w + '%', textAlign: 'right', cursor: 'pointer'};
            return <label onClick={self.setValue.bind(self, d)} {...option_props}>{d}</label>
        })

        return (
            <div>
                <div className="range">
                    <div className="clearfix">
                        <span className="pull-left">{this.props.data.minLabel}</span>
                        <span className="pull-right">{this.props.data.maxLabel}</span>
                    </div>

                    <Slider 
                        value={this.state.value}
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