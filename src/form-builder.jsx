/**
  * <ReactFormBuilder />
  */

import React from 'react';
import FormBuilderPreview from './form-builder-preview'
import Toolbar from './toolbar'
import ElementActions from './actions/ElementActions';

export default class FormBuilder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editElement: null,
      isSuperUser: props.isSuperUser
    }
    document.addEventListener("click", this.editModeOff.bind(this));

    this.refElems = {
      formbuilder: React.createRef(),
    }

    // Warn if navigating away and the form is dirty
    window.addEventListener("beforeunload", (e) => {
        if (this.isDirty()) {
            var confirmationMessage = 'You have unsaved changed on this form.  Are you sure you want to leave this page?';

            e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
            return confirmationMessage;              // Gecko, WebKit, Chrome <34
        }
    });
  }

  __secretSuperUserModeOn() {
    this.setState({
        isSuperUser: true
    });
  }

  editModeOn(data, e) {
    if (e) {
        e.stopPropagation();
    }

    if (this.state.editMode) {
      this.setState({editMode: !this.state.editMode, editElement: null});
    } else {
      this.setState({editMode: !this.state.editMode, editElement: data});
    }
  }

  manualEditModeOff() {
    if (this.state.editMode) {
      this.setState({
        editMode: false,
        editElement: null
      });
    }
  }

  editModeOff(e) {
    const $menu = $(".edit-form");
    let click_is_outside_menu = (!$menu.is(e.target) && $menu.has(e.target).length === 0);

    if (this.state.editMode && click_is_outside_menu) {
      this.setState({
        editMode: false,
        editElement: null
      });
    }
  }

  isDirty() {
      return this.refElems.formbuilder.current.state.isDirty;
  }

  save() {
      if (this.props.onSave) {
          this.props.onSave();
      }

      let callback = () => {
          if (this.props.onSaveComplete) {
              this.props.onSaveComplete();
          }

          this.refElems.formbuilder.current.setState({
              isDirty: false
          });
      }

      ElementActions.save(callback, this.props.onSaveError);
  }

  render() {
    let toolbarProps = {};
    if (this.props.toolbarItems)
      toolbarProps.items = this.props.toolbarItems;
    return (
      <div>
        <div className="react-form-builder clearfix">
          <div>
            <div className="react-form-builder-preview pull-left">
              <FormBuilderPreview
                  ref               = {this.refElems.formbuilder}
                  files             = {this.props.files}
                  manualEditModeOff = {this.manualEditModeOff.bind(this)}
                  parent            = {this}
                  url               = {this.props.url}
                  saveUrl           = {this.props.saveUrl}
                  customElements    = {this.props.customElements}
                  editModeOn        = {this.editModeOn}
                  editMode          = {this.state.editMode}
                  editElement       = {this.state.editElement}
                  isSuperUser       = {this.state.isSuperUser}
                  tags              = {this.props.tags}
                  reservationTypes  = {this.props.reservationTypes}
                  requestParams     = {this.props.requestParams} />
              <div className="text-right">
                <button className="btn btn-primary btn-big btn-agree" onClick={this.save.bind(this)}>Save</button>
              </div>
            </div>
            <Toolbar {...toolbarProps} />
          </div>
        </div>
      </div>
    );
  }

}

FormBuilder.defaultProps = {
    customElements: [],
    tags: [],
    reservationTypes: [],
    isSuperUser: false,
    requestParams: null,
}
