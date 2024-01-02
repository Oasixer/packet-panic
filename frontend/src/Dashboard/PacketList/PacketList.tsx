import { Component } from "preact";

import Accordion from "@/Dashboard/General/Accordion";
import ListIcon from "@/Dashboard/Icons/ListIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

// export default class PacketManipulations extends Component<PacketManipulationsProps> {
export default class PacketManipulations extends Component {
  render() {
    return (
      <Accordion
        title="Packet List"
        icon={<ListIcon />}
        content={<p>temp</p>}
        openSignal={dashboardComponentSignals.packetList.accordionEnableSignal}
      />
    );
  }
}
