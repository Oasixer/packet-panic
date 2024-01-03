import { FunctionalComponent } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

const Icon: FunctionalComponent = () => {
  return <FontAwesomeIcon icon={faBookmark} />;
};

export default Icon;
