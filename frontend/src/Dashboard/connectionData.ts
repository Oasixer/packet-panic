import { dashboardComponentSignals } from "./Dashboard";
import { fmtByteToDec, fmtTs } from "./formatters";
export const PACKET_Q_LEN = 100;

enum Styling {
  LABEL = 0,
  HEX = 1,
  FMT = 2,
}

export enum ConnectionField {
  id = "id",
  proto = "proto",
  srcPort = "srcPort",
  dstPort = "dstPort",
}

export enum ProtoL3 {
  TCP = "TCP",
  UDP = "UDP",
}

let totalNPackets = 0;

export function protoHexToStr(protoHex: string): string {
  const protoDec = fmtByteToDec(protoHex);
  switch (protoDec) {
    case "17":
      return ProtoL3.UDP as string;
    case "6":
      return ProtoL3.TCP as string;
    // add other cases for different protocol numbers
    default:
      return "idk";
    // throw new Error("Unsupported protocol number");
  }
}
export interface JsonPacket {
  id: number; // eg. global autoincrementing packet num
  connectionId: number;
  connPacketNum: number; // eg. autoincrementing packet num within this connection
  ipHeaderRaw: string;
  l3HeaderRaw: string;
  ts: number;
  len: number;
  manips: Manipulation[];
}

export interface DisplayPacket {
  id: number; // eg. global autoincrementing packet num
  packetNumLocal: number; // eg. autoincrementing packet num within this connection
  connectionId: number;
  ipHeaderRaw: string;
  l3HeaderRaw: string;
  srcIP: string;
  dstIP: string;
  srcPort: string;
  dstPort: string;
  proto: ProtoL3;
  len: number;
  ts: number;
  tsFmt: string;
  manips: Manipulation[];
  saved: boolean;
}
export interface JsonConnection {
  hashId: string;
  nPackets: number; // uint64 in Go translates to number in TypeScript
  srcIP: string; // Assuming net.IP can be represented as a string
  dstIP: string; // Assuming net.IP can be represented as a string
  srcPort: string; // uint16 in Go translates to number in TypeScript
  dstPort: string; // uint16 in Go translates to number in TypeScript
  protocol: ProtoL3;
  // speedGBps: number; // float32 in Go translates to number in TypeScript
  // displayPackets: DisplayPacket[];
  lastPacketTs: number; // int64 in Go translates to number in TypeScript
}
export interface ConnectionData {
  id: number;
  hashId: string;
  nPackets: number; // uint64 in Go translates to number in TypeScript
  srcIP: string; // Assuming net.IP can be represented as a string
  dstIP: string; // Assuming net.IP can be represented as a string
  srcPort: string; // uint16 in Go translates to number in TypeScript
  dstPort: string; // uint16 in Go translates to number in TypeScript
  protocol: ProtoL3;
  // speedGBps: number; // float32 in Go translates to number in TypeScript
  // displayPackets: DisplayPacket[];
  lastPacketTs: number; // int64 in Go translates to number in TypeScript
  // _lastPacketTs: Date; // int64 in Go translates to number in TypeScript
  packets: DisplayPacket[];
}

// TODO: weird solution that i don't really like
export function getPacketById_TODO_perf(
  connectionData: ConnectionData,
  packetId: number,
) {
  return connectionData.packets.find((x) => x.id === packetId);
}
// export function setPacketByIdx(
//   connectionData: ConnectionData,
//   packetIdx: number,
//   packet: PacketData,
// ) {}

