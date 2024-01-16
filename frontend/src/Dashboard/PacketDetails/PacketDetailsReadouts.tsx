import { Signal, signal } from "@preact/signals";
import { Component, JSX } from "preact";

import TextReadout from "@/Dashboard/General/Readout/TextReadout/TextReadout";
import ToggleReadout from "@/Dashboard/General/Readout/ToggleReadout";
// import IpHeaderTextReadout from "@/Dashboard/General/Readout/TextReadout/HeaderTextReadout/IpHeaderTextReadout";
// import UdpHeaderTextReadout from "@/Dashboard/General/Readout/TextReadout/HeaderTextReadout/UdpHeaderTextReadout";
import HeaderTextReadout from "@/Dashboard/General/Readout/TextReadout/HeaderTextReadout/HeaderTextReadout";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

import { fmtIp, fmt2BytesToDec, fmtTs } from "@/Dashboard/formatters";

import {
  IpHeaderField,
  UdpHeaderField,
  ipPacketMeta,
  udpPacketMeta,
} from "@/Dashboard/packetTypes";

import {
  protoHexToStr,
  type ConnectionData,
  type DisplayPacket,
} from "@/Dashboard/connectionData";
import ToggleProp from "@/Dashboard/General/ToggleProp";

export type PacketDetailsReadoutsProps = {
  displayPacket: Signal<DisplayPacket>;
};

export default class PacketDetailsReadouts extends Component<PacketDetailsReadoutsProps> {
  render() {
    const { displayPacket } = this.props;
    console.log("displayPacket update: ", displayPacket.value);
    return (
      <div className="flex flex-row gap-1 flex-wrap">
        <TextReadout label="no" propName="id" dataSignal={displayPacket} />
        <TextReadout
          label="ts"
          propName="ts"
          dataSignal={displayPacket}
          fmt={fmtTs}
        />
        <TextReadout label="no" propName="id" dataSignal={displayPacket} />
        <TextReadout
          propName="proto"
          dataSignal={displayPacket}
          // fmt={protoHexToStr}
        />
        {/* <HeaderTextReadout */}
        {/*   dataSignal={displayPacket} */}
        {/*   propId={IpHeaderField.protocol} */}
        {/*   packetTypeMeta={ipPacketMeta} */}
        {/*   // fmt={protoHexToStr} */}
        {/* /> */}

        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={IpHeaderField.totalLen}
          packetTypeMeta={ipPacketMeta}
          fmt={
            fmt2BytesToDec
          } /* port := 2 bytes to display as int, like totalLen */
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
          fmt={fmt2BytesToDec}
        />
        <HeaderTextReadout
          dataSignal={displayPacket}
          propId={UdpHeaderField.dstPort}
          packetTypeMeta={udpPacketMeta}
          fmt={fmt2BytesToDec}
        />
        <ToggleProp packetComputed={displayPacket} propName="saved" />
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
