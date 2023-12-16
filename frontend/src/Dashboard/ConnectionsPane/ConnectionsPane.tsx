import React from "react";
import { useState, FC } from "react";
import type { ConnectionData } from "@/Dashboard/connectionData";
import Connection from "@/Dashboard/ConnectionsPane/Connection";
import { sampleConnections } from "@/Dashboard/connectionData";

// JSX;

const ConnectionsPane: FC = () => {
  let _connections: JSX.Element[] = sampleConnections.map(
    (item: ConnectionData) => (
      <li key={item.uid}>
        <Connection connData={item} />
      </li>
    ),
  );
  const [connections, setConnections] =
    useState<ConnectionData[]>(_connections);
  // setConnections(_connections);

  return (
    <div>
      <h1 className="font-thicc8 text-sz4xl text-white">Connections</h1>

      {/*headers*/}
      <div className="flex flex-row text-szLg flex-nowrap text-green-accent font-rubik6 gap-6">
        {/* <div className="flex flex-row flex-nowrap text-green-accent"> */}
        <h2
          style={{
            width: "60px",
          }}
        >
          Packets
        </h2>
        <h2
          style={{
            width: "100px",
          }}
        >
          Src IP
        </h2>
        <h2
          style={{
            width: "100px",
          }}
        >
          Dst IP
        </h2>
        <h2
          style={{
            width: "30px",
          }}
        >
          Method
        </h2>
      </div>
      <ul className="w-full h-fit flex flex-col">{connections}</ul>
    </div>
  );
};

export default ConnectionsPane;
