import React, { useEffect, useState } from "react";
import "../css/Home.css";
import heroimage from "../images/heroimage.svg";
import blueheadphones from "../images/blueheadphones.svg";
import rectangle from "../images/rectangle1.svg";
import smilingimage from "../images/youngsmile.svg";
import { requestWebcamPermission } from "./index.js";
import axios from "axios";
const Home = () => {
  const [mediaStream, setMediaStream] = useState(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam:", error.message);
    }
  };

  const stopWebcam = () => {
    // Stop the media stream
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const uploadVideo = async () => {
    if (!mediaStream) return;

    try {
      // Convert video frames to a Blob
      const videoBlob = await captureVideoBlob();

      // Create a FormData object and append the Blob to it
      const formData = new FormData();
      formData.append("video", videoBlob, "captured_video.mp4");

      // Upload the video to the Flask endpoint
      await axios.post("http://localhost:5000/upload_video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Inform the user that the video is uploaded
      console.log("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error.message);
    }
  };

  const captureVideoBlob = () => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");
      const context = canvas.getContext("2d");

      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to Blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "video/mp4");
      };

      video.play();
    });
  };

  useEffect(() => {
    let timeoutId;

    if (mediaStream) {
      // Stop the webcam after 10 seconds
      timeoutId = setTimeout(() => {
        stopWebcam();
        uploadVideo();
      }, 10000);
    }

    // Cleanup the timer when the component unmounts or the webcam is stopped manually
    return () => {
      clearTimeout(timeoutId);
    };
  }, [mediaStream]);

  return (
    <>
      <div className="content">
        <div className="text">
          <div className="maintagline">
            <div className="feel"> Feel. </div>{" "}
            <div className="sync"> Sync. </div>{" "}
            <div className="play"> Play. </div>{" "}
          </div>{" "}
          <div className="tagline2">
            Our innovative platform reads your mood in real - time, utilizing
            advanced emotion recognition algorithms.We curate personalized
            playlists that resonate with your feelings, creating a seamless and
            tailored musical experience just for you.Explore the power of
            emotion - driven playlists– because your mood deserves its own
            soundtrack.{" "}
          </div>{" "}
        </div>{" "}
        <div className="heroimages">
          <img src={rectangle} alt="" className="rectangle" />
          <img src={blueheadphones} alt="heroimage" className="theimage" />
        </div>{" "}
      </div>{" "}
      <div className="camera">
        <div className="smile"> Capture </div>{" "}
        <div id="webcam-container">
          {" "}
          {mediaStream && (
            <video
              id="webcam-video"
              width="640"
              height="480"
              autoPlay
              playsInline
              ref={(videoRef) => {
                if (videoRef) {
                  videoRef.srcObject = mediaStream;
                  // srcObject={mediaStream}
                }
              }}
            ></video>
          )}{" "}
        </div>{" "}
        <div className="start">
          <button className="startbutton" onClick={startWebcam}>
            {/* {" "} */}
            Start Video{" "}
          </button>{" "}
          {/* Start{" "}
                                                                                                                                                                                      </button>{" "} */}{" "}
        </div>{" "}
        {/* <div className="playlist"></div> */}{" "}
      </div>{" "}
    </>
  );
};
export default Home;
