import { Signal, signal } from "@preact/signals";
import { Component, JSX } from "preact";

import TextReadout from "@/Dashboard/General/Readout/TextReadout/TextReadout";
import ToggleReadout from "@/Dashboard/General/Readout/ToggleReadout";
// import IpHeaderTextReadout from "@/Dashboard/General/Readout/TextReadout/HeaderTextReadout/IpHeaderTextReadout";
// import UdpHeaderTextReadout from "@/Dashboard/General/Readout/TextReadout/HeaderTextReadout/UdpHeaderTextReadout";
import HeaderTextReadout from "@/Dashboard/General/Readout/TextReadout/HeaderTextReadout/HeaderTextReadout";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

import { fmtIp, fmtPort, fmtTs } from "@/Dashboard/formatters";

import {
  IpHeaderField,
  UdpHeaderField,
  ipPacketMeta,
  udpPacketMeta,
} from "@/Dashboard/packetTypes";

import type { ConnectionData, DisplayPacket } from "@/Dashboard/connectionData";

export type PacketDetailsReadoutsProps = {
  displayPacket: Signal<DisplayPacket>;
};

export default class PacketDetailsReadouts extends Component<PacketDetailsReadoutsProps> {
  render() {
    const { displayPacket } = this.props;
    return (
      <div className="flex flex-row gap-1 flex-wrap">
        <TextReadout label="no" propName="id" dataSignal={displayPacket} />
        <TextReadout
          label="ts"
          propName="ts"
          dataSignal={displayPacket}
          fmt={fmtTs}
        />
        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={IpHeaderField.protocol}
          packetTypeMeta={ipPacketMeta}
        />

        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={IpHeaderField.totalLen}
          packetTypeMeta={ipPacketMeta}
          fmt={fmtPort} /* port := 2 bytes to display as int, like totalLen */
        />

        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={IpHeaderField.srcIP}
          packetTypeMeta={ipPacketMeta}
          fmt={fmtIp}
        />

        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={IpHeaderField.dstIP}
          packetTypeMeta={ipPacketMeta}
          fmt={fmtIp}
        />

        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={UdpHeaderField.srcPort}
          packetTypeMeta={udpPacketMeta}
          fmt={fmtPort}
        />
        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={UdpHeaderField.dstPort}
          packetTypeMeta={udpPacketMeta}
          fmt={fmtPort}
        />
        <button
          className="rounded-sm bg-green-subdued color-white px-2 opacity-85 text-sz3.5 font-rubik5 min-h-6"
          onClick={() => {
            dashboardComponentSignals.connectionList.selectedItemSignal.value =
              displayPacket.value.connectionId;
          }}
        >
          Show Connection
        </button>
      </div>
    );
  }
}
