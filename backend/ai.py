from openai import OpenAI
import os
from groq import Groq
from dotenv import load_dotenv
from typing import Literal
from werkzeug.datastructures import FileStorage
from pydantic import BaseModel
from database import AtlasClient

load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

class Item(BaseModel):
    name: str
    price: float

    def __str__(self):
        return f"Name: {self.name}\nPrice: {self.price}"
    

class Receipt(BaseModel):
    store_name: str = None
    date: str = None
    category: Literal["Food & Dining", "Transportation", "Entertainment", "Groceries", "Utilities Bills", "Others"] = None
    total: float = None
    items: list[Item] = None

    def __str__(self):
        return f"Store: {self.store_name}\nCategory: {self.category}\nDate: {self.date}\nTotal: {self.total}\nItems: {self.items}"
default_receipt = Receipt()

def infer_image(image_url: str, db: AtlasClient) -> str:
# Function to encode the image
    messages=[{"role": "system", "content": f"You are an advanced Computer Vision model. Scan and analyze the provided receipt. Use the following image as a references and Extract and organize the users recipent details"}, 
            { "role": "user", "content": [{ "type": "text", "text": "please use the image as reference when scanning users receipts"}, { "type": "text", "text": f'{default_receipt.model_dump_json()}'}] },
            {"role": "user", "content": [
                {"type": "text", "text": f"Identify the from receipt. The date should be formatted as MM/DD/YYYY"},
                {"type": "image_url", "image_url": {"url": image_url}}
            ]}]
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        temperature=0,
        response_format=Receipt,
        messages=messages,
    )    

    db.database.get_collection("receipts").insert_one({**response.choices[0].message.parsed.model_dump(), "user_id": "eb1a72ae-21bd-42e8-b10d-6b113c97f462"})
    budget = db.database.get_collection("monthly_budget").find_one({"user_id": "eb1a72ae-21bd-42e8-b10d-6b113c97f462", "month": "2025-02"})
    # update the budget with the total spent
    db.database.get_collection("monthly_budget").update_one({"_id": budget["_id"]}, {"$set": {"total_spent": budget["total_spent"] + response.choices[0].message.parsed.total}})
    return response.choices[0].message.parsed.model_dump_json()

def generate_summary(user_id: str, db: AtlasClient) -> str:
    res = db.database.get_collection("receipts").aggregate([
        { "$match": { "user_id": (user_id) } },
        { "$group": { "_id": "$category", "total_spent": { "$sum": "$total" } } }
    ])
    categories = {
        item["_id"]: float(item["total_spent"])
        for item in res.to_list()
    }

    prompt = f"""
        Analyze these expense categories and provide insights:
        
        Categories: {categories}
        
        """
          
    response = groq.chat.completions.create(
        model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "Generate a concise analysis of spending patterns across categories."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
        temperature=0
    )
    return response.choices[0].message.content
       

def get_transaction(audio: FileStorage):
    try:
        transaction = groq.audio.transcriptions.create(
            file=(audio.filename, audio),
                model="whisper-large-v3-turbo",
                prompt="Transcribe the audio and extract the transaction details.",
                temperature=0,
            )        
        
        return transaction.text
    except Exception as e:
        print("Error in get_transaction:", e)
        return None