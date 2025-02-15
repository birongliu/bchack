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
                {"type": "text", "text": f"Identify the from receipt."},
                {"type": "image_url", "image_url": {"url": image_url}}
            ]}]
    
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        temperature=0,
        response_format=Receipt,
        messages=messages,
    )
    print(response.choices[0].message.parsed.model_dump_json())

    db.database.get_collection("receipts").insert_one({**response.choices[0].message.parsed.model_dump(), "user_id": "eb1a72ae-21bd-42e8-b10d-6b113c97f462"})
    
    return response.choices[0].message.parsed.model_dump_json()

def generate_summary(receipt: Receipt) -> dict:
    """
    Generate a summary of the receipt including total spent, item categories,
    and spending insights.
    
    Args:
        receipt (Receipt): Receipt object containing transaction details
    
    Returns:
        dict: Summary of the receipt including total, categories, and insights
    """
    try:
        # Calculate basic statistics
        total_spent = receipt.total if receipt.total else sum(item.price for item in receipt.items)
        num_items = len(receipt.items) if receipt.items else 0
        avg_price = total_spent / num_items if num_items > 0 else 0

        # Generate summary using GPT
        prompt = f"""
        Analyze this receipt and provide insights:
        Store: {receipt.store_name}
        Date: {receipt.date}
        Total: ${total_spent:.2f}
        Number of items: {num_items}
        Average price per item: ${avg_price:.2f}
        
        Items:
        {chr(10).join([f"- {item.name}: ${item.price:.2f}" for item in receipt.items]) if receipt.items else "No items"}
        """

        response = groq.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Generate a concise summary of this receipt with spending insights."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
        )

        summary = {
            "statistics": {
                "total_spent": total_spent,
                "num_items": num_items,
                "avg_price": avg_price
            },
            "store": receipt.store_name,
            "date": receipt.date,
            "category": receipt.category,
            "insights": response.choices[0].message.content
        }

        return summary

    except Exception as e:
        print(f"Error generating summary: {e}")
        return {
            "error": str(e),
            "statistics": {
                "total_spent": 0,
                "num_items": 0,
                "avg_price": 0
            }
        }

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