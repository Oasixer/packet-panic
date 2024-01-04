import { FmtTypePropName } from "./formatters";

export interface TableField {
  width: number;
  base: Field;
}

export interface Field {
  id: any; // eg. "proto"
  label?: string; // default to id
  startByte: number;
  lenBytes: number;
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
  const start = field.startByte * 2;
  const end = start + field.lenBytes * 2;

  if (field.lenBytes === 0.5) {
    const byte = headerRaw.substring(start, start + 1);
    const isUpperHalf = field.startByte % 1 === 0;
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

export const ipHeaderFields: Field[][] = [
  [
    {
      id: IpHeaderField.version,
      // label: "ver",
      startByte: 0,
      lenBytes: 0.5,
      color: "#FF7878", //
    },
    {
      id: IpHeaderField.len,
      startByte: 0.5,
      lenBytes: 0.5,
      color: "#E5816F", // lorange
    },
    {
      id: IpHeaderField.tos,
      startByte: 1,
      lenBytes: 1,
      color: "#BCC565", // yellow
    },
    {
      id: IpHeaderField.totalLen,
      startByte: 2,
      lenBytes: 2,
      color: "#82D35D", // green
    },
  ],
  [
    {
      id: IpHeaderField.id,
      startByte: 4,
      lenBytes: 2,
      color: "#557755", //dgreen
    },
    {
      id: IpHeaderField.flags,
      startByte: 6,
      lenBytes: 1,
      color: "#6BC1D7",
    },
    {
      id: IpHeaderField.fragOff,
      startByte: 7,
      lenBytes: 1,
      color: "#6165D7", // blue/ blurple
    },
  ],
  [
    {
      id: IpHeaderField.ttl,
      startByte: 8,
      lenBytes: 1,
      color: "#6165D7", // blue/ blurple
    },
    {
      id: IpHeaderField.protocol,
      startByte: 9,
      lenBytes: 1,
      color: "#A191FC", // lavender
    },
    {
      id: IpHeaderField.checksum,
      startByte: 10,
      lenBytes: 2,
      color: "#9A7AC1", // violet
    },
  ],
  [
    {
      id: IpHeaderField.srcIP,
      startByte: 12,
      lenBytes: 4,
      splitBytesInFmt: true,
      color: "#D392CD", // pink
    },
  ],
  [
    {
      id: IpHeaderField.dstIP,
      startByte: 16,
      lenBytes: 4,
      splitBytesInFmt: true,
      color: "#893F5E", // pink
    },
  ],
];

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
      startByte: 0,
      lenBytes: 2,
      color: "#BFE9FB", // glacier
    },
    {
      id: UdpHeaderField.dstPort,
      startByte: 2,
      lenBytes: 2,
      color: "#3DA58A", // greenaccent
    },
  ],
  [
    {
      id: UdpHeaderField.length,
      startByte: 4,
      lenBytes: 2,
      color: "#BAB4B4", // greysAnatomy
    },
    {
      id: UdpHeaderField.checksum,
      startByte: 6,
      lenBytes: 2,
      color: "#A2D699", // seaGreen
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
