import { Component } from "preact";
import Readout from "@/Dashboard/General/Readout/Readout";
import { Signal } from "@preact/signals";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";

export type ToggleReadoutProps = {
  label?: string; // by default use propName
  dataSignal: Signal<any>;
  propName: string;
};

export default class ToggleReadout extends Component<ToggleReadoutProps> {
  handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.props.dataSignal.value[this.props.propName] = target.checked;
    this.props.dataSignal.value = this.props.dataSignal.value;
    // console.log("new dataSignal: ", this.props.dataSignal.value);
    // dashboardComponentSignals.allPackets.selectedItemSignal.value =
    // dashboardComponentSignals.allPackets.selectedItemSignal.value;
  };

  render() {
    const { label, dataSignal, propName } = this.props;
    const isChecked = dataSignal.value[propName];

    return (
      <Readout
        label={label ?? propName}
        valueElement={
          <input
            type="checkbox"
            checked={isChecked}
            onChange={this.handleChange}
          />
        }
      />
    );
  }
}
