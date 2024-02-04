const express = require("express");
const dotenv = require("dotenv");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const PORT = 8000;

app.use(cookieParser());

// Spotify API credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri =
  process.env.SPOTIFY_REDIRECT_URI || `http://localhost:${PORT}/callback`;

// Store tokens globally (for demonstration purposes, you may want to use a database or secure storage in a production environment)
let accessToken = null;
let refreshToken = null;

// Authorization endpoint
app.get("/login", (req, res) => {
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: "code",
      client_id: clientId,
      scope: "user-read-private playlist-modify-private",
      redirect_uri: redirectUri,
    })}`
  );
});

// Callback endpoint to handle the response after user authorization
app.get("/spotify/callback", async (req, res) => {
  const { code } = req.query;

  // Exchange the authorization code for an access token and refresh token
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenResponse.json();
  accessToken = tokenData.access_token;
  refreshToken = tokenData.refresh_token;

  // Set cookies or store tokens securely in a production environment
  res.cookie("access_token", accessToken);
  res.cookie("refresh_token", refreshToken);

  res.send(
    "Authorization successful! Tokens stored. Use /create-playlist?emotion=happy to create a playlist."
  );
});

// Endpoint to create a playlist based on the specified emotion
app.get("/create-playlist", async (req, res) => {
  const emotion = req.query.emotion;

  // Check if the access token is available
  if (!accessToken) {
    // If refresh token is available, attempt to refresh the access token
    if (refreshToken) {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Error refreshing access token:", error);
        return res
          .status(500)
          .json({ error: "Error refreshing access token." });
      }
    } else {
      // If neither access nor refresh token is available, redirect to the login endpoint
      return res.redirect("/login");
    }
  }

  try {
    // Get songs based on the detected emotion using the Spotify API
    const songs = await getSongsBasedOnEmotion(emotion);

    // Create a playlist on Spotify
    const playlistResponse = await createPlaylistOnSpotify(emotion);
    const playlistId = playlistResponse.id;

    // Add songs to the playlist
    await addSongsToPlaylist(playlistId, songs);

    res.json({ message: "Playlist created successfully!", playlistId });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Error creating playlist." });
  }
});

// Function to refresh the access token using the refresh token
async function refreshAccessToken() {
  if (!refreshToken) {
    throw new Error("Refresh token not available.");
  }

  // Exchange the refresh token for a new access token
  const refreshResponse = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    }
  );

  const refreshData = await refreshResponse.json();
  accessToken = refreshData.access_token;

  // Update the access token in cookies or secure storage if needed
  // res.cookie('access_token', accessToken);

  return accessToken;
}

// Function to get songs based on the detected emotion using the Spotify API
async function getSongsBasedOnEmotion(emotion) {
  // You would typically use the Spotify API to search for tracks based on the detected emotion
  // For simplicity, let's use some example track names and search for them

  const exampleTrackNames = {
    happy: ["Chiggy Wiggy", "Maharani", "Gulabo"],
    sad: ["Aadat", "Gul", "tum ho"],
  };

  const trackNames = exampleTrackNames[emotion] || [];

  // Search for the tracks on Spotify to obtain their IDs
  const trackIds = await Promise.all(
    trackNames.map(async (trackName) => {
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(
          trackName
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const searchData = await searchResponse.json();

      // Assume the first result is the desired track
      const firstTrack = searchData.tracks.items[0];
      return firstTrack ? firstTrack.id : null;
    })
  );

  // Filter out null values (tracks that were not found)
  return trackIds.filter((trackId) => trackId !== null);
}

// Function to create a playlist on Spotify
async function createPlaylistOnSpotify(emotion) {
  const playlistName = `Emotion Playlist - ${emotion}`;

  const createPlaylistResponse = await fetch(
    `https://api.spotify.com/v1/me/playlists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: playlistName,
        description: `Playlist created based on the emotion: ${emotion}`,
        public: false,
      }),
    }
  );

  return createPlaylistResponse.json();
}

// Function to add songs to a playlist on Spotify
async function addSongsToPlaylist(playlistId, songs) {
  if (songs.length === 0) {
    console.log("No songs to add to the playlist.");
    return;
  }

  const addSongsResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        uris: songs.map((songId) => `spotify:track:${songId}`),
      }),
    }
  );

  return addSongsResponse.json();
}

async function getSpotifyTrackIdsByEmotion(emotion) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${emotion}&type=track&limit=10`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("Response: " + response);

  const data = await response.json();
  console.log("DATA:", data);

  // Extract Spotify track IDs from the API response
  const trackIds = data.tracks.items.map((item) => item.id);

  return trackIds;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
