import { useState } from "react";
import "./App.scss";
import { FdpStorage } from "@fairdatasociety/fdp-storage";
import Login from "./components/Login";
import Editor from "./components/Editor";

function App() {
  const [fdp, setFdp] = useState<FdpStorage | null>(null);
  return (
    <div>
      {fdp ? (
        <Editor fdp={fdp} onLogout={() => setFdp(null)} />
      ) : (
        <Login onLogin={setFdp} />
      )}
    </div>
  );
}

export default App;
