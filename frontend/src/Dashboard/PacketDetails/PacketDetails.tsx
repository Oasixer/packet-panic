import { Signal, signal } from "@preact/signals";
import { Component } from "preact";

import BoxIcon from "@/Dashboard/Icons/BoxIcon";
import RawIcon from "@/Dashboard/Icons/RawIcon";
import Accordion from "@/Dashboard/General/Accordion";
import PacketDetailsReadouts from "./PacketDetailsReadouts";
import PacketManipulations from "./PacketManipulations";
import RawPacketSection from "./RawPacketSection/RawPacketSection";

import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import type { ConnectionData, DisplayPacket } from "@/Dashboard/connectionData";

export type PacketDetailsProps = {
  // displayPacket: Signal<DisplayPacket>;
};

export default class PacketDetails extends Component<PacketDetailsProps> {
  render() {
    console.log("PacketDetails->render()");
    const displayPacket = dashboardComponentSignals.packetDetails.displayPacket;
    return (
      <Accordion
        title="Packet Details"
        icon={<BoxIcon />}
        content={
          <div className="flex flex-col flex-nowrap gap-1">
            <PacketDetailsReadouts displayPacket={displayPacket} />
            <PacketManipulations />
            <Accordion
              title="Raw Packet"
              icon={<RawIcon />}
              content={<RawPacketSection displayPacket={displayPacket} />}
              openSignal={
                dashboardComponentSignals.rawPacket.accordionEnableSignal
              }
            />
          </div>
        }
        openSignal={
          dashboardComponentSignals.packetDetails.base.accordionEnableSignal
        }
        // maxWidth={800}
      />
    );
  }
}
