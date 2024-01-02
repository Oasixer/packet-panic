import { signal, Signal } from "@preact/signals";
import { Component } from "preact";

import Readout from "@/Dashboard/General/Readout/Readout";
import TextReadoutValue from "@/Dashboard/General/Readout/TextReadout/TextReadoutValue";
import {
  ipPacketMeta,
  getFieldValueById,
  Field,
  PacketTypeMeta,
} from "@/Dashboard/packetTypes";

export type HeaderTextReadoutProps = {
  dataSignal: Signal<any>;
  propId: any; // will be some kinda enum type resolving to a string
  packetTypeMeta: PacketTypeMeta;
  fmt?: (input: string) => string;
};

export default class HeaderTextReadout extends Component<HeaderTextReadoutProps> {
  render() {
    const { dataSignal, propId, packetTypeMeta, fmt } = this.props;
    let _fmt = fmt;
    if (_fmt === undefined) {
      _fmt = (stringy: string) => {
        return stringy;
      };
    }

    return (
      <Readout
        label={packetTypeMeta.labelSubs(propId)}
        valueElement={
          <TextReadoutValue
            valueStr={_fmt(
              getFieldValueById(
                packetTypeMeta.fields,
                propId,
                dataSignal.value[packetTypeMeta.headerProp],
              ),
            )}
          />
        }
      />
    );
  }
}
