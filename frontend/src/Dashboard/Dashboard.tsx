import { Component } from "preact";
import { computed, signal, Signal } from "@preact/signals";

import ConnectionList from "@/Dashboard/ConnectionList/ConnectionList";
import ConnectionDetails from "@/Dashboard/ConnectionDetails/ConnectionDetails";
import PacketDetails from "@/Dashboard/PacketDetails/PacketDetails";
import PacketList from "@/Dashboard/PacketList/PacketList";
import { sampleConnections } from "@/Dashboard/connectionData";
import type { ConnectionData, DisplayPacket } from "@/Dashboard/connectionData";

export interface TableComponentState {
  selectedItemSignal?: Signal<number>;
  base: ComponentState; // composition baby
}

export interface ComponentState {
  accordionEnableSignal: Signal<boolean>;
}

export interface DashboardComponentSignals {
  connectionList: TableComponentState;
  connectionDetails: ComponentState;
  connectionPackets: TableComponentState;
  connectionSpeedGraph: ComponentState;
  packetList: ComponentState;
  allPackets: ComponentState;
  savedPackets: ComponentState;
  packetDetails: ComponentState;
  packetManips: ComponentState;
  rawPacket: ComponentState;
}

export const dashboardComponentSignals: DashboardComponentSignals = {
  connectionList: {
    base: { accordionEnableSignal: signal<boolean>(true) },
    selectedItemSignal: signal<number>(0),
  },
  connectionDetails: { accordionEnableSignal: signal<boolean>(true) },
  connectionPackets: {
    base: { accordionEnableSignal: signal<boolean>(false) },
    selectedItemSignal: signal<number>(0),
  },
  connectionSpeedGraph: { accordionEnableSignal: signal<boolean>(false) },
  packetList: { accordionEnableSignal: signal<boolean>(false) },
  allPackets: { accordionEnableSignal: signal<boolean>(false) },
  savedPackets: { accordionEnableSignal: signal<boolean>(false) },
  packetDetails: { accordionEnableSignal: signal<boolean>(true) },
  packetManips: { accordionEnableSignal: signal<boolean>(false) },
  rawPacket: { accordionEnableSignal: signal<boolean>(true) },
};

export default class Dashboard extends Component {
  render() {
    const connections = signal<ConnectionData[]>(sampleConnections);
    // const selectedConnectionSignal = signal<number>(0);
    const packets = signal<DisplayPacket[]>([
      {
        packetNum: 0,
        connectionId: 1,
        ipHeaderRaw: "455802381a2b0000031104d2c0a80105efffffff",
        l3HeaderRaw: "13881f91000e04d2",
        ts: new Date().getTime(),
        manips: [],
        // lengthBytes:
      },
    ]);
    const selectedPacketNSignal = signal<number>(0);
    const selectedPacketSignal: Signal<DisplayPacket> = computed(() => {
      return packets.value[selectedPacketNSignal.value];
    });
    return (
      <div
        className="bg-blue-bgOuter p-4 flex flex-row gap-2"
        style={{
          width: "100%",
          maxWidth: "100vw",
          overflow: "clip",
          height: "100vh",
          maxHeight: "100vh",
        }}
      >
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
        <div className="flex flex-col gap-1">
          <PacketList />
          <PacketDetails displayPacket={selectedPacketSignal} />
        </div>
      </div>
    );
  }
}
