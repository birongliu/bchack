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
CORS(app, origins=["https://192.0.0.2:5173", "https://172.20.10.8:5173", "https://146.245.225.40:5173", "https://192.168.1.158:5173"])


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
        month = request.args.get("month")
        if month is None:
            return jsonify({"error": "Month not provided"}), 400
        
        # Get monthly budget from database
        budget = db.database.get_collection("monthly_budget").find_one({"user_id": user_id, "month": month})
        if budget is None:
            return jsonify({"error": "Budget not found"}), 404
        budget["_id"] = str(budget["_id"])

        return jsonify({"result": budget}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/<user_id>/monthly-budget", methods=["POST"])
def set_monthly_budget(user_id):
    try:
        data = request.get_json()
        data["user_id"] = user_id
        if "month" not in data:
            return jsonify({"error": "Month not provided"}), 400
        # Insert monthly budget into database
        if "budget" not in data:
            return jsonify({"error": "Budget not provided"}), 400
        
        db.database.get_collection("monthly_budget").insert_one(data)
        data["_id"] = str(data["_id"])
        return jsonify({"result": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/<user_id>/expense-categories", methods=["GET"])
def get_expense_categories(user_id):
   res = db.database.get_collection("receipts").aggregate([
        { "$match": { "user_id": (user_id) } },
        { "$group": { "_id": "$category", "total_spent": { "$sum": "$total" } } }
    ])
   categories = {
        item["_id"]: float(item["total_spent"])
        for item in res.to_list()
    }

   return jsonify({"result": categories}), 200

@app.route("/api/<user_id>/daily-expenses", methods=["GET"])
def get_daily_expenses(user_id):
    startDate = request.args.get("startDate")
    endDate = request.args.get("endDate")
    if startDate is None:
        return jsonify({"error": "Date not provided"}), 400
    
    if endDate is None:
        return jsonify({"error": "endDate not provided"}), 400
    
    res = db.database.get_collection("receipts").aggregate([
        {
            "$match": {"user_id": user_id, "date": { "$gte": startDate, "$lte": endDate } }
        },
        {
            "$group": {
                "_id": "$date",
                "total_spent": {"$sum": "$total"}
            }
        },
        {
            "$sort": { "_id": 1 }
        }
    ])
    
    categories = {
        item["_id"]: float(item["total_spent"])
        for item in res.to_list()
    }

    return jsonify({"result": categories}), 200


@app.route("/api/summary", methods=["POST"])
def get_summary():
    data = request.get_json()
    if "user_id" not in data:
        return jsonify({"error": "User ID not provided"}), 400
    user_id = data["user_id"]
    summary = generate_summary(user_id, db)
    return jsonify({"result": summary}), 200


if __name__ == '__main__':
        app.run(port=5000, host="0.0.0.0", debug=True, ssl_context=('./ssl-certficates/localhost.pem', './ssl-certficates/localhost-key.pem'))