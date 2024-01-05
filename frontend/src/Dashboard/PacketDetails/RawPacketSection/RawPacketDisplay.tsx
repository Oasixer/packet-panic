import { Component } from "preact";

import RawIcon from "@/Dashboard/Icons/RawIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import { Signal, effect, signal } from "@preact/signals";
import { DisplayPacket, ProtoL3 } from "@/Dashboard/connectionData";
import RawPacketRow from "./RawPacketRow";
import ToggleHex from "./ToggleHex";
import {
  IpHeaderField,
  ipPacketMeta,
  tcpPacketMeta,
  udpPacketMeta,
} from "@/Dashboard/packetTypes";
import { FmtTypePropName, fmtOrDefault } from "@/Dashboard/formatters";
import { ByteLabelFormat } from "./ByteLabels";
import ByteLabels from "./ByteLabels";
import ToggleReadout from "@/Dashboard/General/Readout/ToggleReadout";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

export type RawPacketSectionProps = {
  displayPacket: Signal<DisplayPacket>;
  fmtProp: Signal<FmtTypePropName>;
  swappable: boolean;
  byteLabels: ByteLabelFormat;
  title: string;
};

export default class RawPacketSection extends Component<RawPacketSectionProps> {
  render() {
    const { displayPacket, fmtProp, swappable, byteLabels, title } = this.props;
    const l2PacketTypeMeta =
      displayPacket.value.proto === ProtoL3.UDP ? udpPacketMeta : tcpPacketMeta;
    console.log("displayPacket.value.proto:", displayPacket.value.proto);
    return (
      <div
        className={`flex flex-col gap-1 ${
          fmtProp.value === FmtTypePropName.labelFmt ? "flex-grow" : ""
        }`}
      >
        <div className="flex flex-row gap-1 h-8">
          <div className="bg-blue-bgInner flex flex-row flex-grow items-center pl-4">
            {/* <p className="h-fit */}
            <p className="h-fit font-rubik5 text-sz4 text-white font-rubik4 select-none">
              {title}
            </p>
          </div>
          {swappable && <ToggleHex fmtProp={fmtProp} />}
        </div>
        <div className="flex flex-col gap-3 p-4 bg-blue-bgInner">
          <div className="flex flex-row gap-2 flex-nowrap items-center">
            <div className="flex flex-col gap-1">
              <ByteLabels fmt={byteLabels} />
              {ipPacketMeta.fields.map((row) => (
                <RawPacketRow
                  displayPacket={displayPacket}
                  rowFields={row}
                  packetTypeMeta={ipPacketMeta}
                  fmtProp={fmtProp}
                />
              ))}
            </div>
            {fmtProp.value === FmtTypePropName.labelFmt && (
              <p className="font-monoCP text-sz4">
                {ipPacketMeta.rawHeaderLabel}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-2 flex-nowrap items-center">
            <div className="flex flex-col gap-1">
              {l2PacketTypeMeta.fields.map((row) => (
                <RawPacketRow
                  displayPacket={displayPacket}
                  rowFields={row}
                  packetTypeMeta={l2PacketTypeMeta}
                  fmtProp={fmtProp}
                />
              ))}
            </div>
            {fmtProp.value === FmtTypePropName.labelFmt && (
              <p className="font-monoCP text-sz4 mt-3.5">
                {l2PacketTypeMeta.rawHeaderLabel}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
