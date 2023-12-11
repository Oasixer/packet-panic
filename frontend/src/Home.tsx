const home = () => {

  const handleClicky = () => {
    console.log("hi");
  }

  return (
    <div className="home">
      {/* <h2 className="text-blue-500 text-sz6xl font-wgt600 font-qs">blah</h2> */}
      {/* <h2 className="text-blue-500 text-sz6xl font-thicc3">thicc3</h2> */}
      {/* <h2 className="text-blue-500 text-sz6xl font-thicc8">thicc8</h2> */}
      <h2 className="text-blue-500 text-sz6xl "
      onClick={handleClicky}>non tailwind ig</h2>
      <h2 style={{
        color: "green",
      }}>non tailwind ig</h2>
      <h2 className="text-blue-500 text-sz6xl font-qs6">qs6</h2>
      <h2 className="text-blue-500 text-sz6xl font-thicc8">thicc8</h2>
    </div>
  );
};

export default home;
