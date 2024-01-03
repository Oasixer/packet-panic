import { Component } from "preact";

import { Signal } from "@preact/signals";
import { DisplayPacket } from "@/Dashboard/connectionData";
import RawPacketReadout from "./RawPacketReadout";
import type { Field, PacketTypeMeta } from "@/Dashboard/packetTypes";
import { FmtTypePropName } from "@/Dashboard/formatters";

export type RawPacketRowProps = {
  displayPacket: Signal<DisplayPacket>;
  rowFields: Field[];
  packetTypeMeta: PacketTypeMeta;
  fmtProp: Signal<FmtTypePropName>;
};
export default class RawPacketRow extends Component<RawPacketRowProps> {
  render() {
    const { displayPacket, rowFields, packetTypeMeta, fmtProp } = this.props;
    return (
      <div className="flex flex-row gap-1">
        {rowFields.map((field) => (
          <RawPacketReadout
            displayPacket={displayPacket}
            field={field}
            packetTypeMeta={packetTypeMeta}
            fmtProp={fmtProp.value}
          />
        ))}
      </div>
    );
  }
}
