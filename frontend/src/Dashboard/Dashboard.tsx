import { Component } from "preact";
import { computed, signal, Signal } from "@preact/signals";

import ConnectionList from "@/Dashboard/ConnectionList/ConnectionList";
import ConnectionDetails from "@/Dashboard/ConnectionDetails/ConnectionDetails";
import PacketDetails from "@/Dashboard/PacketDetails/PacketDetails";
import PacketList from "@/Dashboard/PacketList/PacketList";
import PanelLayout from "@/Dashboard/General/PanelLayout";
import { sampleConnections } from "@/Dashboard/connectionData";
import type { ConnectionData, DisplayPacket } from "@/Dashboard/connectionData";

export interface TableComponentState {
  selectedItemSignal?: Signal<number>;
  // dataRows: Signal<any[]>;
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
  packetDetails: ComponentState;
  packetManips: ComponentState;
  rawPacket: ComponentState;
}

export const dashboardComponentSignals: DashboardComponentSignals = {
  connectionList: {
    base: { accordionEnableSignal: signal<boolean>(true) },
    selectedItemSignal: signal<number>(0),
    // dataRows: signal<any[]>([]),
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
    base: { accordionEnableSignal: signal<boolean>(false) },
    selectedItemSignal: signal<number>(0),
    // dataRows: signal<any[]>([]),
  },
  savedPackets: { accordionEnableSignal: signal<boolean>(false) },
  packetDetails: { accordionEnableSignal: signal<boolean>(true) },
  packetManips: { accordionEnableSignal: signal<boolean>(false) },
  rawPacket: { accordionEnableSignal: signal<boolean>(true) },
};

export default class Dashboard extends Component {
  render() {
    const connections = signal<ConnectionData[]>(sampleConnections);
    // const selectedConnectionSignal = signal<number>(0);

    // TODO: avoid re-sorting!!!!!!!!!11

    const packets = computed(() => {
      const allPackets: DisplayPacket[] = connections.value.flatMap(
        (connection) => connection.packets,
      );

      // Sort the packets by their id
      allPackets.sort((a, b) => a.id - b.id);

      return allPackets;
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
    const selectedPacketSignal: Signal<DisplayPacket> = computed(() => {
      return packets.value.find((x) => {
        return (
          x.id === dashboardComponentSignals.allPackets.selectedItemSignal.value
        );
      });
    });

    const leftContentSize = signal<number>(300);
    // const rightContentSize = signal<number>(300);

    return (
      <div
        className="bg-blue-bgOuter p-4 flex flex-row justify-center"
        style={{
          width: "100%",
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
                connections={connections}
                selected={
                  dashboardComponentSignals.connectionList.selectedItemSignal
                }
              />
              <ConnectionDetails
                connections={connections}
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
              <PacketDetails displayPacket={selectedPacketSignal} />
            </div>
          }
        />
      </div>
    );
  }
}
