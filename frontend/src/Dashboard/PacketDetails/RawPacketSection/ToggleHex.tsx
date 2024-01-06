import { FmtTypePropName } from "@/Dashboard/formatters";
import { Signal } from "@preact/signals";
import { Component } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
    const swapFmt = () => {
      fmtProp.value =
        fmtProp.value === FmtTypePropName.hexFmt
          ? FmtTypePropName.decFmt
          : FmtTypePropName.hexFmt;
    };
    return (
      <div
        className="flex flex-row h-full items-center gap-3 bg-blue-bgInner px-3 cursor-pointer"
        onClick={swapFmt}
      >
        {/* <label className="h-fit">hex</label> */}
        <label className="text-sz3.5 font-rubik5 text-green-accent mr-0">
          Hex
        </label>
        <div className="flex flex-row">
          <div
            className={`checkmark ${
              isChecked
                ? "bg-green-accent border-none"
                : "bg-grey-900 border-2 border-grey-700"
            } h-[18px] w-[18px] flex flex-row items-center justify-center rounded-sm`}
          >
            {isChecked && (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-white"
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
