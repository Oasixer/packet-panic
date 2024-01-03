import { Component } from "preact";

import { Signal } from "@preact/signals";
import { DisplayPacket } from "@/Dashboard/connectionData";
import { FmtTypePropName, fmtOrDefault } from "@/Dashboard/formatters";
import {
  Field,
  PacketTypeMeta,
  splitBytes,
  getFieldValueByField,
} from "@/Dashboard/packetTypes";

export type RawPacketReadoutProps = {
  displayPacket: Signal<DisplayPacket>;
  field: Field;
  packetTypeMeta: PacketTypeMeta;
  fmtProp: FmtTypePropName;
};

const HALF_BYTE = 24;
const PAD = 4;
const BYTE = HALF_BYTE * 2 + PAD;
const TWO_BYTE = BYTE * 2 + PAD;
const FOUR_BYTE = TWO_BYTE * 2 + PAD;

const byteSizes = {
  "0.5": HALF_BYTE,
  "1": BYTE,
  "2": TWO_BYTE,
  "4": FOUR_BYTE,
};

function decideDisplayText(
  byte: string,
  fmtProp: FmtTypePropName,
  field: Field,
  packetTypeMeta: PacketTypeMeta,
): string {
  console.log("byte: ", byte);
  if (fmtProp === FmtTypePropName.labelFmt) {
    return packetTypeMeta.labelSubs(field.label ?? field.id);
  }
  let fmt = fmtOrDefault(field[fmtProp]);
  return fmt(byte);
}

export default class RawPacketReadout extends Component<RawPacketReadoutProps> {
  render() {
    const { displayPacket, field, packetTypeMeta, fmtProp } = this.props;
    // console.log("fmtProp=", fmtProp);
    return (
      <div className="flex flex-row gap-1">
        {splitBytes(
          getFieldValueByField(
            field,
            displayPacket.value[packetTypeMeta.headerProp],
          ),
          fmtProp === FmtTypePropName.labelFmt, // temp override in case of label to not create multiple labels
        ).map((byte: string) => (
          <p
            style={{
              // width: byteSizes[field.lenBytes.toString()] + "px",
              width: byteSizes[(byte.length / 2).toString()] + "px",
              backgroundColor: field.color,
            }}
            className="h-5"
          >
            {decideDisplayText(byte, fmtProp, field, packetTypeMeta)}
          </p>
        ))}
      </div>
    );
  }
}
