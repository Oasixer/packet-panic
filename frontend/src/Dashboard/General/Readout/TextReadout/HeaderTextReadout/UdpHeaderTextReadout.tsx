import { signal, Signal } from "@preact/signals";
import { Component } from "preact";

import HeaderTextReadout from "./HeaderTextReadout";
import { UdpHeaderField, udpPacketMeta } from "@/Dashboard/packetTypes";

const UDP_HEADER_PROP = "l3HeaderRaw";

export type UdpHeaderTextReadoutProps = {
  dataSignal: Signal<any>;
  propId: UdpHeaderField;
  fmt?: (input: string) => string;
};

export default class UdpHeaderTextReadout extends Component<UdpHeaderTextReadoutProps> {
  render() {
    const { dataSignal, propId } = this.props;
    const label: string = HeaderField[propId];
    const id: string = propId as unknown as string;
    return (
      <HeaderTextReadout
        dataSignal={dataSignal}
        headerPropName={UDP_HEADER_PROP}
        propLabel={label}
        propId={id}
        packetTypeMeta={udpPacketMeta}
      />
    );
  }
}
