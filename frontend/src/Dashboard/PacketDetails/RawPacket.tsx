import { Component } from "preact";

import Accordion from "@/Dashboard/General/Accordion";
import RawIcon from "@/Dashboard/Icons/RawIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

// export default class PacketManipulations extends Component<PacketManipulationsProps> {
export default class RawPacket extends Component {
  render() {
    return (
      <Accordion
        title="Raw Packet"
        icon={<RawIcon />}
        content={<p>temp</p>}
        openSignal={dashboardComponentSignals.rawPacket.accordionEnableSignal}
      />
    );
  }
}
