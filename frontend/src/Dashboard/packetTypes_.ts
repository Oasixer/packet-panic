// type IpHeader = {
//   fields: Field[][];
//   headerRaw: string;
// };

// const ipHeaderImpl: IpHeader = {
//   fields: ipHeaderFields,
//   headerRaw: "", // to be filled with the actual hex string
// };

// export interface IpHeader {
//   version: number;
//   len: number;
//   tos: number;
//   totalLen: number;
//   id: number;
//   flags: number;
//   fragOff: number;
//   ttl: number;
//   protocol: number;
//   checksum: number;
//   srcIp: string;
//   dstIp: string;
//   // options: Uint8Array; // Assuming []byte translates to Uint8Array in TypeScript
// }

interface UdpHeader {
  srcPort: number;
  dstPort: number;
  length: number;
  checksum: number;
}
