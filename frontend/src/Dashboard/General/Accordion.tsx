import { signal } from "@preact/signals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JSX } from "preact";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

type AccordionProps = {
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
};

const isActive = signal(true);

const Accordion = ({ title, icon, content }: AccordionProps) => {
  return (
    <div className="accordion-item">
      <div
        className="flex flex-row flex-nowrap align-middle items-center bg-blue-bgInner text-red"
        onClick={() => {
          console.log("hi", isActive);
          isActive.value = !isActive.value;
        }}
      >
        {icon}
        {title}
        <div className="ml-1 w-2">
          <FontAwesomeIcon icon={isActive.value ? faCaretDown : faCaretRight} />
        </div>
      </div>
      {isActive.value && <div className="accordion-content">{content}</div>}
    </div>
  );
};
export default Accordion;
