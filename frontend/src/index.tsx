import { render, Component } from "preact";
import Test from "@/Dashboard/General/Test";
import Test2 from "@/Dashboard/General/Test2";
import "./index.css"; // seems to be needed to get tailwind to work anywhere
// although i have no idea why bc this didnt used to be a thing??

class App extends Component {
  render() {
    return (
      <>
        {/* <div className="text-blue-600 font-bold">blah</div> */}
        <Test />
        <Test2 />
      </>
    );
  }
}

render(<App />, document.getElementById("app"));
