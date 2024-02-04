# from flask import Flask, request, jsonify
# import cv2
# from deepface import DeepFace
# import numpy as np
# from flask_cors import CORS  # Import the CORS extension


# app = Flask(__name__)
# CORS(app)

# @app.route('/upload_photo', methods=['POST'])
# def predict_emotion():
#     print("Inside Predict Emotion")
#     try:
#         # print("hi ", request.files)
#         # Check if the POST request has the file part
#         # if 'image' not in request.files['photo']:
#         #     print("No Image File Found!")
#         #     return jsonify({'error': 'No image file in the request'}), 400

#         # Get the image file from the request
#         file = request.files["photo"]
#         print(file)

#         # Read the image from the file
#         img_stream = file.read()
#         img_array = bytearray(img_stream)
#         np_img = np.asarray(img_array, dtype=np.uint8)
#         frame = cv2.imdecode(np_img, 1)

#         faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

#         faces = faceCascade.detectMultiScale(gray,1.1,4)
        
#         # for x,y,w,h in faces:
#         #     roi_gray = gray[y:y+h, x:x+w]
#         #     roi_color = frame[y:y+h, x:x+w]
#         #     cv2. rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
#         #     facess = faceCascade.detectMultiScale(roi_gray)
#         #     if len(facess) == 0:
#         #         print("Face not detected")
#         #     else:
#         #         for (ex,ey,ew,eh) in facess:
#         #             face_roi = roi_color[ey: ey+eh, ex:ex + ew]

#         result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
#         emotion = result[0]['dominant_emotion']

#         return jsonify({'emotion': emotion})

#     except Exception as e:
#         return jsonify({'error': str(e)})

# if __name__ == '__main__':
#     app.run(debug=True)




from flask import Flask, jsonify, request
import cv2
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from deepface import DeepFace
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload_photo', methods=['POST'])

def get_songs():
    try:
        # Receive image from the request
        print("Checking", request.files)
        file = request.files["photo"]
        img_stream = file.read()
        img_array = bytearray(img_stream)
        np_img = np.asarray(img_array, dtype=np.uint8)
        frame = cv2.imdecode(np_img, 1)

        faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        # Load song data
        df = pd.read_csv('/SpotifySongs.csv')
        df.drop(columns=['Duration_ms', 'Popularity'], inplace=True)
        df.isnull().sum()
        df.dropna(inplace=True)
        df = df.drop_duplicates()

        # Scale song features
        scaler = MinMaxScaler()
        df_scaled = scaler.fit_transform(df.iloc[:, 2:])
        df_scaled = pd.DataFrame(df_scaled, columns=df.columns[2:])
        df_scaled = pd.concat([df.iloc[:, :2], df_scaled], axis=1)
        df_scaled = df_scaled.drop_duplicates()
        df_scaled.dropna(inplace=True)

        # Define song features for each emotion
        happy_song_features = [[0.8, 0.7, 0.0, 0.7, 0.0, 0.5, 0.1, 0.1, 0.2, 0.5, 120]]
        sad_song_features = [[0.4, 0.4, 0.5, 0.4, 0.5, 0.3, 0.05, 0.05, 0.05, 0.3, 100]]
        angry_song_features = [[0.5, 0.9, 0.0, 0.8, 0.5, 0.5, 0.15, 0.35, 0.15, 0.4, 140]]
        neutral_song_features = [[0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.1, 0.1, 0.1, 0.5, 110]]

        # Transform features based on detected emotion
        if emotion == 'happy':
            x = scaler.transform(happy_song_features)
        elif emotion == 'sad':
            x = scaler.transform(sad_song_features)
        elif emotion == 'angry':
            x = scaler.transform(angry_song_features)
        else:
            x = scaler.transform(neutral_song_features)

        cosine_similarities = cosine_similarity(x, df_scaled.drop(columns=['SongName', 'ArtistName']))
        similar_song_indices = cosine_similarities.argsort()[0][::-1]

        # Get top 50 similar songs
        similar_songs = df_scaled.iloc[similar_song_indices[:50]]['SongName'].tolist()

        return jsonify({'emotion': emotion, 'similar_songs': similar_songs})

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
