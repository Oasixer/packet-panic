import { Component } from "preact";

type PngIconProps = {
  filename: string;
  size: string;
};

export default class PngIcon extends Component<PngIconProps> {
  render() {
    const { filename, size } = this.props;
    return (
      <img src={`/icons/${filename}.png`} alt={filename} className={size} />
    );
  }
}
