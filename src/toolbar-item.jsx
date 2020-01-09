/**
  * <ToolbarItem />
  */

import React from 'react';

export default class Toolbar extends React.Component {
  render() {
    return(
      <li className="toolbar-item" onClick={this.props.onClick}><i className={this.props.data.icon}></i>{this.props.data.displayName}</li>
    )
  }
}
