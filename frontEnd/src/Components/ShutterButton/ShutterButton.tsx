import {
  Fragment,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Axios from "axios";
import gsap from "gsap";
import shutter from "../../images/shutter.svg";
import "./ShutterButton.css";

const backend_ip = "192.168.1.115:8080";
const local_backend = "localhost:8080";

interface shutterButtonProps {
  formClick: boolean;
  name: string;
  email: string;
  setInit: (value: boolean) => void;
}

const ShutterButton = (props: shutterButtonProps) => {
  const shutterButtonRef = useRef<HTMLDivElement>(null);
  const progressWindowRef = useRef<HTMLDivElement>(null);

  const [showProgress, setShowProgress] = useState<boolean>(false);

  useEffect(() => {
    if (props.formClick) {
      gsap.to(shutterButtonRef.current, {
        delay: 0.5,
        opacity: "1",
        visibility: "visible",
      });
    }
  }, [props.formClick]);

  const handleShutterPointerUp = useCallback(
    async (e: SyntheticEvent) => {
      if (!shutterButtonRef.current) return;
      if (!progressWindowRef.current) return;
      if (!progressWindowRef.current) return;

      gsap.to(shutterButtonRef.current, {
        // opacity: "0",
        scale: 1,
        duration: 0.2,
        onComplete: () => setShowProgress(true),
      });

      console.log("shutter up");

      e.preventDefault();

      try {
        await Axios.post(`http://${backend_ip}/upload-video`, {
          clientName: props.name,
          emailAddress: props.email,
        });
        setTimeout(() => {}, 1500);
      } catch (error) {
        console.log(error);
      }

      if (showProgress) {
        progressWindowRef.current.style.visibility = "visible";
        gsap.to(shutterButtonRef.current, {
          opacity: "0",
          visibility: "hidden",
        });
        gsap.to(progressWindowRef.current, {
          opacity: "1",
          duration: 0.3,
          onComplete: () => {
            if (!progressWindowRef.current) return;
            gsap.to(progressWindowRef.current, {
              delay: 8,
              opacity: "0",
              onComplete: () => {
                if (!progressWindowRef.current) return;
                progressWindowRef.current.style.visibility = "hidden";
                props.setInit(true);
              },
            });
          },
        });
      }
    },
    [showProgress, props]
  );

  return (
    <Fragment>
      <div className="progress-container" ref={progressWindowRef}>
        <h1>Recording in progress</h1>
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="shutter-button" ref={shutterButtonRef}>
        <button
          onPointerDown={() => {
            if (!shutterButtonRef.current) return;
            gsap.to(shutterButtonRef.current, {
              scale: 0.95,
              duration: 0.2,
            });
          }}
          onPointerUp={handleShutterPointerUp}
        >
          <img src={shutter} alt="" />
        </button>
      </div>
    </Fragment>
  );
};

export default ShutterButton;
