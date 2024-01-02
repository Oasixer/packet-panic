import { Component, JSX } from "preact";
import { Signal } from "@preact/signals";

// import ConnectionDetailsPane from "@/Dashboard/ConnectionDetailsPane/ConnectionDetailsPane";
// import ConnectionsPane from "@/Dashboard/ConnectionsPane/ConnectionsPane";
// import type { HeaderItem, RowItem } from "@/Dashboard/General/Table";

import Accordion from "@/Dashboard/General/Accordion";
import { Table } from "@/Dashboard/General/Table";
import ConnectionListIcon from "@/Dashboard/Icons/ConnectionListIcon2";
import type { ConnectionData } from "@/Dashboard/connectionData";

import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

type ConnectionListProps = {
  connections: Signal<ConnectionData[]>;
  selected: Signal<number>;
};

export default class ConnectionList extends Component<ConnectionListProps> {
  render() {
    const columnStructure = [
      { propName: "id", width: 40 },
      { propName: "method", label: "proto", width: 40 },
      { propName: "srcPort", width: 60 },
      { propName: "dstPort", width: 60 },
    ];

    // const table: JSX.Element = (
    // );

    return (
      <Accordion
        title={"Connection List"}
        icon={<ConnectionListIcon />}
        content={
          <Table
            columnStructure={columnStructure}
            selectedSignal={this.props.selected}
            dataSignal={this.props.connections}
          />
        }
        maxWidth={280}
        openSignal={
          dashboardComponentSignals.connectionList.base.accordionEnableSignal
        }
      />
    );
  }
}