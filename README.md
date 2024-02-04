# EmoTunes 
This repository contains the code of our project EmoTunes that uses facial emotion recognition to curate a playlist of songs on Spotify that align with your emotions.

The dataset used for the music recommendation is 'SpotifySongs.csv', which contains numerous audio features of Spotify songs.
We have used unsupervised learning to create a machine learning model where similar songs are grouped together on the basis of their audio features.
## Pre-processing
1. The csv dataset is loaded into a Pandas DataFrame.
2. Columns 'Duration_ms' and 'Popularity' are dropped as they are not used for similarity calculations.
3. Rows with missing values are dropped.
4. Duplicates rows are removed from the dataset.
5. Min-max scaling is applied to scale the numeric features between 0 and 1.
6. Non-numeric columns (SongName and ArtistName) are concatenated with the scaled numeric columns to form a new DataFrame.
   
## Finding Similar Songs
1. Audio features for happy, sad, angry, and neutral songs are defined.
2. The input features are scaled using the MinMaxScaler.
3. Cosine similarity is calculated between the input audio features and all songs in the dataset.
4. The top 50 similar songs are extracted based on cosine similarity.
5. A playlist containing these 50 curated songs based on their facial emotion would be created in the user's Spotify account.

## Front End the Website
1. developed using react js and CSS
2. The frontend act as a medium between user and server.
3.  Front End offers two nav links namely EmoFind and About.
4.  Emofind is a section where your face emotions are captured using your device's camera and a playlist is made in Spotify according to your mood
5.  About us sections have information of Team memebers.
