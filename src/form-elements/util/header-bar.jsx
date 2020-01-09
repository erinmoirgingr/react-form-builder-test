/**
  * <HeaderBar />
  */

import React from 'react';

export default class HeaderBar extends React.Component {
  render() {
    return (
      <div className="toolbar-header">
        <span className="label label-default">{this.props.displayName + (this.props.data.name ? (': ' + this.props.data.name) : '')}</span>
        <div className="toolbar-header-buttons">
          { this.props.data.hasOptions !== false &&
            <div className="btn is-isolated btn-school" onClick={this.props.editModeOn.bind(this.props.parent, this.props.data)}><i className="is-isolated fa fa-pencil-square-o"></i></div>
          }
          <div
              className="btn is-isolated btn-school"
              onClick={!this.props.data.cannotRemove && this.props.onDestroy.bind(this.props.parent, this.props.data)}>
              <i className={'is-isolated fa fa-trash-o' + (this.props.data.cannotRemove ? ' icon-disabled' : '')}></i>
          </div>
        </div>
      </div>
    );
  }
}
