import { Component, JSX } from "preact";

export type ReadoutProps = {
  label: string;
  valueElement: JSX.Element;
};

export default class Readout extends Component<ReadoutProps> {
  render() {
    const { label, valueElement: readoutElement } = this.props;

    return (
      <div className="flex flex-row flex-nowrap items-center h-6 bg-blue-bgInner flex-grow p-2">
        <p className="text-sz3.5 font-rubik5 text-green-accent mr-2">{label}</p>
        {readoutElement}
      </div>
    );
  }
}
