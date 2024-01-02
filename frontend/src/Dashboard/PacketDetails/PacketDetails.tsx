import { Signal, signal } from "@preact/signals";
import { Component } from "preact";

import BoxIcon from "@/Dashboard/Icons/BoxIcon";
import Accordion from "@/Dashboard/General/Accordion";
import PacketDetailsReadouts from "./PacketDetailsReadouts";
import PacketManipulations from "./PacketManipulations";
import RawPacket from "./RawPacket";

import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import type { ConnectionData, DisplayPacket } from "@/Dashboard/connectionData";

export type PacketDetailsProps = {
  displayPacket: Signal<DisplayPacket>;
};

export default class PacketDetails extends Component<PacketDetailsProps> {
  render() {
    const { displayPacket } = this.props;
    return (
      <Accordion
        title="Packet Details"
        icon={<BoxIcon />}
        content={
          <div className="flex flex-col flex-nowrap gap-1">
            <PacketDetailsReadouts displayPacket={displayPacket} />
            <PacketManipulations />
            <RawPacket />
          </div>
        }
        openSignal={
          dashboardComponentSignals.packetDetails.accordionEnableSignal
        }
        maxWidth={800}
      />
    );
  }
}
