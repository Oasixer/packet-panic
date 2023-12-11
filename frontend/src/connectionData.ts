export interface ConnectionData {
  uid: number;
  nPackets: number;
  srcIp: string;
  dstIp: string;
  srcPort: string;
  dstPort: string;
  protocol: string;
  speed: string;
}

export let sampleConnections: ConnectionData[] = [
  {
    uid: 1,
    nPackets: 1650,
    srcIp: "192.168.0.1",
    dstIp: "192.168.0.1",
    srcPort: "12345",
    dstPort: "8001",
    protocol: "UDP",
    speed: "69gb/s",
  },
  {
    uid: 2,
    nPackets: 238,
    srcIp: "192.241.6.1",
    dstIp: "192.168.0.2",
    srcPort: "12345",
    dstPort: "6969",
    protocol: "TCP",
    speed: "420mb/s",
  },
];
