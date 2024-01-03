import { signal, Signal } from "@preact/signals";
import { Component } from "preact";

import HeaderTextReadout from "./HeaderTextReadout";
import { UdpHeaderField, udpPacketMeta } from "@/Dashboard/packetTypes";

// const UDP_HEADER_PROP = "l3HeaderRaw";

export type UdpHeaderTextReadoutProps = {
  dataSignal: Signal<any>;
  propId: UdpHeaderField;
  fmt?: (input: string) => string;
};

export default class UdpHeaderTextReadout extends Component<UdpHeaderTextReadoutProps> {
  render() {
    const { dataSignal, propId, fmt } = this.props;
    const propIdStr: string = propId as unknown as string;
    return (
      <HeaderTextReadout
        dataSignal={dataSignal}
        propId={propIdStr}
        packetTypeMeta={udpPacketMeta}
        fmt={fmt}
      />
    );
  }
}
