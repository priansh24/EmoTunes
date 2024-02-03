import React from "react";
import "../css/Home.css";
import heroimage from "../images/heroimage.svg";
import Webcam from "./webcam";
import smilingimage from "../images/youngsmile.svg";
export default function Home() {
  const startingcamera = () => {
    <Webcam />;
  };
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
        <img src={heroimage} alt="heroimage" className="theimage" />
      </div>
      <div className="camera">
        <div className="smile">SMILE</div>
        <div className="opencamera">Camera</div>

        <div className="start">
          <button className="startbutton" onClick={startingcamera}>
            Start
          </button>
        </div>
        {/* <div className="playlist">playlist will come here</div> */}
      </div>
    </>
  );
}
