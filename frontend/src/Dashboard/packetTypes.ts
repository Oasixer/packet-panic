import { FmtTypePropName } from "./formatters";

export interface TableField {
  width: number;
  base: Field;
}

export interface Field {
  id: any; // eg. "proto"
  label?: string; // default to id
  startBit: number;
  lenBits: number;
  color: string; // hex
  hexFmt?: (input: string) => string;
  splitBytesInFmt?: boolean; // if included and true, group bytes eg. srcPort being 2 bytes representing 1 number whereas each ip byte should be displayed seperately.
}
export function splitBytes(
  hexString: string,
  field: Field,
  fmtProp: FmtTypePropName,
  // tempOverride?: boolean,
): string[] {
  let dontSplitBytes =
    fmtProp === FmtTypePropName.labelFmt ||
    (fmtProp === FmtTypePropName.decFmt && !field.splitBytesInFmt) ||
    hexString.length === 1;
  if (dontSplitBytes) {
    return [hexString];
  }
  if (!hexString || hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  // Split the hex string into chunks of two characters each
  const bytes: string[] = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(hexString.substring(i, i + 2));
  }

  return bytes;
}

export function getFieldValueByField(field: Field, headerRaw: string): string {
  const start = (field.startBit / 8) * 2;
  const end = start + field.lenBits / 4;

  if (field.lenBits === 4) {
    const byte = headerRaw.substring(start, start + 1);
    const isUpperHalf = (field.startBit / 8) % 1 === 0;
    const hexValue = parseInt(byte, 16);
    const nibble = isUpperHalf ? hexValue >> 4 : hexValue & 0x0f;
    return nibble.toString(16);
  }

  return headerRaw.substring(start, end);
}

export function getFieldValueById(
  fields: Field[][],
  id: string,
  headerRaw: string,
): string {
  console.log("id: ", id);
  let field: Field | undefined;
  for (const row of fields) {
    field = row.find((f) => (f.id as unknown as string) === id); // as string doesn't work here... neither type sufficiently overlaps with the other??
    if (field) break;
  }
  if (!field) throw new Error("Field not found");
  return getFieldValueByField(field, headerRaw);
}

export enum IpHeaderField {
  version = "version",
  len = "len",
  tos = "tos",
  totalLen = "totalLen",
  id = "id",
  flags = "flags",
  fragOff = "fragOff",
  ttl = "ttl",
  protocol = "protocol",
  checksum = "checksum",
  srcIP = "srcIP",
  dstIP = "dstIP",
}

const IP_HEADER_PROP = "ipHeaderRaw";
const UDP_HEADER_PROP = "l3HeaderRaw";

function ipLabelSubs(id: IpHeaderField): string {
  switch (id) {
    case IpHeaderField.version:
      return "ver";
    case IpHeaderField.protocol:
      return "proto";
    default:
      return id as unknown as string;
  }
}

function udpLabelSubs(id: UdpHeaderField): string {
  switch (id) {
    default:
      return id as unknown as string;
  }
}
// export enum IpHeaderField {
//   ver = "version" as any,
//   len = "len" as any,
//   tos = "tos" as any,
//   totalLen = "totalLen" as any,
//   id = "id" as any,
//   flags = "flags" as any,
//   fragOff = "fragOff" as any,
//   ttl = "ttl" as any,
//   proto = "protocol" as any,
//   checksum = "checksum" as any,
//   srcIP = "srcIP" as any,
//   dstIP = "dstIP" as any,
// }

// ablah
// #FF7878
// #E5816F
// #BCC565
// #82D35D
// #557755
// #6BC1D7
// #6165D7
// #A191FC
// #9A7AC1
// #D392CD
// #893F5E

