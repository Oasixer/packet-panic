import { FmtTypePropName } from "@/Dashboard/formatters";
import { Signal } from "@preact/signals";
import { Component } from "preact";

export type ToggleHexProps = {
  fmtProp: Signal<FmtTypePropName>;
};

export default class ToggleHex extends Component<ToggleHexProps> {
  handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.props.fmtProp.value = target.checked
      ? FmtTypePropName.hexFmt
      : FmtTypePropName.decFmt;
  };

  render() {
    const { fmtProp } = this.props;
    const isChecked = fmtProp.value === FmtTypePropName.hexFmt;

    return (
      <div className="flex flex-row h-full items-center gap-3 bg-blue-bgInner px-3">
        <label className="h-fit">hex</label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={this.handleChange}
          className="h-fit text-red-500 before:bg-red-500"
        />
      </div>
    );
  }
}
