import { FmtTypePropName } from "@/Dashboard/formatters";
import { Signal } from "@preact/signals";
import { Component } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import {
  reloadSelectedPacketGlobal,
  dashboardComponentSignals,
} from "@/Dashboard/Dashboard";
import { DisplayPacket } from "../connectionData";

export type TogglePropProps = {
  packetComputed: Signal<any>;
  propName: string;
};

export default class ToggleProp extends Component<TogglePropProps> {
  render() {
    const { packetComputed, propName } = this.props;
    const isChecked = packetComputed.value[propName];
    console.log("reload ya boi", packetComputed.value);
    const click = () => {
      packetComputed.value[propName] = !packetComputed.value[propName];
      reloadSelectedPacketGlobal();
    };
    return (
      <div
        className="flex flex-row h-6 items-center gap-3 bg-blue-bgInner px-3"
        onClick={click}
      >
        {/* <label className="h-fit">hex</label> */}
        <label className="text-sz3.5 font-rubik5 text-green-accent mr-0">
          {propName}
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
