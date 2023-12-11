import React from "react";
import { FC } from "react";

// forks fine but annoys the linter...
import type { ConnectionData } from "@/connectionData";
// import type { ConnectionData } from "../connectionData";

const Connection: FC<{ connData: ConnectionData }> = ({ connData }) => {
  return (
    <div className="flex flex-row text-szLg flex-nowrap text-white font-rubik4 gap-6">
      <div /* nPackets */
        className=""
        style={{
          width: "60px",
        }}
      >
        {connData.nPackets.toString()}
      </div>

      <div /* Src IP */
        style={{
          width: "100px",
        }}
        className=""
      >
        {connData.srcIp}
      </div>

      <div /* Dst IP */
        style={{
          width: "100px",
        }}
        className=""
      >
        {connData.dstIp}
      </div>

      <div /* Method */ className="">{connData.protocol}</div>
    </div>
  );
};

export default Connection;
