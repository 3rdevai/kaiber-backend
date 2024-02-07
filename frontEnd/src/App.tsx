import { SyntheticEvent, useState } from "react";
import "./App.css";
import Axios from "axios";

const backend_ip = "192.168.1.115:8080";

function App() {
  const [state, setState] = useState<string>();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setState("loading");

    try {
      await Axios.post("http://192.168.1.115:8080/api/clients", {
        clientName: name,
        emailAddress: email,
      });
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setState("ready");
    }, 1500);
  };
  return (
    <div className="app-container">
      <form className="mail-container" onSubmit={handleSubmit}>
        <div className="name-form">
          <label htmlFor="name">Name:</label>
          <input
            className="Name"
            type="text"
            placeholder="name..."
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="email-form">
          <label htmlFor="email">Email:</label>
          <input
            className="email"
            type="text"
            placeholder="email..."
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <button className="mail-button" disabled={state === "loading"}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
