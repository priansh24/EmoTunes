# EmoTunes 
This repository contains the code of our project EmoTunes that uses facial emotion recognition to curate a playlist of songs on Spotify that align with your emotions.

## Development
1. Tech stack used in frontend is React.js while in the backend we have used Node.js and Flask.
2. Leveraged Spotify-API to curate playlists and add them to user's spotify accouint.
3. Integration of frontend, backend, and ML models.

## Flow of our web-app
1. After accesing our web-app, user is greeted with an elegant interface.
2. User can now access the webcam and click a beautiful picture of theirs (doing funny faces and emotions) and upload that picture.
3. The picture is then pushed into the first model - Facial Emotion Recognition which returns an emotion.
4. This emotion is fetched by the second model - Song recommendation model, which returns a list of 50 songs.
5. This list is then curated into a playlist using Spotify-API, which the user can add to their spotify account.

## ML Model - Facial Emotion Recognition
1. We have created two models - one using deepface and the other using tensorflow (MobileNetV2), with tensorflow model having an accuracy of 96%
2. There are 7 classes of emotions (Angry, Fear, Disgust, Happy, Neutral, Sad, Surprise), out of which we are using mainly 4 for playlist curation.
3. The dataset that we have used is the FER2013.
4. User's picture is analysed and emotion is predicted.

## ML Model - Song recommendation
1. The dataset used for the music recommendation is 'SpotifySongs.csv'.
2. Min-max scaling is applied to scale the numeric features between 0 and 1 and the input features are scaled using the MinMaxScaler.
3. Cosine similarity is used to find songs with high similarities based on the emotion returned by the Facial rec model.
4. A list containing these 50 songs based on the facial emotion would be returned and fetched using Flask.

### Dependencies
#### ML Model
pip install deepface cv2 os tensorflow pandas numpy sklearn
#### Development
cd client 
npm install
cd server 
npm install 
