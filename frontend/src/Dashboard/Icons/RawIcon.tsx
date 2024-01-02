import { FunctionalComponent } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
// or faFileCode

const Icon: FunctionalComponent = () => {
  return <FontAwesomeIcon icon={faFileCode} />;
};

export default Icon;
