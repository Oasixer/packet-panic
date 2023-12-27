import { signal } from "@preact/signals";

// Create a signal that can be subscribed to:
const count = signal(0);

function Counter() {
  // Accessing .value in a component automatically re-renders when it changes:
  const value = count.value;

  const increment = () => {
    // A signal is updated by assigning to the `.value` property:
    count.value++;
  };

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={increment}>click me</button>
    </div>
  );
}
export default Counter;
