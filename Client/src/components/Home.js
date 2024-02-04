import React, { useEffect, useState } from "react";
import "../css/Home.css";
import blueheadphones from "../images/blueheadphones.svg";
import rectangle from "../images/rectangle1.svg";
// import heroimage from "../images/heroimage.svg";
// import smilingimage from "../images/youngsmile.svg";
// import { requestWebcamPermission } from "./index.js";

const Home = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedPhotoBlob, setCapturedPhotoBlob] = useState(null);

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

  const capturePhoto = () => {
    if (!mediaStream) return;

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
        setCapturedPhotoBlob(blob);
      }, "image/jpeg"); // Change to "image/png" or other formats if needed
    };

    video.play();
  };

  const uploadPhoto = async () => {
    try {
      if (capturedPhotoBlob) {
        const formData = new FormData();
        formData.append("photo", capturedPhotoBlob, "captured_photo.jpg");

        // Upload the photo to the server endpoint
        const response = await fetch("http://localhost:5000/upload_photo", {
          method: "POST",
          body: formData,
        });

        // Log the server response for debugging
        const serverResponse = await response.json();
        // console.log("Server Response:", await response.text());
        console.log("Server Response:", serverResponse);

        // Inform the user that the photo is uploaded
        console.log("Photo uploaded successfully");

        const response2 = await fetch("http://localhost:8000/songs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serverResponse),
        });
        const serverResponse2 = await response2.json();
        console.log("Server Response2:", serverResponse2);
      } else {
        console.warn("No photo to upload.");
        // You might want to show a user-friendly message that there's no photo to upload
      }
    } catch (error) {
      console.error("Error uploading photo:", error.message);
      // You might want to show a user-friendly error message to the user
    }
  };
  useEffect(() => {
    return () => {
      // Cleanup: Stop the webcam and revoke the Object URL
      stopWebcam();
      if (capturedPhotoBlob) {
        URL.revokeObjectURL(URL.createObjectURL(capturedPhotoBlob));
      }
    };
  }, [capturedPhotoBlob]);

  const handleLoginClick = () => {
    window.location.href = "http://localhost:8000/login";
  };

  // Assuming your server responds with a JSON object
  // const data = await response.json();

  // Handle the response data or redirect based on your requirements
  // console.log(data);

  // Redirect to the login endpoint
  // const getAuthorizationUrl = async () => {

  // };

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
                }
              }}
            ></video>
          )}{" "}
        </div>{" "}
        <div className="start">
          <button className="startbutton" onClick={startWebcam}>
            Start Video{" "}
          </button>{" "}
          <button className="startbutton" onClick={capturePhoto}>
            Capture Photo{" "}
          </button>{" "}
          <button className="startbutton" onClick={stopWebcam}>
            Stop Camera{" "}
          </button>{" "}
          <button className="startbutton" onClick={uploadPhoto}>
            Upload Photo{" "}
          </button>{" "}
        </div>{" "}
        <button className="spotify" onClick={handleLoginClick}>
          <svg
            viewBox="0 0 48 48"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            fill="#000000"
          >
            <g
              id="Icons"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                id="Color-"
                transform="translate(-200.000000, -460.000000)"
                fill="#ffffff"
              >
                <path
                  d="M238.16,481.36 C230.48,476.8 217.64,476.32 210.32,478.6 C209.12,478.96 207.92,478.24 207.56,477.16 C207.2,475.96 207.92,474.76 209,474.4 C217.52,471.88 231.56,472.36 240.44,477.64 C241.52,478.24 241.88,479.68 241.28,480.76 C240.68,481.6 239.24,481.96 238.16,481.36 M237.92,488.08 C237.32,488.92 236.24,489.28 235.4,488.68 C228.92,484.72 219.08,483.52 211.52,485.92 C210.56,486.16 209.48,485.68 209.24,484.72 C209,483.76 209.48,482.68 210.44,482.44 C219.2,479.8 230,481.12 237.44,485.68 C238.16,486.04 238.52,487.24 237.92,488.08 M235.04,494.68 C234.56,495.4 233.72,495.64 233,495.16 C227.36,491.68 220.28,490.96 211.88,492.88 C211.04,493.12 210.32,492.52 210.08,491.8 C209.84,490.96 210.44,490.24 211.16,490 C220.28,487.96 228.2,488.8 234.44,492.64 C235.28,493 235.4,493.96 235.04,494.68 M224,460 C210.8,460 200,470.8 200,484 C200,497.2 210.8,508 224,508 C237.2,508 248,497.2 248,484 C248,470.8 237.32,460 224,460"
                  id="Spotify"
                ></path>{" "}
              </g>{" "}
            </g>{" "}
          </svg>
          Continue with Spotify{" "}
        </button>{" "}
      </div>{" "}
    </>
  );
};
export default Home;
