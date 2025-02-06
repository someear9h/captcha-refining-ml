from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load the trained model and scaler
model = joblib.load('models/best_model.pkl')  # Load ML model
scaler = joblib.load('models/scaler.pkl')  # Load the saved scaler

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        time_taken = data['time_taken']
        typing_speed = data['typing_speed']
        mouse_movement = data['mouse_movement']
        delay = data['delay']

        # Convert to DataFrame
        features = pd.DataFrame([[time_taken, typing_speed, mouse_movement, delay]],
                                columns=['Time_Taken', 'Typing_Speed', 'Mouse_Movement', 'Delay'])

        # Scale the input before prediction
        features_scaled = scaler.transform(features)

        # Predict using the trained model
        prediction = model.predict(features_scaled)

        # Determine the result
        status = 'human' if prediction[0] == 0 else 'bot'

        return jsonify({
            'prediction': status,
            'features': {
                'time_taken': time_taken,
                'typing_speed': typing_speed,
                'mouse_movement': mouse_movement,
                'delay': delay
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
