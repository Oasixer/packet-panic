import { FunctionalComponent } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired } from "@fortawesome/free-solid-svg-icons";

const Icon: FunctionalComponent = () => {
  return <FontAwesomeIcon icon={faNetworkWired} size="lg" />;
};

export default Icon;
