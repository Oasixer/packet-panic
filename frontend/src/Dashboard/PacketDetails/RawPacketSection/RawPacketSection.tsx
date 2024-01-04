import { Component } from "preact";

import RawIcon from "@/Dashboard/Icons/RawIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import { Signal, signal } from "@preact/signals";
import { DisplayPacket } from "@/Dashboard/connectionData";
import RawPacketDisplay from "./RawPacketDisplay";
import { ByteLabelFormat } from "./ByteLabels";
import { IpHeaderField, ipPacketMeta } from "@/Dashboard/packetTypes";
import { FmtTypePropName, fmtOrDefault } from "@/Dashboard/formatters";

export type RawPacketSectionProps = {
  displayPacket: Signal<DisplayPacket>;
};

// basically i wanna use ToggleReadout which expects an enclosing object in a signal
export default class RawPacketSection extends Component<RawPacketSectionProps> {
  render() {
    const { displayPacket } = this.props;
    // const fmtProp = signal<FmtTypePropName>(FmtTypePropName.hexFmt);
    const mainFmtProp = signal<FmtTypePropName>(FmtTypePropName.hexFmt);
    const labelFmtProp = signal<FmtTypePropName>(FmtTypePropName.labelFmt);

    return (
      <div className="flex flex-row gap-1">
        <RawPacketDisplay
          displayPacket={displayPacket}
          fmtProp={mainFmtProp}
          swappable={true}
          byteLabels={ByteLabelFormat.nums}
          title="Raw Data"
        />
        <RawPacketDisplay
          displayPacket={displayPacket}
          fmtProp={labelFmtProp}
          swappable={false}
          byteLabels={ByteLabelFormat.names}
          title="Legend"
        />
      </div>
    );
  }
}
