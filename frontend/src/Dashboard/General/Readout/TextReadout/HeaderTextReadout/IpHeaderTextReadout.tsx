import { signal, Signal } from "@preact/signals";
import { Component } from "preact";

import HeaderTextReadout from "./HeaderTextReadout";
import { IpHeaderField, ipPacketMeta } from "@/Dashboard/packetTypes";

export type IpHeaderTextReadoutProps = {
  dataSignal: Signal<any>;
  propId: IpHeaderField;
  fmt?: (input: string) => string;
};

export default class IpHeaderTextReadout extends Component<IpHeaderTextReadoutProps> {
  render() {
    const { dataSignal, propId, fmt } = this.props;
    const propIdStr: string = propId as unknown as string;
    return (
      <HeaderTextReadout
        dataSignal={dataSignal}
        propId={propIdStr}
        packetTypeMeta={ipPacketMeta}
        fmt={fmt}
      />
    );
  }
}
