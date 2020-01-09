import FormElement from './form-element';

export default class FormElementStatic extends FormElement {
    constructor(props) {
        super(props);

        this.static = true;
    }

	static defaultOptions() {
        return {
            label: ''
        }
    }

    renderReadOnly() {
        return this.renderComponent();
    }
}

FormElementStatic.static = true;
