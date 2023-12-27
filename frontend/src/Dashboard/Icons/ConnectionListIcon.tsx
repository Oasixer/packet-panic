import ReactDOM from "react-dom";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired } from "@fortawesome/free-solid-svg-icons";

const Icon: FC = () => {
  return <FontAwesomeIcon icon={faNetworkWired} />;
};

export default Icon;
