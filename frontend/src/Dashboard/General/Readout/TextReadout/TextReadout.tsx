import { signal, Signal } from "@preact/signals";
import { Component } from "preact";

import Readout from "../Readout";
import TextReadoutValue from "./TextReadoutValue";

export type TextReadoutProps = {
  label?: string; // by default use propName
  dataSignal: Signal<any>;
  propName: string;
  fmt?: (input: string) => string;
};

export default class TextReadout extends Component<TextReadoutProps> {
  render() {
    const { label, dataSignal, propName, fmt } = this.props;
    console.log("propName", propName);
    console.log("dataSignal.value:", dataSignal.value);
    let _fmt = fmt;
    if (_fmt === undefined) {
      _fmt = (stringy: string) => {
        return stringy;
      };
    }
    return (
      <Readout
        label={label ?? propName}
        valueElement={
          <TextReadoutValue
            valueStr={_fmt(dataSignal.value[propName]) ?? "_dne"}
          />
        }
      />
    );
  }
}
