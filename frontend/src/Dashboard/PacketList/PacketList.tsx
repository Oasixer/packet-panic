import { Component } from "preact";
import { signal } from "@preact/signals";

import Accordion from "@/Dashboard/General/Accordion";
import ListIcon from "@/Dashboard/Icons/ListIcon";
import BookmarkIcon from "@/Dashboard/Icons/BookmarkIcon";
import VStackIcon from "@/Dashboard/Icons/VStackIcon";
import { dashboardComponentSignals } from "@/Dashboard/Dashboard";
import PanelLayout from "@/Dashboard/General/PanelLayout";

// export default class PacketManipulations extends Component<PacketManipulationsProps> {
export default class PacketManipulations extends Component {
  render() {
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
                content={<div>temp</div>}
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
                  title="Bookmarked Packets"
                  icon={<BookmarkIcon />}
                  content={<div>temp</div>}
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
