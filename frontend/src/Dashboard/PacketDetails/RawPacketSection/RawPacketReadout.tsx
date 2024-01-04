import { Component } from "preact";

import { Signal } from "@preact/signals";
import { DisplayPacket } from "@/Dashboard/connectionData";
import {
  FmtTypePropName,
  fmtByteToDec,
  fmtDoNothing,
  fmtOrDefault,
} from "@/Dashboard/formatters";
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

const PAD = 4;
const halfByteSizes: { [key in FmtTypePropName]: number } = {
  [FmtTypePropName.hexFmt]: 20,
  [FmtTypePropName.decFmt]: 20,
  [FmtTypePropName.labelFmt]: 32,
};

function getReadoutWidth(fmtProp: FmtTypePropName, nBytes: number): number {
  let displayNBytes = 0.5;
  let displayPixels = halfByteSizes[fmtProp];
  while (displayNBytes < nBytes) {
    displayPixels *= 2;
    displayPixels += PAD;
    displayNBytes *= 2;
  }
  return displayPixels;
}

// default format fn for dec: use fmtByteToDec
// default format fn for hex: use fmtDoNothing
// either way, allow overriding with the optional fmt
function fmtOrDefaultWithHex(
  fmtProp: FmtTypePropName,
  fmt?: (input: string) => string,
): (input: string) => string {
  if (fmt !== undefined) {
    return fmt;
  }
  if (fmtProp === FmtTypePropName.hexFmt) {
    return fmtDoNothing;
  }
  return fmtByteToDec;
}

function decideDisplayText(
  byte: string,
  fmtProp: FmtTypePropName,
  field: Field,
  packetTypeMeta: PacketTypeMeta,
): string {
  // console.log("byte: ", byte);
  if (fmtProp === FmtTypePropName.labelFmt) {
    return packetTypeMeta.labelSubs(field.label ?? field.id);
  }
  let fmt = fmtOrDefaultWithHex(fmtProp, field[fmtProp]);
  return fmt(byte);
}

export default class RawPacketReadout extends Component<RawPacketReadoutProps> {
  render() {
    const { displayPacket, field, packetTypeMeta, fmtProp } = this.props;
    // console.log("field=", field);
    return (
      <div className="flex flex-row gap-1">
        {splitBytes(
          getFieldValueByField(
            field,
            displayPacket.value[packetTypeMeta.headerProp],
          ),
          field,
          fmtProp, // temp override in case of label to not create multiple labels
        ).map((byte: string) => (
          <div
            style={{
              // width: byteSizes[field.lenBytes.toString()] + "px",
              // width: byteSizes[(byte.length / 2).toString()] + "px",
              width: getReadoutWidth(fmtProp, byte.length / 2),
              backgroundColor: field.color,
            }}
            className="h-5 flex flex-row items-center justify-center"
          >
            <div className="font-monoCP text-black text-sz4 h-fit">
              {decideDisplayText(byte, fmtProp, field, packetTypeMeta)}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
