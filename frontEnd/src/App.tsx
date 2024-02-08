import { SyntheticEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import gsap from "gsap";
import ShutterButton from "./Components/ShutterButton/ShutterButton";
import InputMessage from "./Components/InputMessage/InputMessage";

// const backend_ip = "192.168.1.115:8080";

function App() {
  const [state, setState] = useState<string>("Send");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [inputMessage, setInputMessage] = useState<string>("");

  const [initForm, setInitForm] = useState<boolean>(true);
  const [formClick, setFormClick] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const mailFormRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    if (!nameInputRef.current) return;
    if (!emailInputRef.current) return;

    e.preventDefault();

    if (nameInputRef.current.value.trim() === "") {
      setInputMessage("Please put your name");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1300);
    } else if (emailInputRef.current.value.trim() === "") {
      setInputMessage("Please put your email");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1300);
    } else {
      setState("Sending");

      setTimeout(() => {
        setState("Sent");
        setFormClick(true);
      }, 1500);
    }
  };

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

    if (formClick) {
      gsap.to(mailFormRef.current, {
        opacity: "0",
        overwrite: true,
        onComplete: () => {
          if (!mailFormRef.current) return;
          mailFormRef.current.style.visibility = "hidden";
          setInitForm(false);
        },
      });
    }
  }, [formClick]);

  useEffect(() => {
    if (!mailFormRef.current) return;
    if (initForm) {
      setState("Send");
      setFormClick(false);
      gsap.fromTo(
        mailFormRef.current,
        { opacity: "0" },
        {
          opacity: "1",
          overwrite: true,
        }
      );
    }
  }, [initForm]);

  return (
    <div className="app-container">
      <InputMessage message={inputMessage} showMessage={showMessage} />
      <ShutterButton
        formClick={formClick}
        name={name}
        email={email}
        setInit={setInitForm}
      />
      {initForm && (
        <form
          className="mail-container"
          onSubmit={handleSubmit}
          ref={mailFormRef}
        >
          <div className="name-form">
            <label htmlFor="name">Name:</label>
            <input
              ref={nameInputRef}
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
              ref={emailInputRef}
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
            style={{
              color: state === "Sending" ? "#597769" : "#000000",
            }}
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
      )}
    </div>
  );
}

export default App;
