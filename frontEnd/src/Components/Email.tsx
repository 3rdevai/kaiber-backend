import headerImg from "../../public/images/emailHeader.png";
import emailImg from "../../public/images/emailImage.jpg";
import "./Email.css";

const Email = () => {
  return (
    <>
      <div
        className="email-container"
        style={{
          backgroundColor: "white",
          maxWidth: "640px",
          position: "fixed",
          fontFamily: "Helvetica",
          color: "black",
        }}
      >
        <div className="header">
          <img src={headerImg} alt="" style={{ width: "30rem" }} />
        </div>
        <div className="email-img">
          <img src={emailImg} alt="" style={{ width: "40rem" }} />
        </div>
        <div className="email-words" style={{ margin: "0rem 2rem" }}>
          <h1 style={{ fontSize: "36px" }}>Hey Creator,</h1>
          <p style={{ margin: "0", fontSize: "18px" }}>
            Thank you for your experience with Kaiber snapshot!
          </p>
          <br />
          <p>
            We've attached your video to this email. Hope you enjoy the video
            and visit our site Kaiber.ai!
          </p>

          <p
            className="kaiber-description"
            style={{ color: "#7c7c7c", fontSize: "12px", margin: "2rem 0rem" }}
          >
            Kaiber is an AI creative lab on a mission to empower people
            everywhere to discover the artist within. We help creatives tell
            stories in a whole new way through our generative art platform and
            creative studio. From music videos and social media content to live
            event visuals and beyond, Kaiber can transform your ideas into
            captivating multimedia experiences with ease.
          </p>
        </div>
      </div>
    </>
  );
};

export default Email;
