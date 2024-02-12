import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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

  const [boxChecked, setBoxChecked] = useState<boolean>(false);

  const checkBoxHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setBoxChecked(e.target.checked);
  };

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
      {/* <Email /> */}
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
          <div className="checkbox-form">
            <input type="checkbox" onChange={checkBoxHandle} />
            <p>
              I agree to receive communications from Kaiber. I understand I can
              unsubscribe at any time. For more information, read our
              <a href="https://kaiber.ai/privacy">Privacy Policy.</a>
            </p>
          </div>
          <button
            className="mail-button"
            disabled={
              name === "" || email === "" || !boxChecked || state === "Sending"
            }
            ref={buttonRef}
            style={{
              color:
                name === "" ||
                email === "" ||
                !boxChecked ||
                state === "Sending"
                  ? "#597769"
                  : "#000000",
            }}
            onPointerDown={() => {
              if (!buttonRef.current) return;
              gsap.to(buttonRef.current, {
                scale:
                  name === "" ||
                  email === "" ||
                  !boxChecked ||
                  state === "Sending"
                    ? 1
                    : 0.95,
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
