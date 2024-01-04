import { Signal, signal } from "@preact/signals";
import { Component, JSX } from "preact";

import Readout from "@/Dashboard/General/Readout/Readout";
import TextReadout from "@/Dashboard/General/Readout/TextReadout/TextReadout";
import ToggleReadout from "@/Dashboard/General/Readout/ToggleReadout";

import type { ConnectionData } from "@/Dashboard/connectionData";

export type ConnectionReadoutsProps = {
  connectionData: Signal<ConnectionData>;
};

export default class ConnectionReadouts extends Component<ConnectionReadoutsProps> {
  render() {
    const { connectionData } = this.props;
    return (
      <div className="flex flex-row gap-1 flex-wrap">
        <ToggleReadout propName="enabled" dataSignal={connectionData} />
        <TextReadout propName="id" dataSignal={connectionData} />
        <TextReadout propName="proto" dataSignal={connectionData} />
        <TextReadout propName="srcIP" dataSignal={connectionData} />
        <TextReadout propName="srcPort" dataSignal={connectionData} />
        <TextReadout propName="dstIP" dataSignal={connectionData} />
        <TextReadout propName="dstPort" dataSignal={connectionData} />
        <TextReadout propName="nPackets" dataSignal={connectionData} />
      </div>
    );
  }
}
