import { Signal, computed, signal } from "@preact/signals";
import { Component, JSX } from "preact";

import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import { ConnectionData, DisplayPacket } from "@/Dashboard/connectionData";
import { Table } from "@/Dashboard/General/Table";
import type { HeaderField } from "@/Dashboard/General/Table";

export type ConnectionPacketsProps = {
  connectionData: Signal<ConnectionData>;
};

export default class ConnectionPackets extends Component<ConnectionPacketsProps> {
  render() {
    // i wanna be able to filter by pretty much any element of the damn packet...
    const { connectionData } = this.props;
    console.log("connectionData: ", connectionData.value);

    const headerFields: HeaderField[] = [
      { propName: "id", label: "no", width: 40 },
      { propName: "tsFmt", label: "ts", width: 90 },
      { propName: "len", width: 20 },

      // { propName: "srcPort", width: 60 },
      // { propName: "dstPort", width: 60 },
    ];

    const dataSignal: Signal<DisplayPacket[]> = computed(() => {
      return connectionData.value.packets;
    });
    return (
      <Table
        headerFields={headerFields} // TODO: perhaps use the connectionPackets signal here instead of sharing, and manually sync the two signals?
        selectedSignal={dashboardComponentSignals.allPackets.selectedItemSignal}
        dataSignal={dataSignal}
      />
    );
  }
}
