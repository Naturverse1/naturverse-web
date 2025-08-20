export default function ProfileSettings(){
  return (
    <>
      <h3>Settings</h3>
      <div className="grid2">
        <input placeholder="Display name" />
        <input placeholder="Email" />
        <select><option>Light</option><option>Dark</option></select>
        <button>Save</button>
      </div>
    </>
  );
}
