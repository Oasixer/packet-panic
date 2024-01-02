// Table
import { Component, JSX } from "preact";
import PlusDropdownIcon from "@/Dashboard/Icons/PlusDropdownIcon";
import { Signal } from "@preact/signals";

export type HeaderField = {
  propName: string;
  label?: string;
  width: number;
};

type TableProps = {
  // columnStructure: ColumnStructure[];
  headerFields: HeaderField[];
  selectedSignal: Signal<number>;
  dataSignal: Signal<any[]>;
};

export class Table extends Component<TableProps> {
  render() {
    const { headerFields, selectedSignal, dataSignal } = this.props;
    return (
      <div className="flex flex-col gap-1">
        {/* header row */}
        <div className="flex flex-row bg-blue-bgInner h-6 items-center gap-1 p-2">
          {headerFields.map((col) => (
            <p
              key={col.propName}
              className="text-sz3.5 font-rubik5 text-green-accent"
              style={{ width: `${col.width}px` }}
            >
              {col.label ?? col.propName}
            </p>
          ))}
          <PlusDropdownIcon />
        </div>
        {/* table content */}
        <div className="flex flex-col gap-1">
          {dataSignal.value.map((rowData, rowIdx) => (
            <div
              className={`flex flex-row bg-blue-bgInner h-6 items-center p-1 gap-1 cursor-pointer ${
                selectedSignal.value === rowData.id
                  ? "border-2 border-green-accent"
                  : "border-2 border-transparent"
              }`}
              onClick={() => {
                selectedSignal.value = rowData.id;
              }}
            >
              {headerFields.map((col) => (
                <p
                  key={col.propName}
                  className="text-sz3.5 font-rubik4"
                  style={{ width: `${col.width}px` }}
                >
                  {rowData[col.propName] ?? "undefined"}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
