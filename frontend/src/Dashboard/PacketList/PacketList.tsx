import { Component } from "preact";
import { Signal, signal } from "@preact/signals";

import Accordion from "@/Dashboard/General/Accordion";
import ListIcon from "@/Dashboard/Icons/ListIcon";
import BookmarkIcon from "@/Dashboard/Icons/BookmarkIcon";
import VStackIcon from "@/Dashboard/Icons/VStackIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import PanelLayout from "@/Dashboard/General/PanelLayout";
import { DisplayPacket } from "../connectionData";
import AllPackets from "./AllPackets";
import SavedPackets from "./SavedPackets";

type PacketListProps = {
  allPackets: Signal<DisplayPacket[]>;
};
// export default class PacketManipulations extends Component<PacketManipulationsProps> {
export default class PacketList extends Component<PacketListProps> {
  render() {
    const { allPackets } = this.props;
    const leftWidth = signal<number>(500);
    return (
      <Accordion
        title="Packet List"
        icon={<ListIcon />}
        content={
          <PanelLayout
            gap={"4px"}
            leftContent={
              <Accordion
                title="All Packets"
                icon={<VStackIcon />}
                content={<AllPackets allPackets={allPackets} />}
                openSignal={
                  dashboardComponentSignals.allPackets.base
                    .accordionEnableSignal
                }
              />
            }
            leftContentSize={leftWidth}
            rightContent={
              <div className="flex-grow">
                <Accordion
                  title="Saved Packets"
                  icon={<BookmarkIcon />}
                  content={<SavedPackets allPackets={allPackets} />}
                  openSignal={
                    dashboardComponentSignals.allPackets.base
                      .accordionEnableSignal
                  }
                />
              </div>
            }
          />
        }
        openSignal={dashboardComponentSignals.packetList.accordionEnableSignal}
      />
    );
  }
}
