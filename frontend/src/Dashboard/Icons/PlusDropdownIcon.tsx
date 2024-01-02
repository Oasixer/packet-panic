import { FunctionalComponent } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Icon: FunctionalComponent = () => {
  return (
    <div className="flex flex-row flex-nowrap text-grey-300">
      <FontAwesomeIcon icon={faPlus} />
      <FontAwesomeIcon
        icon={faCaretDown}
        size="2xs"
        style={{ marginTop: "-2px", marginLeft: "-4px" }}
      />
    </div>
  );
};

export default Icon;
