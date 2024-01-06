// Must be the first import
console.log("process.env.node_env: ", process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  //   // Must use require here as import statements are only allowed
  //   // to exist at top-level.
  //   require("preact/debug");
  import("preact/debug");
}

import "./index.css"; // seems to be needed to get tailwind to work anywhere
// although i have no idea why bc this didnt used to be a thing??

import { render, Component } from "preact";
import Dashboard from "@/Dashboard/Dashboard";

// does not need to be public b/c we call render on it below
class App extends Component {
  render() {
    return <Dashboard />;
  }
}

render(<App />, document.getElementById("app"));
