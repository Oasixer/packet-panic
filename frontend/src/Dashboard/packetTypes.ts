export interface Field {
  id: any; // eg. "proto"
  label?: string; // default to id
  startByte: number;
  lenBytes: number;
  fmt?: (input: string) => string;
  splitBytesInFmt?: boolean; // if included and true, group bytes eg. srcPort being 2 bytes representing 1 number whereas each ip byte should be displayed seperately.
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

export enum IpHeaderField {
  version = <any>"version",
  len = <any>"len",
  tos = <any>"tos",
  totalLen = <any>"totalLen",
  id = <any>"id",
  flags = <any>"flags",
  fragOff = <any>"fragOff",
  ttl = <any>"ttl",
  protocol = <any>"protocol",
  checksum = <any>"checksum",
  srcIp = <any>"srcIp",
  dstIp = <any>"dstIp",
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
//   srcIp = "srcIp" as any,
//   dstIp = "dstIp" as any,
// }

export const ipHeaderFields: Field[][] = [
  [
    {
      id: IpHeaderField.version,
      // label: "ver",
      startByte: 0,
      lenBytes: 0.5,
    },
    {
      id: IpHeaderField.len,
      startByte: 0.5,
      lenBytes: 0.5,
    },
    {
      id: IpHeaderField.tos,
      startByte: 1,
      lenBytes: 1,
    },
    {
      id: IpHeaderField.totalLen,
      startByte: 2,
      lenBytes: 2,
    },
  ],
  [
    {
      id: IpHeaderField.id,
      startByte: 4,
      lenBytes: 2,
    },
    {
      id: IpHeaderField.flags,
      startByte: 6,
      lenBytes: 1,
    },
    {
      id: IpHeaderField.fragOff,
      startByte: 7,
      lenBytes: 1,
    },
  ],
  [
    {
      id: IpHeaderField.ttl,
      startByte: 8,
      lenBytes: 1,
    },
    {
      id: IpHeaderField.protocol,
      startByte: 9,
      lenBytes: 1,
    },
    {
      id: IpHeaderField.checksum,
      startByte: 10,
      lenBytes: 2,
    },
  ],
  [
    {
      id: IpHeaderField.srcIp,
      startByte: 12,
      lenBytes: 4,
      splitBytesInFmt: true,
    },
  ],
  [
    {
      id: IpHeaderField.dstIp,
      startByte: 16,
      lenBytes: 4,
      splitBytesInFmt: true,
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
    },
    {
      id: UdpHeaderField.dstPort,
      startByte: 2,
      lenBytes: 2,
    },
  ],
  [
    {
      id: UdpHeaderField.length,
      startByte: 4,
      lenBytes: 2,
    },
    {
      id: UdpHeaderField.checksum,
      startByte: 6,
      lenBytes: 2,
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
