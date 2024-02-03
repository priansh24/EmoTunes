import React, { useEffect } from "react";
import "../css/Home.css";
import heroimage from "../images/heroimage.svg";
import blueheadphones from "../images/blueheadphones.svg";
import rectangle from "../images/rectangle1.svg";
import smilingimage from "../images/youngsmile.svg";
import { requestWebcamPermission } from "./index.js";
export default function Home() {
  useEffect(() => {
    // Call the imported function
    requestWebcamPermission();
  }, []);

  const stopcamera = () => {};
  return (
    <>
      <div className="content">
        <div className="text">
          <div className="maintagline">
            <div className="feel">Feel.</div>
            <div className="sync">Sync.</div>
            <div className="play">Play.</div>
          </div>
          <div className="tagline2">
            Our innovative platform reads your mood in real-time, utilizing
            advanced emotion recognition algorithms. We curate personalized
            playlists that resonate with your feelings, creating a seamless and
            tailored musical experience just for you. Explore the power of
            emotion-driven playlists – because your mood deserves its own
            soundtrack."
          </div>
        </div>
        <div className="heroimages">
          <img src={rectangle} alt="" className="rectangle" />
          <img src={blueheadphones} alt="heroimage" className="theimage" />
        </div>
      </div>
      <div className="camera">
        <div className="smile">SMILE</div>
        <div id="webcam-container">
      <video id="webcam-video" autoPlay playsInline width="100%"></video>
    </div>

        <div className="start">
          <button className="startbutton" onClick={requestWebcamPermission}>
            Start
          </button>
          <button className="stopbutton" onClick={stopcamera}>
            Stop
          </button>
        </div>
        {/* <div className="playlist"></div> */}
      </div>
    </>
  );
}
