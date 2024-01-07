import { Component } from "preact";

import { Signal } from "@preact/signals";
import { DisplayPacket } from "@/Dashboard/connectionData";
import {
  FmtTypePropName,
  fmtBytesToDec,
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
  [FmtTypePropName.labelFmt]: 40,
};

export function getReadoutWidth(
  fmtProp: FmtTypePropName,
  nBits: number,
  field?: Field,
): number {
  // rather jank code to handle 6 bit fields
  // by calculating (((16 bit)-(4 bit)-(pad))-pad)/2
  if (field && field.lenBits === 6) {
    let remainingSpaceAfterHalfByte =
      getReadoutWidth(fmtProp, 16) - getReadoutWidth(fmtProp, 4) - PAD;
    const final = (remainingSpaceAfterHalfByte - PAD) / 2;
    return final;
  }
  let displayNBits = 4; // starting from half-byte, which is 4 bits
  let displayPixels = halfByteSizes[fmtProp];
  while (displayNBits < nBits) {
    displayPixels *= 2;
    displayPixels += PAD;
    displayNBits *= 2;
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
  return fmtBytesToDec;
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
  const fmt = fmtOrDefaultWithHex(fmtProp, field[fmtProp]);
  const fmtText = fmt(byte);
  console.log("fmtText:", fmtText);
  return fmtText;
}

export default class RawPacketReadout extends Component<RawPacketReadoutProps> {
  render() {
    const { displayPacket, field, packetTypeMeta, fmtProp } = this.props;
    // console.log("field=", field);
    return (
      <div className="flex flex-row gap-1">
        {splitBytes(
          // should return ["xx", "xx", ...] or ["xxxx..."] depending on field.splitBytesInFmt
          getFieldValueByField(
            field,
            displayPacket.value[packetTypeMeta.headerProp],
          ),
          field,
          fmtProp, // temp override in case of label to not create multiple labels
        ).map((byte: string) => (
          <div
            style={{
              width: getReadoutWidth(fmtProp, byte.length * 4, field),
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
