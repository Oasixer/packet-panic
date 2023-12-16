interface ConnectionData {
  id: string;
  nPackets: number; // uint64 in Go translates to number in TypeScript
  srcIP: string; // Assuming net.IP can be represented as a string
  dstIP: string; // Assuming net.IP can be represented as a string
  srcPort: number; // uint16 in Go translates to number in TypeScript
  dstPort: number; // uint16 in Go translates to number in TypeScript
  method: string;
  speedGBps: number; // float32 in Go translates to number in TypeScript
  displayPackets: DisplayPacket[];
  lastPacketTs: number; // int64 in Go translates to number in TypeScript
}

export interface ConnectionData {
  uid: number;
  nPackets: number;
  srcIP: string;
  dstIP: string;
  srcPort: string;
  dstPort: string;
  protocol: string;
  speed: string;
}

export let sampleConnections: ConnectionData[] = [
  {
    uid: 1,
    nPackets: 1650,
    srcIP: "192.168.0.1",
    dstIP: "192.168.0.1",
    srcPort: "12345",
    dstPort: "8001",
    protocol: "UDP",
    speed: "69gb/s",
  },
  {
    uid: 2,
    nPackets: 238,
    srcIP: "192.241.6.1",
    dstIP: "192.168.0.2",
    srcPort: "12345",
    dstPort: "6969",
    protocol: "TCP",
    speed: "420mb/s",
  },
];

function parseInfoUpdate(jsonData: any): InfoUpdate {
//   // console.log(typeof jsonData.updated);
//   // console.log(jsonData.updated);
//   jsonData.updated = new Date(jsonData.updated);
//   // console.log("pls...")
//   // console.log(new Date(jsonData.updated));
//   // console.log(jsonData.updated.toLocaleTimeString());
  const nodes = jsonData as NodeDataDisplay;
//   nodes.updated = new Date(nodes.updated);
//   for (let i=0; i<4; i++){
//       nodes.nodes[i].last_ping = new Date(nodes.nodes[i].last_ping)
//   }
//   return nodes;
// }
interface InfoUpdate {
  connections: ConnectionData[];
  newPackets: DisplayPacket[];
}

interface Manipulation {
  manipulatorType: string;
  data: string; // The structure of this field depends on `manipulatorType`
}

interface DisplayPacket {
  ipHeader: IpHeader;
  udpHeader: UdpHeader;
  b64RawL2Header: string; // base64 encoded string
  b64RawL3Header: string; // base64 encoded string
  b64RawL3Payload: string; // base64 encoded string
  manips: Manipulation[];
}
