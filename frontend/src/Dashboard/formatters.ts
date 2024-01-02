export function fmtTs(unixMillis) {
  return new Date(unixMillis).toISOString().slice(11, -1);
}

export function fmtIp(ipHex: string): string {
  if (ipHex.length !== 8) {
    return "INVALID_IP";
  }
  // Split the input into four groups of two digits
  const bytes = ipHex.match(/.{1,2}/g);

  // Convert each group of two hex digits to decimal
  const decimalBytes = bytes.map((byte) => parseInt(byte, 16));

  // Join the decimal values with dots to format as IP address
  return decimalBytes.join(".");
}

export function fmtPort(portHex: string): string {
  if (portHex.length !== 4) {
    return "INVALID_PORT";
  }
  return parseInt(portHex, 8).toString();
}
