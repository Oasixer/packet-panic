import { signal, computed, Signal } from "@preact/signals";
import { Component, JSX } from "preact";

import type { ConnectionData } from "@/Dashboard/connectionData";
import { sampleConnections } from "@/Dashboard/connectionData";
import Accordion from "@/Dashboard/General/Accordion";
import LinkIcon from "@/Dashboard/Icons/LinkIcon";
import VStackIcon from "@/Dashboard/Icons/VStackIcon";
import ConnectionSpeedGraph from "@/Dashboard/ConnectionDetails/ConnectionSpeedGraph";
import ConnectionPackets from "@/Dashboard/ConnectionDetails/ConnectionPackets";
import SpeedGraphIcon from "@/Dashboard/Icons/SpeedGraphIcon";
import ConnectionReadouts from "@/Dashboard/ConnectionDetails/ConnectionReadouts";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

type ConnectionDetailsProps = {
  // connections: Signal<ConnectionData[]>; connectionData: Signal<ConnectionData>;
  connections: Signal<ConnectionData[]>;
  selected: Signal<number>;
};

export default class ConnectionsList extends Component<ConnectionDetailsProps> {
  // intervalId = null;
  // updated = 0;
  // connectionData = signal<ConnectionData>(sampleConnections[0]);

  // readouts: JSX.Element[] = (
  // );

  // componentDidMount() {
  //   this.intervalId = setInterval(() => {
  //     if (this.updated < 1) {
  //       this.connectionData.value = sampleConnections[1];
  //       this.updated++;
  //     } else {
  //       clearInterval(this.intervalId);
  //     }
  //   }, 1000);
  // }

  render() {
    const connectionData: Signal<ConnectionData> = computed(() => {
      return this.props.connections.value[this.props.selected.value];
    });
    return (
      <Accordion
        title={"Connection Details"}
        icon={<LinkIcon />}
        content={
          <div className="flex flex-col flex-nowrap gap-1">
            <ConnectionReadouts connectionData={connectionData} />
            <Accordion
              title={"Connection Packets"}
              icon={<VStackIcon />}
              content={<ConnectionPackets connectionData={connectionData} />}
              openSignal={
                dashboardComponentSignals.connectionPackets
                  .accordionEnableSignal
              }
            />
            <Accordion
              title="Connection Speed Graph"
              icon={<SpeedGraphIcon />}
              content={<ConnectionSpeedGraph placeholder="blah" />}
              openSignal={
                dashboardComponentSignals.connectionSpeedGraph
                  .accordionEnableSignal
              }
            />
          </div>
        }
        maxWidth={280}
        openSignal={
          dashboardComponentSignals.connectionDetails.accordionEnableSignal
        }
      />
    );
  }
}
