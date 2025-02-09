import os
from groq import Groq
from sentence_transformers import SentenceTransformer
import numpy as np
import json
from supabase import create_client, Client

SUPABASE_URL = "https://tfmbjbskzindivtnxtrf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbWJqYnNremluZGl2dG54dHJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTA0NzgyOCwiZXhwIjoyMDU0NjIzODI4fQ.kmTKVQj8HomFUP5stjGlsPPHNGlcZMuNNB6mvvq5JbA"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

groq_client = Groq(api_key="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")

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
predefined_intents = [
    "Should I diversify my portfolio?",
    "Is my portfolio suited for long-term?",
    "Which stocks should I add more to given the current trend?",
    "what are some factors I should look out for while investing a stock",
    "how to identify stocks for investing",
    "Should I sell any of the stocks in my portfolio",
    "Classify my portfolio into smallcap, midcap and largecap stocks",
]
intent_embeddings = [embedding_model.encode(q) for q in predefined_intents]

# ✅ Fix: Ensure function uses `predefined_intents`
def find_most_similar_question(user_query: str, threshold=0.7):
    """Finds the predefined question closest to the user's query using similarity matching."""
    user_embedding = embedding_model.encode(user_query)

    similarities = [
        np.dot(user_embedding, q_emb) / (np.linalg.norm(user_embedding) * np.linalg.norm(q_emb))
        for q_emb in intent_embeddings
    ]

    best_match_idx = np.argmax(similarities)
    best_score = similarities[best_match_idx]

    return predefined_intents[best_match_idx] if best_score >= threshold else None

def generate_financial_advice(user_id: str, user_question: str):
    """Fetches portfolio data and generates AI-based financial advice via Groq API."""

    # 1️⃣ Match User Query to a Predefined Question
    matched_question = find_most_similar_question(user_question)
    if not matched_question:
        return {"response": "I'm not sure how to answer that. Can you rephrase?"}

    # 2️⃣ Fetch Portfolio Data from Supabase
    response = supabase.from_("portfolio").select("*").eq("user_id", user_id).single().execute()
    if response.data is None:
        raise HTTPException(status_code=404, detail="No portfolio data found for this user.")

    portfolio_data = response.data
    portfolio_string = json.dumps(portfolio_data, indent=4)
    print(type(portfolio_string))
    # 3️⃣ Generate AI Response Using Groq API
    prompt = f"""
    You are an advanced financial advisor. The user's portfolio details are:
    {portfolio_string}. The user asked: "{matched_question}". Provide a clear, insightful, and actionable response.
    """

    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )
    print(chat_completion.choices[0].message.content)
    return {"response": chat_completion.choices[0].message.content}
@app.post("/advice/{user_id}")
def get_financial_advice(user_id: str, query: dict):
    user_question = query.get("question")

    if not user_question:
        raise HTTPException(status_code=400, detail="Question not provided.")

    return generate_financial_advice(user_id, user_question)

generate_financial_advice(user_id="73261abe-21e4-4969-9bc1-e270fb1feabb", user_question="Should I diversify my portfolio")

    
