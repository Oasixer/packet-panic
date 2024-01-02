import { fmtTs } from "./formatters";
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

export interface DisplayPacket {
  id: number; // eg. global autoincrementing packet num
  // packetNumLocal: number; // eg. autoincrementing packet num within this connection
  connectionId: number;
  ipHeaderRaw: string;
  l3HeaderRaw: string;
  srcIP: string;
  dstIP: string;
  srcPort: string;
  dstPort: string;
  len: number;
  // udpHeader: UdpHeader;
  // lengthBytes: number; // redundant with totalLen

  // b64RawL2Header: string; // base64 encoded string
  // b64RawL3Header: string; // base64 encoded string
  // b64RawL3Payload: string; // base64 encoded string
  ts: number;
  tsFmt: string;
  // tsHHMMSSmmm?: string;
  manips: Manipulation[];
}
export interface ConnectionData {
  id: number;
  nPackets: number; // uint64 in Go translates to number in TypeScript
  srcIP: string; // Assuming net.IP can be represented as a string
  dstIP: string; // Assuming net.IP can be represented as a string
  srcPort: string; // uint16 in Go translates to number in TypeScript
  dstPort: string; // uint16 in Go translates to number in TypeScript
  method: string;
  speedGBps: number; // float32 in Go translates to number in TypeScript
  // displayPackets: DisplayPacket[];
  lastPacketTs: number; // int64 in Go translates to number in TypeScript
  // _lastPacketTs: Date; // int64 in Go translates to number in TypeScript
  packets: DisplayPacket[];
}

export let packetQ: DisplayPacket[] = [];

export let sampleConnections: ConnectionData[] = [
  {
    id: 0,
    nPackets: 1650,
    srcIP: "192.168.0.1",
    dstIP: "192.168.0.1",
    srcPort: "12345",
    dstPort: "8001",
    method: "UDP",
    speedGBps: 69,
    // displayPackets: [],
    lastPacketTs: 0,
    packets: [
      {
        id: 0,
        // packetNumLocal: 0,
        connectionId: 0,
        ipHeaderRaw: "455802381a2b0000031104d2c0a80105efffffff",
        l3HeaderRaw: "13881f91000e04d2",
        srcIP: "192.168.0.1",
        dstIP: "223.150.1.1",
        srcPort: "12345",
        dstPort: "8001",
        len: 456,
        ts: new Date().getTime(),
        tsFmt: fmtTs(new Date().getTime()),
        manips: [],
      },
      {
        id: 2,
        // packetNumLocal: 0,
        connectionId: 0,
        ipHeaderRaw: "455811111a2b0000031104d2c0a801051aaaaaaf",
        l3HeaderRaw: "13881f91000e04d2",
        srcIP: "224.168.0.1",
        dstIP: "192.168.0.1",
        srcPort: "12345",
        dstPort: "8001",
        len: 53,
        ts: new Date().getTime(),
        tsFmt: fmtTs(new Date().getTime()),
        manips: [],

        // lengthBytes:
      },
    ],
  },
  {
    id: 1,
    nPackets: 238,
    srcIP: "192.241.6.1",
    dstIP: "192.168.0.2",
    srcPort: "12345",
    dstPort: "6969",
    method: "TCP",
    speedGBps: 0.42,
    // displayPackets: [],
    lastPacketTs: 0,
    packets: [
      {
        id: 1,
        // packetNumLocal: 0,
        connectionId: 0,
        ipHeaderRaw: "455800151a2b0000031104d2c0a80105efffffff",
        l3HeaderRaw: "13881f91000e04d2",
        srcIP: "224.168.0.1",
        dstIP: "192.168.0.1",
        srcPort: "12345",
        dstPort: "8001",
        len: 520,
        ts: new Date().getTime(),
        tsFmt: fmtTs(new Date().getTime()),
        manips: [],

        // lengthBytes:
      },
    ],
  },
];

function getConnection(
  connections: ConnectionData[],
  id: string,
): ConnectionData | undefined {
  for (const connection of connections) {
    if (connection.id === id) {
      return connection;
    }
  }
  return undefined;
}

export function updateConnectionsFromInfoUpdate(
  connections: ConnectionData[],
  infoUpdate: InfoUpdate,
) {
  for (var newConnection of infoUpdate.newConnections) {
    connections.push(newConnection);
  }
  for (var connectionUpdate of infoUpdate.connectionUpdates) {
    let relevantConnection = getConnection(
      connections,
      connectionUpdate.connectionId,
    );
    if (relevantConnection === undefined) {
      throw new Error(`Couldn't find connection `);
    }
    relevantConnection.nPackets++;

    // for (var displayPacket of connectionUpdate.newPackets) {
    // let newLen: number = packetQ.push(displayPacket)
    // if (newLen > )
    // }
    // relevantConnection.
    // relevantConnection.
  }
}
// for (let i=0; i<infoUpdate.newConnections; i++){
//   // TODO: probably need a hook or effect unless the following data bubbles??
export function infoUpdateFromJsonStr(jsonData: any): InfoUpdate {
  const infoUpdate = jsonData as InfoUpdate;
  return infoUpdate;
}
//   // console.log(typeof jsonData.updated);
//   // console.log(jsonData.updated);
//   jsonData.updated = new Date(jsonData.updated);
//   // console.log("pls...")
//   // console.log(new Date(jsonData.updated));
//   // console.log(jsonData.updated.toLocaleTimeString());
//
// }
//   nodes.updated = new Date(nodes.updated);
//   for (let i=0; i<4; i++){
//       nodes.nodes[i].last_ping = new Date(nodes.nodes[i].last_ping)
//   }
//   return nodes;
// }
export interface SkippedPacket {
  packetSizeBytes: number;
  ts: number;
  // _ts?: Date;
}

export interface ConnectionUpdate {
  connectionId: string;
  newPackets: DisplayPacket[];
  skippedPackets: SkippedPacket[];
  ts: number;
  // _ts?: Date;
}

export interface InfoUpdate {
  newConnections: ConnectionData[];
  connectionUpdates: ConnectionUpdate[];
}

export interface Manipulation {
  manipulatorType: string;
  data: string; // The structure of this field depends on `manipulatorType`
}
