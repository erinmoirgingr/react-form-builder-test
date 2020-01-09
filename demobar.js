import React from "react";
import ElementStore from './src/stores/ElementStore';
import { FormGenerator } from './src/app';

export default class Demobar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [{"label":"Photo","id":"7A09A234-759D-489D-BE10-EFE5FBD7E612","element":"Camera","name":"image","tags":"details,dashboard","systemField":true,"fieldExists":true}],
      previewVisible: false
    }

    ElementStore.listen(this._onChange.bind(this));
  }

  showPreview() {
    this.setState({
      previewVisible: true
    })
  }

  closePreview() {
    this.setState({
      previewVisible: false
    })
  }

  _onChange(data) {
    if (data.error === undefined) {
      this.setState({
        data: data
      });
    }
  }

  render() {
    var modalClass = 'modal';
    if(this.state.previewVisible) {
      modalClass += ' show';
    }

    return(
      <div className="clearfix" style={{margin:'10px', width:'70%'}}>
        <h4 className="pull-left">Preview</h4>
        <button className="btn btn-primary pull-right" style={{ marginRight: '10px'}} onClick={this.showPreview.bind(this)}>Preview Generated Form</button>
        <div className={modalClass}>
          <div className="modal-dialog">
            <div className="modal-content">
              <FormGenerator download_path="" back_action="" answerData={{}} form_action="/" form_method="POST" data={this.state.data} />
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
