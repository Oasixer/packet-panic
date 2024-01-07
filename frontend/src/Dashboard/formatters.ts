export enum FmtTypePropName {
  hexFmt = "hexFmt",
  decFmt = "decFmt",
  labelFmt = "labelFmt",
}

export function fmtOrDefault(
  fmt?: (input: string) => string,
): (input: string) => string {
  if (fmt === undefined) {
    return fmtDoNothing;
  }
  return fmt;
}
export function fmtDoNothing(str: string) {
  return str;
}

export function fmtTs(unixMillis) {
  return new Date(unixMillis).toISOString().slice(11, -1);
}

export function fmtIp(ipHex: string): string {
  if (ipHex === undefined) {
    return "UNDEF";
  }
  // console.log("__IP: ", ipHex);
  if (ipHex.length !== 8) {
    console.log("INVALID_IP", ipHex);
    return "INVALID_IP";
  }
  // Split the input into four groups of two digits
  const bytes = ipHex.match(/.{1,2}/g);

  // Convert each group of two hex digits to decimal
  const decimalBytes = bytes.map((byte) => parseInt(byte, 16));

  // Join the decimal values with dots to format as IP address
  return decimalBytes.join(".");
}

export function fmtBytesToDec(hexBytes: string): string {
  return parseInt(hexBytes, 16).toString();
}

export function fmt2BytesToDec(portHex: string): string {
  if (portHex === undefined) {
    return "UNDEF";
  }

  if (portHex.length !== 4) {
    console.log("INVALID_PORT", portHex);
    return "INVALID_PORT";
  }
  return parseInt(portHex, 16).toString();
}
