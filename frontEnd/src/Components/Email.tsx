import headerImg from "../../public/images/emailHeader.png";
import emailImg from "../../public/images/emailImage.jpg";
import "./Email.css";

const Email = () => {
  return (
    <>
      <div className="email-container">
        <div className="header">
          <img src={headerImg} alt="" />
        </div>
        <div className="email-img">
          <img src={emailImg} alt="" />
        </div>
        <div className="email-words">
          <h1>Hey Creator,</h1>
          <p>Thank you for your experience with Kaiber snapshot!</p>
          <br />
          <p>
            We've attached your video to this email. Hope you enjoy the video
            and visit our site Kaiber.ai!
          </p>

          <p className="kaiber-description">
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
