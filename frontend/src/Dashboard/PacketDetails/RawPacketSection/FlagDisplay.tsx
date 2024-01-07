import { Component } from "preact";
import { Signal } from "@preact/signals";
import { DisplayPacket } from "@/Dashboard/connectionData";
import { tcpPacketMeta, getFieldValueByField } from "@/Dashboard/packetTypes";
import { fmtBytesToDec } from "@/Dashboard/formatters";

export type FlagDisplayProps = {
  displayPacket: Signal<DisplayPacket>;
};

export default class FlagDisplay extends Component<FlagDisplayProps> {
  render() {
    const { displayPacket } = this.props;

    // Extracting the flag bits
    const decFlags = fmtBytesToDec(
      getFieldValueByField(
        tcpPacketMeta.fields[3][2],
        displayPacket.value.l4HeaderRaw,
      ),
    );

    // Convert decFlags to a binary string and pad to ensure 6 bits
    const flagBits = parseInt(decFlags).toString(2).padStart(6, "0");

    // Define flag labels
    const flagLabels = ["URG", "ACK", "PSH", "RST", "SYN", "FIN"];

    // Creating an array of flag values
    const flags = flagBits.split("").map((bit, index) => {
      return { label: flagLabels[index], value: bit };
    });

    return (
      <div className="flex flex-col gap-1">
        <h1>Flags</h1>
        <table>
          <tbody>
            {flags.map((flag, index) => (
              <tr key={index}>
                <td>{flag.label}</td>
                <td>{flag.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
