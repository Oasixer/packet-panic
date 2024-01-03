import { Component } from "preact";

import RawIcon from "@/Dashboard/Icons/RawIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import { Signal, signal } from "@preact/signals";
import { DisplayPacket } from "@/Dashboard/connectionData";
import RawPacketRow from "./RawPacketRow";
import { IpHeaderField, ipPacketMeta } from "@/Dashboard/packetTypes";
import { FmtTypePropName, fmtOrDefault } from "@/Dashboard/formatters";

export type RawPacketProps = {
  displayPacket: Signal<DisplayPacket>;
};

function swapFmt(sig: Signal<FmtTypePropName>) {
  let newValue = FmtTypePropName.labelFmt;
  if (sig.value === FmtTypePropName.labelFmt) {
    newValue = FmtTypePropName.hexFmt;
  }
  sig.value = newValue;
}

export default class RawPacket extends Component<RawPacketProps> {
  render() {
    const { displayPacket } = this.props;
    // const fmtProp = signal<FmtTypePropName>(FmtTypePropName.hexFmt);
    const fmtProp = signal<FmtTypePropName>(FmtTypePropName.labelFmt);
    const _swapFmt = () => {
      swapFmt(fmtProp);
    };
    return (
      <div className="flex flex-col gap-1">
        {ipPacketMeta.fields.map((row) => (
          <RawPacketRow
            displayPacket={displayPacket}
            rowFields={row}
            packetTypeMeta={ipPacketMeta}
            fmtProp={fmtProp}
          />
        ))}
        {<button onClick={_swapFmt}>butt</button>}
      </div>
    );
  }
}
