import { Component } from "preact";

import Accordion from "@/Dashboard/General/Accordion";
import ManipulationsIcon from "@/Dashboard/Icons/ManipulationsIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

// export default class PacketManipulations extends Component<PacketManipulationsProps> {
export default class PacketManipulations extends Component {
  render() {
    return (
      <Accordion
        title="Packet Manipulations"
        icon={<ManipulationsIcon />}
        content={<p>temp</p>}
        openSignal={
          dashboardComponentSignals.packetManips.accordionEnableSignal
        }
      />
    );
  }
}
