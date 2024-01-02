import { signal, Signal } from "@preact/signals";
import { Component } from "preact";

import HeaderTextReadout from "./HeaderTextReadout";
import {
  IpHeaderField,
  ipPacketMeta,
  ipLabelSubs,
} from "@/Dashboard/packetTypes";

const IP_HEADER_PROP = "ipHeaderRaw";

export type IpHeaderTextReadoutProps = {
  dataSignal: Signal<any>;
  propId: IpHeaderField;
  fmt?: (input: string) => string;
};

export default class IpHeaderTextReadout extends Component<IpHeaderTextReadoutProps> {
  render() {
    const { dataSignal, propId, fmt } = this.props;
    const label: string = ipLabelSubs(propId);
    const propIdStr: string = propId as unknown as string;
    return (
      <HeaderTextReadout
        dataSignal={dataSignal}
        headerPropName={IP_HEADER_PROP}
        propLabel={label}
        propId={propIdStr}
        packetTypeMeta={ipPacketMeta}
        fmt={fmt}
      />
    );
  }
}
