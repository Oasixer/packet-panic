import ConnectionDetailsPane from "@/Dashboard/ConnectionDetailsPane/ConnectionDetailsPane";
import ConnectionsPane from "@/Dashboard/ConnectionsPane/ConnectionsPane";
import { Table } from "@/Dashboard/General/Table";
import Accordion from "@/Dashboard/General/Accordion";
import type { HeaderItem, RowItem } from "@/Dashboard/General/Table";
import ConnectionListIcon from "@/Dashboard/Icons/ConnectionListIcon";
import { Component, JSX } from "preact";

let sampleHeader: HeaderItem[] = [
  { text: "id", width: 40 }, // 32.f
  { text: "proto", width: 40 }, // 32.f
  { text: "srcPort", width: 60 }, // 34.f
  // { text: "->", width: 9 }, // 9.f
  { text: "dstPort", width: 60, alignRight: true }, // 34.f
  // {text: undefined, icon: undefined, width: 6969, disabled: true}, // eye icon?
];

export default class ConnectionList extends Component {
  render() {
    const table: JSX.Element = <Table header={sampleHeader} />;
    return (
      <>
        <Accordion
          title={"Connections List"}
          icon={<ConnectionListIcon />}
          content={table}
          maxWidth={280}
        />
      </>
    );
  }
}
