import { useState, FC } from "react";
import Home from "./Home";
import ConnectionDetailsPane from "@/Dashboard/ConnectionDetailsPane/ConnectionDetailsPane";
import ConnectionsPane from "@/Dashboard/ConnectionsPane/ConnectionsPane";
import React from "react";

// Define a type for the person object
type Person = {
  name: string;
  age: number;
};

const App: FC = () => {
  // const [count, setCount] = useState<number>(0);
  const [count, setCount] = useState<number>(25);

  // const handleclick = () => {
  //   setCount();
  // };

  // Annotate the person object with the Person type
  const person: Person = { name: "yoshi", age: 30 };
  const title: string = "lorem ipsum?? idk";
  const likes: number = 50;

  return (
    <div className="App bg-blue-bgOuter w-full my-0 flex flex-row items-center gap-5 flex-wrap">
      <ConnectionsPane />
      {/* <ConnectionDetailsPane /> */}
      {/* <p>{Math.random() * 10}</p> */}
      {/* <a href={`http://idk.com/${person.name}`}>link ig</a> */}
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      {/* <Home /> */}
      {/* </div> */}
    </div>
  );
};

export default App;
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import Navbar from "./Navbar.jsx";
// import Home from "./Home.jsx";
//
// function App() {
//   const [count, setCount] = useState(0);
//
//   const person = { name: "yoshi", age: 30 };
//   const title = "lorem ipsum?? idk";
//   const likes = 50;
//
//   return (
//     <div className="App">
//       <Navbar />
//       <div className="content">
//         <h1>{title}</h1>
//         <p> {Math.random() * 10}</p>
//         <a href={"http://idk.com/" + person.name}>link ig</a>
//         <h1 className="text-3xl font-bold underline">Hello world!</h1>
//         <Home />
//       </div>
//     </div>
//   );
// }
//
// export default App;
