import { Signal } from "@preact/signals";
import { Component, JSX } from "preact";

export type PanelLayoutProps = {
  leftContent: JSX.Element;
  leftContentSize: Signal<number>;
  rightContent: JSX.Element;
};

export default class PanelLayout extends Component<PanelLayoutProps> {
  state = { isResizing: false, startX: 0 };

  startResizing = (event) => {
    document.body.style.userSelect = "none"; // Disable text selection
    console.log("resizing yo ", this.props.leftContentSize.value);
    this.setState({ isResizing: true, startX: event.clientX });
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.stopResizing);
  };

  handleMouseMove = (event) => {
    if (this.state.isResizing) {
      const newWidth = event.clientX;
      this.props.leftContentSize.value = newWidth;
      console.log("continuing resize ", this.props.leftContentSize.value);
      this.setState({ isResizing: false });
      this.setState({ isResizing: true }); // force refresh hehe
    }
  };

  stopResizing = () => {
    this.setState({ isResizing: false });
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.stopResizing);
    console.log("done resizing.");
    document.body.style.userSelect = ""; // Disable text selection
  };

  render() {
    const { leftContent, leftContentSize, rightContent } = this.props;
    return (
      <div className="flex flex-row flex-nowrap">
        <div
          className=""
          style={{
            minWidth: leftContentSize.value + "px",
            width: leftContentSize.value + "px",
          }}
        >
          {leftContent}
        </div>
        {/* {leftContent} */}
        <div
          className="resizer min-h-full min-w-2 max-w-2 cursor-col-resize"
          onMouseDown={this.startResizing}
        ></div>
        {rightContent}
      </div>
    );
  }
}
