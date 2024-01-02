import { FunctionalComponent } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";

const Icon: FunctionalComponent = () => {
  return <FontAwesomeIcon icon={faSitemap} size="lg" />;
};

export default Icon;
