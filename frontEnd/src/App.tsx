import { SyntheticEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import Axios from "axios";
import gsap from "gsap";
import shutter from "../public/images/shutter.svg";

const backend_ip = "192.168.1.115:8080";

function App() {
  const [state, setState] = useState<string>("Send");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [formClick, setFormClick] = useState<boolean>(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    setState("Sending");
    e.preventDefault();

    try {
      await Axios.post("http://localhost:8080/api/clients", {
        clientName: name,
        emailAddress: email,
      });
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setState("Sent");
      setFormClick(true);
    }, 1500);
  };

  const mailFormRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shutterButtonRef = useRef<HTMLDivElement>(null);

  const pointerHover = () => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      boxShadow: "0px 0px 10px 2px rgba(255,255,255,0.75)",
      duration: 0.3,
      ease: "power1.out",
      backgroundColor: "#a6ebb3",
    });
  };

  const pointerOut = () => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.75)",
      duration: 0.15,
      ease: "power1.in",
      backgroundColor: "#8ad498",
    });
  };

  useEffect(() => {
    if (!mailFormRef.current) return;
    if (!shutterButtonRef.current) return;

    if (formClick) {
      gsap.to(mailFormRef.current, {
        opacity: "0",
        overwrite: true,
        onComplete: () => {
          if (!mailFormRef.current) return;
          mailFormRef.current.style.visibility = "hidden";
        },
      });
      gsap.to(shutterButtonRef.current, {
        delay: 0.5,
        opacity: "1",
        visibility: "visible",
      });
    }
  }, [state, formClick]);

  return (
    <div className="app-container">
      <div className="shutter-button" ref={shutterButtonRef}>
        <button
          onPointerDown={() => {
            if (!shutterButtonRef.current) return;
            gsap.to(shutterButtonRef.current, {
              scale: 0.95,
              duration: 0.2,
            });
          }}
          onPointerUp={() => {
            if (!shutterButtonRef.current) return;
            gsap.to(shutterButtonRef.current, {
              scale: 1,
              duration: 0.2,
            });
          }}
        >
          <img src={shutter} alt="" />
        </button>
      </div>
      <form
        className="mail-container"
        onSubmit={handleSubmit}
        ref={mailFormRef}
      >
        <div className="name-form">
          <label htmlFor="name">Name:</label>
          <input
            className="Name"
            type="text"
            placeholder="Enter your name"
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
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <button
          className="mail-button"
          disabled={state === "loading"}
          ref={buttonRef}
          onPointerOver={pointerHover}
          onPointerLeave={pointerOut}
          onPointerDown={() => {
            if (!buttonRef.current) return;
            gsap.to(buttonRef.current, {
              scale: 0.95,
              duration: 0.2,
            });
          }}
          onPointerUp={() => {
            if (!buttonRef.current) return;
            gsap.to(buttonRef.current, {
              scale: 1,
              duration: 0.2,
            });
          }}
        >
          {state}
        </button>
      </form>
    </div>
  );
}

export default App;
