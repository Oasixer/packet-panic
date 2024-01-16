import { Signal, signal } from "@preact/signals";
import { Component, JSX } from "preact";

import Readout from "@/Dashboard/General/Readout/Readout";
import TextReadout from "@/Dashboard/General/Readout/TextReadout/TextReadout";
import ToggleReadout from "@/Dashboard/General/Readout/ToggleReadout";

import type { ConnectionData } from "@/Dashboard/connectionData";
import ToggleProp from "@/Dashboard/General/ToggleProp";

export type ConnectionReadoutsProps = {
  connectionData: Signal<ConnectionData>;
};

export default class ConnectionReadouts extends Component<ConnectionReadoutsProps> {
  render() {
    const { connectionData } = this.props;
    return (
      <div className="flex flex-row gap-1 flex-wrap">
        <ToggleProp packetComputed={connectionData} propName="enabled" />
        <TextReadout propName="id" dataSignal={connectionData} />
        <TextReadout propName="protocol" dataSignal={connectionData} />
        <TextReadout propName="srcIP" dataSignal={connectionData} />
        <TextReadout propName="srcPort" dataSignal={connectionData} />
        <TextReadout propName="dstIP" dataSignal={connectionData} />
        <TextReadout propName="dstPort" dataSignal={connectionData} />
        <TextReadout propName="nPackets" dataSignal={connectionData} />
      </div>
    );
  }
}
