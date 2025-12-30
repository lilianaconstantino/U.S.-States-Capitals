import useStates from "../hooks/useStates";

function Library() {
  const states = useStates();

  if (!states.length) {
    return <p>Loading states and capitals...</p>;
  }

  return (
    <div className="library-container">
      <h1>States & Capitals</h1>

      <ul>
        {states.map((state) => (
          <li key={state.objectId}>
            <strong>{state.name}</strong>: {state.capital}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Library;
