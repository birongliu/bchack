## Inspiration  
Managing finances effectively can be a challenge, especially with unpredictable spending habits and lack of real-time insights. We wanted to create an AI-powered tool that simplifies budget tracking, provides smart recommendations, and enhances financial awareness. **Spendly** was born to help users take control of their spending in a seamless and interactive way.

## What it does  
Spendly is an **AI-powered smart spending tracker** that allows users to:  
- **Set a Budget:** Users create an account and set their monthly budget. (e.g., $1000/month)  
- **Log Expenses:**  
  - **Receipt Scanning:** Scan receipts using **OpenAI Vision**, and an **LLM extracts and categorizes** expense details.  
  - **Voice Entry:** (Future Feature) Use **Whisper Speech-to-Text** to record expenses verbally. Users can edit and submit transactions.  
- **Dashboard Insights:**  
  - A **circular chart** displays budget usage.  
  - **Expense categories** (e.g., Food: $123, Transport: $50) are highlighted.  
  - AI-powered **Q&A chatbot** provides personalized budgeting insights, trend analysis, and financial tips.  

## How we built it  
- **Account & Budget Setup:** Users set their monthly budget.  
- **Expense Logging:**  
  - **Computer Vision (OpenAI Vision API)** for receipt scanning and automatic categorization.  
  - **Whisper API** (planned) for speech-based expense entry.  
- **Dashboard & Insights:**  
  - Built using **Chart.js** and **react-chartjs-2** for interactive spending visualizations.  
  - AI chatbot analyzes trends and provides **personalized financial advice**.  
- **Tech Stack:**  
  - **Frontend:** React, Typescript 
  - **Backend:** Python, Flask  
  - **APIs:** OpenAI Vision API, Whisper API. 

## Challenges we ran into  
- **Accurate expense categorization:** Fine-tuning the LLM to correctly categorize expenses based on receipt text was complex.  
- **Real-time data visualization:** Implementing a responsive dashboard with **Chart.js** required careful data structuring.  
- **Speech-to-text processing:** Whisper’s integration faced initial issues in handling different accents and noisy backgrounds.  
- **Optimizing chatbot responses:** Ensuring AI suggestions were truly **helpful and personalized** for each user.  

## Accomplishments that we're proud of  
- Successfully built an **AI-powered expense tracker** with real-time categorization.  
- Designed an **intuitive dashboard** that makes budget tracking **effortless**.  
- Integrated **OpenAI Vision** to automate receipt scanning with high accuracy.  
- Developed an **AI chatbot** that provides smart financial insights.  
