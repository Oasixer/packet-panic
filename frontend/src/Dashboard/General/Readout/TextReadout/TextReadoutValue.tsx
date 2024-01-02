import { Component } from "preact";

export type TextReadoutValueProps = {
  valueStr: string;
};

export default class TextReadoutValue extends Component<TextReadoutValueProps> {
  render() {
    const { valueStr: label } = this.props;
    // this.readoutValue.value = "DDD"
    return <p className="font-rubik4 text-sz3.5 text-white">{label}</p>;
  }
}
