import { Signal, signal } from "@preact/signals";
import { Component, JSX } from "preact";
import { ConnectionData } from "@/Dashboard/connectionData";

export type ConnectionPacketsProps = {
  connectionData: Signal<ConnectionData>;
};

export default class Dashboard extends Component<ConnectionPacketsProps> {
  render() {
    return (
      <div>blah</div>
    );
  }
}
