import { FunctionalComponent } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPooStorm } from "@fortawesome/free-solid-svg-icons";

const Icon: FunctionalComponent = () => {
  return <FontAwesomeIcon icon={faPooStorm} />;
};

export default Icon;
