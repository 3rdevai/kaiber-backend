import { useEffect, useRef } from "react";
import "./InputMessage.css";
import gsap from "gsap";

interface messageProps {
  message: string;
  showMessage: boolean;
}

const InputMessage = (props: messageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageRef.current) return;

    if (props.showMessage) {
      gsap.to(messageRef.current, {
        overwrite: true,
        opacity: "1",
        duration: 0.3,
        visibility: "visible",
        onComplete: () => {
          if (!messageRef.current) return;
          gsap.to(messageRef.current, {
            delay: 1,
            opacity: "0",
            duration: 0.3,
            onComplete: () => {
              if (!messageRef.current) return;
              messageRef.current.style.visibility = "hidden";
            },
          });
        },
      });
    }
  }, [props.showMessage]);

  return (
    <div className="message-container" ref={messageRef}>
      <h1>{props.message}</h1>
    </div>
  );
};

export default InputMessage;
