import { Signal, signal } from "@preact/signals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component, JSX } from "preact";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

type AccordionProps = {
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
  // maxWidth?: number;
  openSignal: Signal<boolean>;
  // forceWidth?: boolean;
};

export default class Accordion extends Component<AccordionProps> {
  render() {
    const { title, icon, content, maxWidth, openSignal, forceWidth } =
      this.props;
    return (
      <div
        // style={{ maxWidth: maxWidth, minWidth: forceWidth ? maxWidth : 0 }}
        className="flex flex-col flex-nowrap"
      >
        <div /* accordion header */
          className="flex flex-row flex-nowrap align-middle items-center bg-blue-bgInner h-8"
          onClick={() => {
            openSignal.value = !openSignal.value;
          }}
        >
          {/* accordion left icon */}
          <div className="ml-2">{icon}</div>

          {/* accordion title */}
          <p className="font-rubik5 text-sz4 text-white font-rubik4 ml-2 select-none">
            {title}
          </p>

          {/* accordion dropdown caret btn */}
          <div className="ml-auto w-2 mr-2">
            <FontAwesomeIcon
              icon={openSignal.value ? faCaretDown : faCaretRight}
              size="lg"
            />
          </div>
        </div>

        {/* Accordion Content: */}
        {openSignal.value && <div className="ml-6 mt-1">{content}</div>}
      </div>
    );
  }
}
