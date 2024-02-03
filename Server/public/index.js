async function createPlaylist() {
  const userId = document.getElementById("userId").value;
  const playlistName = document.getElementById("playlistName").value;
  const trackNames = document
    .getElementById("trackNames")
    .value.split(",")
    .map((track) => track.trim());

  const response = await fetch("http://localhost:8000/createPlaylist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, playlistName, trackNames }),
  });

  const resultContainer = document.getElementById("result");

  if (response.ok) {
    const data = await response.json();
    resultContainer.textContent = data.message;
  } else {
    resultContainer.textContent = "Error creating playlist.";
  }
}

function requestWebcamPermission() {
  const webcamContainer = document.getElementById("webcam-container");
  const webcamVideo = document.getElementById("webcam-video");

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      // Display the webcam feed in the video element
      webcamVideo.srcObject = stream;

      // Set a timeout to stop the webcam after 10 seconds
      setTimeout(() => {
        stopWebcam(stream);
      }, 10000);
    })
    .catch((error) => {
      console.error("Webcam access denied:", error);
    });
}

function stopWebcam(stream) {
  const webcamVideo = document.getElementById("webcam-video");

  // Stop the webcam stream
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  // Clear the video source
  webcamVideo.srcObject = null;
}
