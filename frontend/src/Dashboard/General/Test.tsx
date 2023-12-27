import Accordion from "@/Dashboard/General/Accordion";
import ConnectionListIcon from "@/Dashboard/Icons/ConnectionListIcon";
const Test = () => {
  return (
    <div
      className="test bg-red-900"
      style={{ height: "200px", width: "600px" }}
    >
      <Accordion
        title={"test accordion"}
        icon={<ConnectionListIcon />}
        content={
          <div
            className="bg-blue-400"
            style={{ height: "100px", width: "300px" }}
          >
            blah
          </div>
        }
      />
    </div>
  );
};

export default Test;
