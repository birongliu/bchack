from dotenv import load_dotenv
from flask import Flask, request, jsonify
from ai import get_transaction, infer_image, generate_summary
from database import AtlasClient
from flask_cors import CORS
import os
import uuid
load_dotenv()

db = AtlasClient(altas_uri=os.getenv('MOGO_URL'), dbname="bchack")

app = Flask(__name__)
CORS(app, origins=["https://172.20.10.8:5173", "https://146.245.225.40:5173"])


import os
from werkzeug.utils import secure_filename

@app.route('/image-to-text', methods=['POST'])
def image_to_text():
    data = request.get_json()
    # Call your model her
    if 'image' not in data:
        return jsonify({'error': 'no image found'})
    infer = infer_image(image_url=data['image'], db=db)
    return jsonify({'result': infer }), 200

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
        print("Files in request:", request.files)
        
        if 'audio' not in request.files:
            print("No audio file in request.files")
            return jsonify({'error': 'No audio file received'}), 400
            
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
            
        # Create temp directory if it doesn't exist
        temp_dir = os.path.join(os.getcwd(), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save file temporarily
        temp_path = os.path.join(temp_dir, secure_filename(audio_file.filename))
        audio_file.save(temp_path)
        print(f"Audio saved to: {temp_path}")
        
        transaction = get_transaction(audio=audio_file)

        if not transaction:
            return jsonify({'error': 'Error in get_transaction'}), 500
        print("Transaction:", transaction)
        return jsonify({'result': transaction}), 200



@app.route("/api/<user_id>/monthly-budget", methods=["GET"])
def get_monthly_budget(user_id):
    try:
        # Get monthly budget from database
        budget = db.find("budgets", filter={"user_id": user_id})
        if not budget:
            return jsonify({"error": "Budget not found"}), 404
        return jsonify({"result": budget[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/<user_id>/expense-categories", methods=["GET"])
def get_expense_categories(user_id):
    try:
        # Get expense categories from database
        categories = db.find("categories", filter={"user_id": user_id})
        if not categories:
            return jsonify({"error": "Categories not found"}), 404
        return jsonify({"result": categories}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/<user_id>/daily-expenses", methods=["GET"])
def get_daily_expenses(user_id):
    try:
        # Get daily expenses from database
        expenses = db.find("expenses", filter={"user_id": user_id})
        if not expenses:
            return jsonify({"error": "Expenses not found"}), 404
        return jsonify({"result": expenses}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
        app.run(port=5000, host="0.0.0.0", debug=True, ssl_context=('./ssl-certficates/localhost.pem', './ssl-certficates/localhost-key.pem'))