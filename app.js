import React from "react";
import ReactDOM from "react-dom";
import DemoBar from './demobar';
import { FormBuilder } from "./src/app";

ReactDOM.render(
  <FormBuilder
      url="/ownerForm.json"
      isSuperUser={false} />,
  document.getElementById('form-builder')
)

ReactDOM.render(
  <DemoBar />,
  document.getElementById('demo-bar')
)
