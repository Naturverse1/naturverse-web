export default function Observations(){
  return (
    <>
      <h2>Observations</h2>
      <p className="muted">Log your nature finds here.</p>
      <div className="grid2">
        <input placeholder="What did you see?" />
        <input placeholder="Where?" />
        <button>Save</button>
      </div>
    </>
  );
}
