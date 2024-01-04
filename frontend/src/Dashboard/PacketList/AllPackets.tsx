import { Signal, computed, signal } from "@preact/signals";
import { Component, JSX } from "preact";

import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import { DisplayPacket } from "@/Dashboard/connectionData";
import { Table } from "@/Dashboard/General/Table";
import type { HeaderField } from "@/Dashboard/General/Table";

export type AllPacketsProps = {
  allPackets: Signal<DisplayPacket[]>;
};

export default class AllPackets extends Component<AllPacketsProps> {
  render() {
    // i wanna be able to filter by pretty much any element of the damn packet...
    const { allPackets } = this.props;
    // console.log("connectionData: ", connectionData.value);

    const headerFields: HeaderField[] = [
      { propName: "id", label: "no", width: 40 },
      { propName: "proto", width: 40 },
      { propName: "tsFmt", label: "ts", width: 90 },
      { propName: "connectionId", label: "conn", width: 40 },
      { propName: "len", width: 30 },
      // { propName: "saved", width: 50 },
      { propName: "srcPort", width: 60 },
      { propName: "dstPort", width: 60 },
    ];

    // const dataSignal: Signal<DisplayPacket[]> = computed(() => {
    //   return connectionData.value.packets;
    // });
    return (
      <Table
        headerFields={headerFields}
        selectedSignal={dashboardComponentSignals.allPackets.selectedItemSignal}
        dataSignal={allPackets}
      />
    );
  }
}
