// WebcamComponent.js
import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const WebcamComponent = () => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // You can use imageSrc for further processing or display.
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
      <button onClick={capture}>Capture Photo</button>
    </div>
  );
};

export default WebcamComponent;
