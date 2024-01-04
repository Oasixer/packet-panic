import { Component } from "preact";

export enum ByteLabelFormat {
  none = "none",
  nums = "nums",
  names = "names",
}
export type ByteLabelProps = {
  fmt: ByteLabelFormat;
};

// basically i wanna use ToggleReadout which expects an enclosing object in a signal
export default class ByteLabel extends Component<ByteLabelProps> {
  render() {
    const { fmt } = this.props;
    // let labels: string[] = ["byte1", "byte2", "byte3", "byte4"];
    let labels: string[] = [];
    for (let i = 0; i < 4; i++) {
      if (fmt === ByteLabelFormat.nums) {
        labels.push((i + 1).toString());
      } else if (fmt === ByteLabelFormat.names) {
        labels.push("byte" + (i + 1).toString());
      }
    }
    console.log("labels: ", labels);
    return (
      <div className="flex flex-row justify-around h-4 font-monoCP text-sz3.5 mb-[-2px] mt-[-4px]">
        {labels.map((label) => (
          <p>{label}</p>
        ))}
      </div>
    );
  }
}
