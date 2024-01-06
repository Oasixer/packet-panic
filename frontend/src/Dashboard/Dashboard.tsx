import { Component } from "preact";
import { computed, signal, Signal } from "@preact/signals";

import ConnectionList from "@/Dashboard/ConnectionList/ConnectionList";
import ConnectionDetails from "@/Dashboard/ConnectionDetails/ConnectionDetails";
import PacketDetails from "@/Dashboard/PacketDetails/PacketDetails";
import PacketList from "@/Dashboard/PacketList/PacketList";
import PanelLayout from "@/Dashboard/General/PanelLayout";
import {
  // dummyPacket,
  getPacketById_TODO_perf,
  infoUpdateFromJsonStr,
  ProtoL3,
  sampleConnections,
  updateConnectionsFromInfoUpdate,
} from "@/Dashboard/connectionData";
import type { ConnectionData, DisplayPacket } from "@/Dashboard/connectionData";

const dummyPacket: DisplayPacket = {
  id: -1,
  packetNumLocal: 0,
  connectionId: -1,
  ipHeaderRaw: "",
  l4HeaderRaw: "",
  srcIP: "",
  dstIP: "",
  srcPort: "",
  dstPort: "",
  proto: ProtoL3.TCP,
  len: 1,
  ts: new Date().getTime(),
  tsFmt: "",
  manips: [],
  saved: true,
};

export interface TableComponentState {
  selectedItemSignal?: Signal<number>;
  dataRows: Signal<any[]>;
  base: ComponentState; // composition baby
}
export interface PacketComponentState {
  displayPacket: Signal<DisplayPacket>;
  base: ComponentState; // composition baby
}

export interface ComponentState {
  accordionEnableSignal: Signal<boolean>;
}

export interface DashboardComponentSignals {
  connectionList: TableComponentState;
  connectionDetails: ComponentState;
  connectionPackets: ComponentState;
  connectionSpeedGraph: ComponentState;
  packetList: ComponentState;
  allPackets: TableComponentState;
  savedPackets: ComponentState;
  packetDetails: PacketComponentState;
  packetManips: ComponentState;
  rawPacket: ComponentState;
}

export const dashboardComponentSignals: DashboardComponentSignals = {
  connectionList: {
    base: { accordionEnableSignal: signal<boolean>(true) },
    selectedItemSignal: signal<number>(0),
    dataRows: signal<any[]>([]),
  },
  connectionDetails: { accordionEnableSignal: signal<boolean>(true) },
  // connectionPackets: {
  //   base: { accordionEnableSignal: signal<boolean>(false) },
  //   selectedItemSignal: signal<number>(0),
  // },
  connectionPackets: {
    accordionEnableSignal: signal<boolean>(true),
  },
  connectionSpeedGraph: { accordionEnableSignal: signal<boolean>(false) },
  // packetList: { accordionEnableSignal: signal<boolean>(false) },
  packetList: { accordionEnableSignal: signal<boolean>(true) },
  allPackets: {
    base: { accordionEnableSignal: signal<boolean>(true) },
    selectedItemSignal: signal<number>(0),
    dataRows: signal<any[]>([]),
  },
  savedPackets: { accordionEnableSignal: signal<boolean>(true) },
  packetDetails: {
    displayPacket: signal<DisplayPacket>(dummyPacket),
    base: { accordionEnableSignal: signal<boolean>(true) },
  },
  packetManips: { accordionEnableSignal: signal<boolean>(false) },
  rawPacket: { accordionEnableSignal: signal<boolean>(true) },
};

export function reloadSelectedPacketGlobal() {
  dashboardComponentSignals.connectionList.dataRows.value = [
    ...dashboardComponentSignals.connectionList.dataRows.value,
  ];
  // so we have to also reload that
  dashboardComponentSignals.packetDetails.displayPacket.value = {
    ...dashboardComponentSignals.packetDetails.displayPacket.value,
  };
}

export default class Dashboard extends Component {
  render() {
    const ws = new WebSocket("ws://localhost:8080/ws");
    ws.onopen = () => {
      console.log("Connected to the WebSocket");
    };

    ws.onmessage = (event) => {
      console.log("got msg: ", event.data);
      const dataAny = JSON.parse(event.data);
      const infoUpdate = infoUpdateFromJsonStr(dataAny);
      console.log("infoUpdate: ", infoUpdate);
      updateConnectionsFromInfoUpdate(infoUpdate);
    };
    // const connections = signal<ConnectionData[]>(sampleConnections);
    dashboardComponentSignals.connectionList.dataRows.value = sampleConnections;
    // console.log(
    //   "reloading connections, ",
    //   dashboardComponentSignals.connectionList.dataRows.value,
    // );

    // TODO: avoid re-sorting!!!!!!!!!11

    const packets = computed(() => {
      console.log("recomputing packets");
      const allPackets: DisplayPacket[] =
        dashboardComponentSignals.connectionList.dataRows.value.flatMap(
          (connection) => connection.packets,
        );

      // Sort the packets by their id
      allPackets.sort((a, b) => a.id - b.id);

      return allPackets;
    });
    dashboardComponentSignals.allPackets.dataRows.value = packets.value;

    dashboardComponentSignals.packetDetails.displayPacket.value =
      dashboardComponentSignals.allPackets.dataRows.value.find((x) => {
        return (
          x.id === dashboardComponentSignals.allPackets.selectedItemSignal.value
        );
      });
    // const packets = signal<DisplayPacket[]>([
    //   {
    //     id: 0,
    //     // packetNumLocal: 0,
    //     connectionId: 1,
    //     ipHeaderRaw: "455802381a2b0000031104d2c0a80105efffffff",
    //     l3HeaderRaw: "13881f91000e04d2",
    //     ts: new Date().getTime(),
    //     manips: [],
    //     // lengthBytes:
    //   },
    // ]);
    // const selectedPacketNSignal = signal<number>(0);
    // selectedPacketSignal.value =
    //   dashboardComponentSignals.allPackets.dataRows.value.find((x) => {
    //     return (
    //       x.id === dashboardComponentSignals.allPackets.selectedItemSignal.value
    //     );
    //   });
    // const selectedPacketSignal: Signal<DisplayPacket> = computed(() => {
    //   console.log("recomputing selectedPacket");
    //   return dashboardComponentSignals.allPackets.dataRows.value.find((x) => {
    //     return (
    //       x.id === dashboardComponentSignals.allPackets.selectedItemSignal.value
    //     );
    //   });
    // });

    const leftContentSize = signal<number>(300);
    // const rightContentSize = signal<number>(300);

    return (
      <div
        className="bg-blue-bgOuter w-fit h-fit p-4 flex flex-row justify-center"
        style={{
          minWidth: "100%",
          minHeight: "100vw",
          // maxWidth: "100vw",
          // overflow: "clip",
          // height: "100vh",
          // maxHeight: "100vh",
        }}
      >
        <PanelLayout
          leftContent={
            <div className="flex flex-col gap-1">
              <ConnectionList
                connections={dashboardComponentSignals.connectionList.dataRows}
                selected={
                  dashboardComponentSignals.connectionList.selectedItemSignal
                }
              />
              <ConnectionDetails
                connections={dashboardComponentSignals.connectionList.dataRows}
                selected={
                  dashboardComponentSignals.connectionList.selectedItemSignal
                }
              />
            </div>
          }
          leftContentSize={leftContentSize}
          rightContent={
            <div className="flex flex-col gap-1">
              {/* min-w-[800px]"> */}
              <PacketList allPackets={packets} />
              <PacketDetails />
            </div>
          }
        />
      </div>
    );
  }
}
