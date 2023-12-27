import React from "react";

import type { ConnectionData } from "@/Dashboard/connectionData.ts";
import { sampleConnections } from "@/Dashboard/connectionData.ts";
// import Connection from "./Connection";

const ConnectionDetailsPane = () => {
  const nConnectionsToDisplay = 6;

  // ));

  return (
    <div
      className="bg-blue-bgInner flex flex-col flex-nowrap"
      style={{
        width: "400px",
      }}
    >
      <h1 className="font-thicc8 text-sz4xl text-white">Connection Details</h1>
      {/* add graph of connection here! */}
    </div>
  );
};

export default ConnectionDetailsPane;
