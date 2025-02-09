import os
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from groq import Groq
from sentence_transformers import SentenceTransformer
import numpy as np
import json
from supabase import create_client, Client

SUPABASE_URL = "https://tfmbjbskzindivtnxtrf.supabase.co"
SUPABASE_KEY = "<>"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (Change this for security in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allows all headers
)

class UserSignup(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class PortfolioUpdate(BaseModel):
    stock_name: str
    quantity: int
    price: float

class Trade(BaseModel):
    user_id: str
    stock_name: str
    trade_type: str  # "BUY" or "SELL"
    quantity: int
    price: float

@app.post("/signup")
def signup(user: UserSignup):
    auth_response = supabase.auth.sign_up({
        "email": user.email,
        "password": user.password
    })
    
    # Convert the Pydantic model to a dictionary for easier inspection.
    auth_response_dict = auth_response.dict()

    # Check if there was an error in the auth response.
    if auth_response_dict.get("error"):
        raise HTTPException(
            status_code=400,
            detail=auth_response_dict["error"]["message"]
        )
    
    # Retrieve the user data directly from the auth response.
    user_data = auth_response_dict.get("user")
    session_data = auth_response_dict.get("session")
    if not user_data:
        raise HTTPException(status_code=400, detail="No user data returned")
    
    user_id = user_data.get("id")
    
    # Insert the user into your own "users" table.
    response = supabase.from_("users").insert({
        "user_id": user_id,
        "email": user.email
    }).execute()
    
    # Convert the response to a dictionary if it’s a Pydantic model.
    response_dict = response.dict() if hasattr(response, "dict") else response
    if response_dict.get("error"):
        raise HTTPException(
            status_code=400,
            detail="Error inserting user into database"
        )
    access_token = None
    if session_data:
        access_token = session_data.get("access_token")

    print(f"User signed up successfully! user_id: {user_id}")
    return {"message": "User signed up successfully!", "user_id": user_id, "email": user.email, "access_token": access_token}

@app.post("/login")
def login(user: UserSignup):
    auth_response = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})
    auth_response_dict = auth_response.dict()

    # Check if there was an error in the auth response.
    if auth_response_dict.get("error"):
        raise HTTPException(
            status_code=400,
            detail=auth_response_dict["error"]["message"]
        )
    
    # Retrieve the user data directly from the auth response.
    user_data = auth_response_dict.get("user")
    session_data = auth_response_dict.get("session")
    user_id = user_data.get("id")
    if not user_data:
        raise HTTPException(status_code=400, detail="No user data returned")
    
    user_id = user_data.get("id")
    access_token = None
    if session_data:
        access_token = session_data.get("access_token")
    print(f"Login success: {user_id}")
    return {"message": "Login successful!", "user_id": user_id, "email": user.email, "access_token": access_token}

@app.post("/trades/add")
def record_trade(trade: Trade):
    if trade.trade_type not in ["BUY", "SELL"]:
        raise HTTPException(status_code=400, detail="Trade type must be 'BUY' or 'SELL'")

    # Insert trade into `trades` table
    response = supabase.from_("trades").insert({
        "user_id": trade.user_id,
        "stock_name": trade.stock_name,
        "trade_type": trade.trade_type,
        "quantity": trade.quantity,
        "price": trade.price,
    }).execute()

    # ✅ Correct way to check for errors
    if response.data is None or "error" in response:
        error_message = response.get("error", {}).get("message", "Unknown error occurred")
        raise HTTPException(status_code=400, detail=f"Error recording trade: {error_message}")

    # Update user's portfolio after the trade
    update_portfolio(trade)

    return {"message": "Trade recorded and portfolio updated!"}

def update_portfolio(trade: Trade):
    # Attempt to fetch the existing portfolio.
    response = supabase.from_("portfolio") \
        .select("*") \
        .eq("user_id", trade.user_id) \
        .maybe_single() \
        .execute()

    # If response is None or contains no data, create a new portfolio.
    if response is None or response.data is None:
        new_portfolio = {
            "user_id": trade.user_id,
            "invested_value": 0,
            "current_value": 0,
            "stocks": {}  # Assuming the column supports JSON/dict storage.
        }
        insert_response = supabase.from_("portfolio").insert(new_portfolio).execute()
        if insert_response is None or insert_response.data is None:
            raise HTTPException(status_code=400, detail="Error creating portfolio.")

        # Re-fetch the newly created portfolio.
        response = supabase.from_("portfolio") \
            .select("*") \
            .eq("user_id", trade.user_id) \
            .maybe_single() \
            .execute()

    # Check again to ensure the portfolio data exists.
    if response is None or response.data is None:
        raise HTTPException(status_code=404, detail="Portfolio could not be created or fetched.")

    portfolio = response.data
    # Ensure that stocks is a dict. If it's None, default to an empty dict.
    stocks = portfolio.get("stocks") or {}
    invested_value = portfolio.get("invested_value", 0)

    # Update stock holdings based on the trade type.
    if trade.trade_type.upper() == "BUY":
        stocks[trade.stock_name] = stocks.get(trade.stock_name, 0) + trade.quantity
        invested_value += trade.quantity * trade.price
    elif trade.trade_type.upper() == "SELL":
        if trade.stock_name in stocks and stocks[trade.stock_name] >= trade.quantity:
            stocks[trade.stock_name] -= trade.quantity
            invested_value -= trade.quantity * trade.price
            # Remove the stock from holdings if quantity drops to zero.
            if stocks[trade.stock_name] == 0:
                del stocks[trade.stock_name]
        else:
            raise HTTPException(status_code=400, detail="Not enough stocks to sell")
    else:
        raise HTTPException(status_code=400, detail="Invalid trade type")

    # Update the portfolio in the database.
    update_response = supabase.from_("portfolio").update({
        "stocks": stocks,
        "invested_value": invested_value,
        "current_value": invested_value  # Assuming current value equals invested value.
    }).eq("user_id", trade.user_id).execute()

    if update_response is None or update_response.data is None:
        raise HTTPException(status_code=400, detail="Error updating portfolio.")

    return {"message": "Portfolio updated successfully!"}

@app.get("/portfolio/{user_id}")
def get_portfolio(user_id: str):
    # Fetch portfolio data for the given user_id
    response = supabase.from_("portfolio").select("*").eq("user_id", user_id).single().execute()

    # Check for errors or missing data
    if response.data is None:
        raise HTTPException(status_code=404, detail="Portfolio not found for this user")
    print(response.data)
    return response.data  # Return the fetched portfolio data

groq_client = Groq(api_key="<>")

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

@app.get("/")
def read_root():
    return {"message": "FastAPI is running on Railway!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)


# test_user = UserSignup(email="anitej5@gmail.com", password="SecurePass123!")
# test_trade = Trade(user_id="73261abe-21e4-4969-9bc1-e270fb1feabb", stock_name="AAPL", trade_type="BUY", quantity=5, price=50.0)
# record_trade(test_trade)
# signup(test_user)
# get_portfolio(user_id="73261abe-21e4-4969-9bc1-e270fb1feabb")