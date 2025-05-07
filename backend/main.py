import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi import Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from groq import Groq
from sentence_transformers import SentenceTransformer
import numpy as np
import json
from supabase import create_client, Client
from spark_session import PortfolioDataProcessor
import asyncio
from influxdb_client import InfluxDBClient
from influxdb_client.client.query_api import QueryApi


SUPABASE_URL = "https://tfmbjbskzindivtnxtrf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbWJqYnNremluZGl2dG54dHJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTA0NzgyOCwiZXhwIjoyMDU0NjIzODI4fQ.kmTKVQj8HomFUP5stjGlsPPHNGlcZMuNNB6mvvq5JbA"

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
    quantity: float
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

# Update the Groq client initialization with proper headers
groq_client = Groq(
    api_key="<>",
)
processor = PortfolioDataProcessor()
def generate_financial_advice(user_id: str, user_question: str):
    """Enhanced RAG implementation using Spark analytics and portfolio data."""

    # 2. Fetch Portfolio and Trade Data
    portfolio = supabase.from_("portfolio").select("*").eq("user_id", user_id).single().execute()
    trades = supabase.from_("trades").select("*").eq("user_id", user_id).execute()

    if portfolio.data is None:
        raise HTTPException(status_code=404, detail="No portfolio data found for this user.")

    # 3. Process Data using Spark
    try:
        analytics = processor.process_portfolio_data(portfolio.data, trades.data)
        
        system_prompt = """
            You are a helpful AI assistant integrated into InvestiVerse. Format your reply in HTML
            (<p>, <ul>, <li>, <strong>, etc.), keep a friendly, educational tone, and reference 
            the user's real portfolio metrics.
                """.strip()

        # 4. Create Enhanced Context with Analytics
        context = {
            "overview": {
                "current_value": portfolio.data.get("current_value", 0),
                "invested_value": portfolio.data.get("invested_value", 0)
            },
            "stock_metrics":           analytics["stock_metrics"],
            "trading_patterns":        analytics["trading_patterns"],
            "portfolio_concentration": analytics["portfolio_concentration"],
            "performance":             analytics["performance"],
        }

        user_message = (
            f"User Question: {user_question}\n\n"
            f"Data Context:\n{json.dumps(context, indent=2)}"
        )


        # 5. Generate AI Response Using Groq
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        return {"response": completion.choices[0].message.content}

    except Exception as e:
        print(f"Error in generate_financial_advice: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating financial advice")

# Update the endpoint to use the enhanced RAG
@app.post("/advice/{user_id}")
async def get_financial_advice(user_id: str, query: dict):
    user_question = query.get("question")
    if not user_question:
        raise HTTPException(status_code=400, detail="Question not provided.")
    # offload the blocking “generate” function
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None,
        generate_financial_advice,
        user_id,
        user_question
    )

@app.get("/")
def read_root():
    return {"message": "FastAPI is running on Railway!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

@app.get("/api/leaderboard")
def get_leaderboard():
    response = supabase.table("leaderboard").select("*").order("rank", desc=False).limit(50).execute()
    return response.data

INFLUX_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "JXFFBPt8sKohODcwH0gx6iL0nxo0B6uoEfOf1hj49YbnSfuajSUpiuAjjEJ1biPircRiZnZZblqs1Eg9hJyCKg=="
INFLUXDB_ORG = "interverse"
BUCKET = "stocks"

influx_client = InfluxDBClient(url=INFLUX_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
query_api: QueryApi = influx_client.query_api()

# -------------------------------
# GET /api/stock-history
# -------------------------------
@app.get("/api/stock-history")
async def stock_history(symbol: str = Query(...), range_key: str = Query("20m")):
    range_map = {
        "1s": "-10s", "1m": "-5m", "1h": "-1h", "1week": "-7d"
    }
    window_map = {
        "1s": "1s", "1m": "10s", "1h": "1m", "1week": "5m"
    }

    flux_query = f'''
      from(bucket: "{BUCKET}")
        |> range(start: {range_map.get(range_key, '-20m')})
        |> filter(fn: (r) => r._measurement == "stock_price")
        |> filter(fn: (r) => r._field == "price")
        |> filter(fn: (r) => r.symbol == "{symbol}")
        |> aggregateWindow(every: {window_map.get(range_key, '10s')}, fn: mean, createEmpty: true)
        |> yield(name: "mean")
    '''

    try:
        tables = query_api.query(flux_query)
        results = []
        for table in tables:
            for record in table.records:
                results.append({
                    "date": record.get_time().isoformat(),
                    "value": record.get_value(),
                    "symbol": record.values.get("symbol")
                })
        return results
    except Exception as e:
        print("******* InfluxDB query failed: *******", e)
        raise HTTPException(status_code=500, detail="InfluxDB query failed")

# test_user = UserSignup(email="anitej5@gmail.com", password="SecurePass123!")
# test_trade = Trade(user_id="73261abe-21e4-4969-9bc1-e270fb1feabb", stock_name="AAPL", trade_type="BUY", quantity=5, price=50.0)
# record_trade(test_trade)
# signup(test_user)
# get_portfolio(user_id="73261abe-21e4-4969-9bc1-e270fb1feabb")