import { FunctionalComponent } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

const Icon: FunctionalComponent = () => {
  return <FontAwesomeIcon icon={faChartLine} />;
};

export default Icon;
