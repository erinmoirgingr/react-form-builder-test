import React from 'react';
import FormElement from './util/form-element.jsx';

import HeaderBar from './util/header-bar.jsx';
import HeaderLabels from './util/header-labels.jsx';

export default class Camera extends FormElement {
    constructor(props) {
        super(props);

        this.displayImage = this.displayImage.bind(this);
        this.clearImage   = this.clearImage.bind(this);

        this.state = {
            img: props.defaultValue
        };
    }

    static toolbarEntry() {
        return {
            element: 'Camera',
            displayName: 'Camera',
            icon: 'fa fa-camera'
        };
    }

    static defaultOptions() {
        return {
            label: 'Placeholder Label'
        }
    }

    displayImage(e) {
        var self   = this;
        var target = e.target;

        if(target.files && target.files.length) {

            this.setState({
                img: this.props.data.loadingURL || '/assets/img/ajax-loaders/11.gif'
            })

            var data = new FormData(); 
            var file = target.files[0];

            data.append('file', file, file.name);
            data.append('key', window.apiKey);
            data.append('json', 'true');

            $.ajax({
                url: this.props.data.postURL || "/api/v1/upload",
                type: "POST",
                processData: false,
                contentType: false,
                data: data,
                success: function(data) {
                    self.setState({
                        img: data.url
                    })
                },
                error: function(data) {
                    self.clearImage()
                }
            });
        }
    }

    clearImage() {
        this.setState({
            img: null
        })
    }

    renderReadOnly() {
        return (
            <img src={this.state.img} height="100" />
        );
    }

    renderComponent() {
        return (
            <div className="image-upload-container">
                <input {...this.baseInputProps()} type="hidden" value={this.state.img !== null ? this.state.img : ''} />
                { !this.state.img &&
                    <div>
                        <input type="file" accept="image/*" className="image-upload" onChange={this.displayImage} />
                        <div className="image-upload-control">
                            <div className="btn btn-default btn-school"><i className="fa fa-camera"></i> Upload Photo</div>
                            <p>Select an image from your computer or device.</p>
                        </div>
                    </div>
                }

                { this.state.img &&
                    <div>
                        <img src={ this.state.img } style={{maxHeight: "100px"}} className="image-upload-preview" />
                        <br />
                        <div className="btn btn-school btn-image-clear" onClick={this.clearImage}>
                            <i className="fa fa-times"></i> Clear Photo
                        </div>
                    </div>
                }

            </div>
        );
    }
}