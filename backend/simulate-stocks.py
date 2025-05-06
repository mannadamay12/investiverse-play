import random
import time
import json
import asyncio
import requests
import websockets
from influxdb_client import InfluxDBClient, Point, WriteOptions
from influxdb_client.client.write_api import SYNCHRONOUS
from pyspark.sql import SparkSession

# -------------------------------
# Supabase Configuration
# -------------------------------
SUPABASE_URL = "https://tfmbjbskzindivtnxtrf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbWJqYnNremluZGl2dG54dHJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTA0NzgyOCwiZXhwIjoyMDU0NjIzODI4fQ.kmTKVQj8HomFUP5stjGlsPPHNGlcZMuNNB6mvvq5JbA"
SUPABASE_STOCKS_ENDPOINT = f"{SUPABASE_URL}/rest/v1/stocks?select=symbol,price"

supabase_headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

# -------------------------------
# Spark Session
# -------------------------------
spark = SparkSession.builder \
    .appName("StockPriceSimulator") \
    .master("local[*]") \
    .getOrCreate()

# -------------------------------
# Simulation methods
# -------------------------------
def method_1(price): return round(price * (1 + random.uniform(-0.01, 0.01)), 2)
def method_2(price): return round(price + random.uniform(-2, 2), 2)
def method_3(price): return round(price * (1 + random.uniform(-0.03, 0.03)), 2)
def method_4(price): return round(price * (1 + 0.001 + random.uniform(-0.002, 0.002)), 2)

methods = [method_1, method_2, method_3, method_4]

# -------------------------------
# InfluxDB Config
# -------------------------------
INFLUXDB_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "JXFFBPt8sKohODcwH0gx6iL0nxo0B6uoEfOf1hj49YbnSfuajSUpiuAjjEJ1biPircRiZnZZblqs1Eg9hJyCKg=="
INFLUXDB_ORG = "interverse"
INFLUXDB_BUCKET = "stocks"

influx_client = InfluxDBClient(
    url=INFLUXDB_URL,
    token=INFLUXDB_TOKEN,
    org=INFLUXDB_ORG
)
write_api = influx_client.write_api(write_options=SYNCHRONOUS)

# -------------------------------
# Fetch initial stocks from Supabase
# -------------------------------
def fetch_stocks_from_supabase():
    try:
        res = requests.get(SUPABASE_STOCKS_ENDPOINT, headers=supabase_headers)
        res.raise_for_status()
        data = res.json()
        return {row["symbol"]: float(row["price"]) for row in data}
    except Exception as e:
        print("❌ Failed to fetch stocks from Supabase:", e)
        return {}



# Blocking simulator (producer)
def simulate_and_send(updates_queue):
    stocks = fetch_stocks_from_supabase()
    if not stocks:
        print("⚠️ No stocks to simulate. Exiting.")
        return

    while True:
        updated_stocks = []
        for symbol, price in stocks.items():
            method = random.choice(methods)
            new_price = method(price)
            stocks[symbol] = new_price
            updated_stocks.append({"symbol": symbol, "price": new_price})

            try:
                point = Point("stock_price").tag("symbol", symbol).field("price", new_price).time(time.time_ns())
                write_api.write(bucket=INFLUXDB_BUCKET, org=INFLUXDB_ORG, record=point)
            except Exception as e:
                print(f"❌ Influx write failed for {symbol}:", e)

        updates_queue.put_nowait(updated_stocks)
        time.sleep(1)

# Entry point
if __name__ == "__main__":
    updates_queue = asyncio.Queue()
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, simulate_and_send, updates_queue)
    # loop.run_until_complete(stream_to_websocket(updates_queue))
