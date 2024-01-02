import { Signal, signal } from "@preact/signals";
import { Component, JSX } from "preact";

export type PanelLayoutProps = {
  leftContent: JSX.Element;
  leftContentSize: Signal<number>;
  rightContent: JSX.Element;
  gap?: string; // in tailwind units
};

// const DEFAULT_GAP = "1";

export default class PanelLayout extends Component<PanelLayoutProps> {
  state = { isResizing: false, startX: 0, startSz: 0 };

  startResizing = (event) => {
    document.body.style.userSelect = "none"; // Disable text selection
    // console.log(
    //   "start resizing @ clientX, sz:",
    //   event.clientX,
    //   this.props.leftContentSize.value,
    // );
    this.setState({
      isResizing: true,
      startX: event.clientX,
      startSz: this.props.leftContentSize.value,
    });
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.stopResizing);
    document.body.style.cursor = "col-resize";
  };

  handleMouseMove = (event) => {
    if (this.state.isResizing) {
      const newWidth = this.state.startSz + event.clientX - this.state.startX;
      this.props.leftContentSize.value = newWidth;
      // console.log(
      //   "continuing resize (clientX:) ",
      //   event.clientX,
      //   this.props.leftContentSize.value,
      // );
      this.setState({
        isResizing: true,
        startX: this.state.startX,
        startSz: this.state.startSz,
      }); // force refresh hehe
    }
  };

  stopResizing = () => {
    this.setState({ isResizing: false });
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.stopResizing);
    // console.log("done resizing.");
    document.body.style.cursor = "";
    document.body.style.userSelect = ""; // Disable text selection
  };

  render() {
    const { leftContent, leftContentSize, rightContent, gap } = this.props;
    const _gap = gap ?? "8px";
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
          className={`min-h-full cursor-col-resize`}
          style={{ minWidth: _gap, maxWidth: _gap }}
          onMouseDown={this.startResizing}
        ></div>
        {rightContent}
      </div>
    );
  }
}