export const ipHeaderFields: Field[][] = [
  [
    {
      id: IpHeaderField.version,
      startBit: 0,
      lenBits: 4,
      color: "#FF7878", //
    },
    {
      id: IpHeaderField.len,
      startBit: 4,
      lenBits: 4,
      color: "#E5816F", // lorange
    },
    {
      id: IpHeaderField.tos,
      startBit: 8,
      lenBits: 8,
      color: "#BCC565", // yellow
    },
    {
      id: IpHeaderField.totalLen,
      startBit: 16,
      lenBits: 16,
      color: "#82D35D", // green
    },
  ],
  [
    {
      id: IpHeaderField.id,
      startBit: 32,
      lenBits: 16,
      color: "#557755", //dgreen
    },
    {
      id: IpHeaderField.flags,
      startBit: 48,
      lenBits: 8,
      color: "#6BC1D7",
    },
    {
      id: IpHeaderField.fragOff,
      startBit: 56,
      lenBits: 8,
      color: "#6165D7", // blue/ blurple
    },
  ],
  [
    {
      id: IpHeaderField.ttl,
      startBit: 64,
      lenBits: 8,
      color: "#6165D7", // blue/ blurple
    },
    {
      id: IpHeaderField.protocol,
      startBit: 72,
      lenBits: 8,
      color: "#A191FC", // lavender
    },
    {
      id: IpHeaderField.checksum,
      startBit: 80,
      lenBits: 16,
      color: "#9A7AC1", // violet
    },
  ],
  [
    {
      id: IpHeaderField.srcIP,
      startBit: 96,
      lenBits: 32,
      splitBytesInFmt: true,
      color: "#D392CD", // pink
    },
  ],
  [
    {
      id: IpHeaderField.dstIP,
      startBit: 128,
      lenBits: 32,
      splitBytesInFmt: true,
      color: "#893F5E", // pink
    },
  ],
];
// export const ipHeaderFields: Field[][] = [
//   [
//     {
//       id: IpHeaderField.version,
//       // label: "ver",
//       startByte: 0,
//       lenBytes: 0.5,
//       color: "#FF7878", //
//     },
//     {
//       id: IpHeaderField.len,
//       startByte: 0.5,
//       lenBytes: 0.5,
//       color: "#E5816F", // lorange
//     },
//     {
//       id: IpHeaderField.tos,
//       startByte: 1,
//       lenBytes: 1,
//       color: "#BCC565", // yellow
//     },
//     {
//       id: IpHeaderField.totalLen,
//       startByte: 2,
//       lenBytes: 2,
//       color: "#82D35D", // green
//     },
//   ],
//   [
//     {
//       id: IpHeaderField.id,
//       startByte: 4,
//       lenBytes: 2,
//       color: "#557755", //dgreen
//     },
//     {
//       id: IpHeaderField.flags,
//       startByte: 6,
//       lenBytes: 1,
//       color: "#6BC1D7",
//     },
//     {
//       id: IpHeaderField.fragOff,
//       startByte: 7,
//       lenBytes: 1,
//       color: "#6165D7", // blue/ blurple
//     },
//   ],
//   [
//     {
//       id: IpHeaderField.ttl,
//       startByte: 8,
//       lenBytes: 1,
//       color: "#6165D7", // blue/ blurple
//     },
//     {
//       id: IpHeaderField.protocol,
//       startByte: 9,
//       lenBytes: 1,
//       color: "#A191FC", // lavender
//     },
//     {
//       id: IpHeaderField.checksum,
//       startByte: 10,
//       lenBytes: 2,
//       color: "#9A7AC1", // violet
//     },
//   ],
//   [
//     {
//       id: IpHeaderField.srcIP,
//       startByte: 12,
//       lenBytes: 4,
//       splitBytesInFmt: true,
//       color: "#D392CD", // pink
//     },
//   ],
//   [
//     {
//       id: IpHeaderField.dstIP,
//       startByte: 16,
//       lenBytes: 4,
//       splitBytesInFmt: true,
//       color: "#893F5E", // pink
//     },
//   ],
// ];

export enum UdpHeaderField {
  srcPort = <any>"srcPort",
  dstPort = <any>"dstPort",
  length = <any>"length",
  checksum = <any>"checksum",
}