export let sampleConnections: ConnectionData[] = [
  {
    id: 0,
    hashId: "x",
    nPackets: 1650,
    srcIP: "192.168.0.1",
    dstIP: "192.168.0.1",
    srcPort: "12345",
    dstPort: "8001",
    protocol: ProtoL3.TCP,
    // speedGBps: 69,
    // displayPackets: [],
    lastPacketTs: 0,
    packets: [
      {
        id: 0,
        packetNumLocal: 0,
        connectionId: 0,
        ipHeaderRaw: "455802381a2b0000030604d2c0a80105efffffff",
        l3HeaderRaw: "13881f91000e04d2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        srcIP: "192.168.0.1",
        dstIP: "223.150.1.1",
        srcPort: "12345",
        dstPort: "8001",
        proto: ProtoL3.TCP,
        len: 456,
        ts: new Date().getTime(),
        tsFmt: fmtTs(new Date().getTime()),
        manips: [],
        saved: true,
      },
      {
        id: 2,
        packetNumLocal: 1,
        connectionId: 0,
        ipHeaderRaw: "455811111a2b0000030604d2c0a801051aaaaaaf",
        l3HeaderRaw: "13881f91000e04d2",
        srcIP: "224.168.0.1",
        dstIP: "192.168.0.1",
        srcPort: "12345",
        dstPort: "8001",
        proto: ProtoL3.TCP,
        len: 53,
        ts: new Date().getTime(),
        tsFmt: fmtTs(new Date().getTime()),
        manips: [],
        saved: false,

        // lengthBytes:
      },
    ],
  },
  {
    id: 1,
    hashId: "y", // TODO: ...
    nPackets: 238,
    srcIP: "192.241.6.1",
    dstIP: "192.168.0.2",
    srcPort: "12345",
    dstPort: "6969",
    protocol: ProtoL3.UDP,
    // speedGBps: 0.42,
    // displayPackets: [],
    lastPacketTs: 0,
    packets: [
      {
        id: 1,
        packetNumLocal: 0,
        // packetNumLocal: 0,
        connectionId: 1,
        ipHeaderRaw: "455800151a2b0000031704d2c0a80105efffffff",
        l3HeaderRaw: "13881f91000e04d2",
        srcIP: "224.168.0.1",
        dstIP: "192.168.0.1",
        srcPort: "12345",
        dstPort: "8001",
        proto: ProtoL3.UDP,
        len: 520,
        ts: new Date().getTime(),
        tsFmt: fmtTs(new Date().getTime()),
        manips: [],
        saved: false,

        // lengthBytes:
      },
    ],
  },
];

function getConnection(
  connections: ConnectionData[],
  id: string,
): ConnectionData | undefined {
  // console.log("looking for id string:", id);
  for (const connection of connections) {
    // console.log("is it: ", connection.hashId);
    if (connection.hashId === id) {
      return connection;
    }
  }
  return undefined;
}

export function updateConnectionsFromInfoUpdate(
  // connections: Signal<ConnectionData[]>,
  infoUpdate: InfoUpdate,
) {
  const connections = dashboardComponentSignals.connectionList.dataRows.value;
  for (var jsonConnection of infoUpdate.newConnections) {
    console.log("new connection hashId: ", jsonConnection.hashId);
    const newConnection: ConnectionData = {
      id: connections.length,
      hashId: jsonConnection.hashId,
      nPackets: jsonConnection.nPackets,
      srcIP: jsonConnection.srcIP,
      dstIP: jsonConnection.dstIP,
      srcPort: jsonConnection.srcPort,
      dstPort: jsonConnection.dstPort,
      protocol: jsonConnection.protocol,
      lastPacketTs: jsonConnection.lastPacketTs,
      packets: [],
    };
    connections.push(newConnection);
    // todo make sure this bubbles and only do that if we have a new connection!!
    dashboardComponentSignals.connectionList.dataRows.value = [];
    dashboardComponentSignals.connectionList.dataRows.value = connections;
  }
  for (var connectionUpdate of infoUpdate.connectionUpdates) {
    let relevantConnection = getConnection(
      connections,
      connectionUpdate.connectionHashId,
    );
    if (relevantConnection === undefined) {
      throw new Error(`Couldn't find connection `);
    }

    for (var jsonPacket of connectionUpdate.newPackets) {
      const newPacket: DisplayPacket = {
        id: totalNPackets,
        packetNumLocal: relevantConnection.nPackets,
        connectionId: relevantConnection.id,
        ipHeaderRaw: jsonPacket.ipHeaderRaw,
        l3HeaderRaw: jsonPacket.ipHeaderRaw,
        srcIP: relevantConnection.srcIP,
        dstIP: relevantConnection.dstIP,
        srcPort: relevantConnection.srcPort,
        dstPort: relevantConnection.dstPort,
        proto: relevantConnection.protocol,
        len: jsonPacket.len,
        ts: jsonPacket.ts,
        tsFmt: fmtTs(jsonPacket.ts),
        manips: jsonPacket.manips,
        saved: false,
      };
      relevantConnection.nPackets++;
      totalNPackets++;
      relevantConnection.packets.push(newPacket);
    }
  }

  // todo make sure this bubbles and only do that if we have a new connection!!
  dashboardComponentSignals.connectionList.dataRows.value = connections;
}
export function infoUpdateFromJsonStr(jsonData: any): InfoUpdate {
  const infoUpdate = jsonData as InfoUpdate;
  return infoUpdate;
}

export interface SkippedPacket {
  packetSizeBytes: number;
  ts: number;
  // _ts?: Date;
}

export interface ConnectionUpdate {
  connectionHashId: string;
  newPackets: JsonPacket[];
  skippedPackets: SkippedPacket[];
  ts: number;
  // _ts?: Date;
}

export interface InfoUpdate {
  newConnections: JsonConnection[];
  connectionUpdates: ConnectionUpdate[];
}

export interface Manipulation {
  manipulatorType: string;
  data: string; // The structure of this field depends on `manipulatorType`
}
