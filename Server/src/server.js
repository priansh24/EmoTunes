const express = require("express");
const dotenv = require("dotenv");
// const fetch = require("node-fetch");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const PORT = 8000; // Change the port to 8000

app.use(cookieParser());

// Spotify API credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri =
  process.env.SPOTIFY_REDIRECT_URI ||
  `http://localhost:${PORT}/spotify/callback`; // Adjust the Redirect URI

// Store tokens globally (for demonstration purposes, you may want to use a database or secure storage in a production environment)
let accessToken = null;
let refreshToken = null;

// Authorization endpoint
app.get("/login", (req, res) => {
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: "code",
      client_id: clientId,
      scope: "user-read-private",
      redirect_uri: redirectUri,
    })}`
  );
});

// Callback endpoint to handle the response after user authorization
app.get("/spotify/callback", async (req, res) => {
  const { code } = req.query;
  //   console.log("CODE:", code);

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

  //   console.log("Access token: " + accessToken);
  //   console.log("Refresh token: " + refreshToken);

  // Set cookies or store tokens securely in a production environment
  res.cookie("access_token", accessToken);
  res.cookie("refresh_token", refreshToken);

  res.send(
    "Authorization successful! Tokens stored. You can now use /create-playlist endpoint to create a playlist."
  );
});

// Endpoint to demonstrate creating a playlist using the stored tokens
app.get("/create-playlist", async (req, res) => {
  // Check if the access token is available
  if (!accessToken) {
    // If refresh token is available, attempt to refresh the access token
    if (refreshToken) {
      try {
        await refreshAccessToken();
        // Retry creating the playlist after token refresh
        return createPlaylist(res);
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

  // Access token is available, proceed to create the playlist
  return createPlaylist(res);
});

// Endpoint to refresh the access token using the refresh token
app.get("/refresh-token", async (req, res) => {
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token not available." });
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

  // Update the access token in cookies or secure storage
  res.cookie("access_token", accessToken);

  res.json({ message: "Token refreshed successfully!", accessToken });
});

// Function to create a playlist using the stored access token
async function createPlaylist(res) {
  // Example: create a playlist
  const playlistResponse = await fetch(
    "https://api.spotify.com/v1/me/playlists",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: "Test1 Mehfil Coders",
        description: "Created via Spotify API and Node.js backend!",
        public: false,
      }),
    }
  );

  const playlistData = await playlistResponse.json();

  // Handle the playlist creation response
  console.log("Playlist created:", playlistData);

  res.json({ message: "Playlist created successfully!", playlistData });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