export const udpHeaderFields: Field[][] = [
  [
    {
      id: UdpHeaderField.srcPort,
      startBit: 0,
      lenBits: 16,
      color: "#BFE9FB", // glacier
    },
    {
      id: UdpHeaderField.dstPort,
      startBit: 16,
      lenBits: 16,
      color: "#3DA58A", // greenaccent
    },
  ],
  [
    {
      id: UdpHeaderField.length,
      startBit: 32,
      lenBits: 16,
      color: "#BAB4B4", // greysAnatomy
    },
    {
      id: UdpHeaderField.checksum,
      startBit: 48,
      lenBits: 16,
      color: "#A2D699", // seaGreen
    },
  ],
];

// export const udpHeaderFields: Field[][] = [
//   [
//     {
//       id: UdpHeaderField.srcPort,
//       startByte: 0,
//       lenBytes: 2,
//       color: "#BFE9FB", // glacier
//     },
//     {
//       id: UdpHeaderField.dstPort,
//       startByte: 2,
//       lenBytes: 2,
//       color: "#3DA58A", // greenaccent
//     },
//   ],
//   [
//     {
//       id: UdpHeaderField.length,
//       startByte: 4,
//       lenBytes: 2,
//       color: "#BAB4B4", // greysAnatomy
//     },
//     {
//       id: UdpHeaderField.checksum,
//       startByte: 6,
//       lenBytes: 2,
//       color: "#A2D699", // seaGreen
//     },
//   ],
// ];

export enum TcpHeaderField {
  srcPort = "srcPort",
  dstPort = "dstPort",
  sequenceNumber = "sequenceNumber",
  ackNumber = "ackNumber",
  headerLen = "headerLen",
  reserved = "reserved",
  flags = "flags",
  window = "window",
  checksum = "checksum",
  urgentPointer = "urgentPointer",
  options = "options",
  padding = "padding",
}

export const tcpHeaderFields: Field[][] = [
  [
    {
      id: TcpHeaderField.srcPort,
      startByte: 0,
      lenBytes: 2,
      color: "#FF7878", // color1
    },
    {
      id: TcpHeaderField.dstPort,
      startByte: 2,
      lenBytes: 2,
      color: "#E5816F", // color2
    },
  ],
  [
    {
      id: TcpHeaderField.sequenceNumber,
      startByte: 4,
      lenBytes: 4,
      color: "#BCC565", // color3
    },
  ],
  [
    {
      id: TcpHeaderField.ackNumber,
      startByte: 8,
      lenBytes: 4,
      color: "#82D35D", // color4
    },
  ],
  [
    {
      id: TcpHeaderField.headerLen,
      startByte: 12,
      lenBytes: 1 / 2,
      color: "#557755", // color5
    },
    {
      id: TcpHeaderField.reserved,
      startByte: 13,
      lenBytes: 3, // Note: This combines reserved (3 bits), flags (9 bits), and the first bit of window
      color: "#6BC1D7", // color6
    },
  ],
  [
    {
      id: TcpHeaderField.window,
      startByte: 14,
      lenBytes: 2, // Note: This starts from the second byte of the previous field
      color: "#6165D7", // color7
    },
    {
      id: TcpHeaderField.checksum,
      startByte: 16,
      lenBytes: 2,
      color: "#A191FC", // color8
    },
  ],
  [
    {
      id: TcpHeaderField.urgentPointer,
      startByte: 18,
      lenBytes: 2,
      color: "#9A7AC1", // color9
    },
    {
      id: TcpHeaderField.options,
      startByte: 20,
      lenBytes: 0, // Variable length, starts at 20, length determined dynamically
      color: "#D392CD", // color10
    },
  ],
  [
    {
      id: TcpHeaderField.padding,
      startByte: 20, // Variable start, follows options
      lenBytes: 0, // Variable length, determined dynamically
      color: "#893F5E", // color11
    },
  ],
];

export interface PacketTypeMeta {
  fields: Field[][];
  labelSubs: (input: string) => string;
  headerProp: string;
  // styling: Styling;
  // borderColor: string;
}

export const ipPacketMeta: PacketTypeMeta = {
  fields: ipHeaderFields,
  labelSubs: ipLabelSubs,
  headerProp: IP_HEADER_PROP,
};

export const udpPacketMeta: PacketTypeMeta = {
  fields: udpHeaderFields,
  labelSubs: udpLabelSubs,
  headerProp: UDP_HEADER_PROP,
};
