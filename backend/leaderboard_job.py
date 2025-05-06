import schedule
import time
import json
import random
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, desc, row_number
from pyspark.sql.window import Window
from supabase import create_client

# Supabase setup
url = "https://tfmbjbskzindivtnxtrf.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbWJqYnNremluZGl2dG54dHJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTA0NzgyOCwiZXhwIjoyMDU0NjIzODI4fQ.kmTKVQj8HomFUP5stjGlsPPHNGlcZMuNNB6mvvq5JbA"
supabase = create_client(url, key)

def run_leaderboard_job():
    print("🚀 Running leaderboard job...")

    # Start Spark session
    spark = SparkSession.builder.appName("LeaderboardJob").getOrCreate()

    # Fetch trades
    trades_response = supabase.table("trades").select("*").execute()
    trades_data = trades_response.data
    if not trades_data:
        print("⚠️ No data found in trades table.")
        spark.stop()
        return

    # Fetch users
    users_response = supabase.table("users").select("user_id, email").execute()
    users_data = users_response.data

    # Convert to Spark DataFrames
    trades_rdd = spark.sparkContext.parallelize([json.dumps(row) for row in trades_data])
    trades_df = spark.read.json(trades_rdd)

    users_rdd = spark.sparkContext.parallelize([json.dumps(row) for row in users_data])
    users_df = spark.read.json(users_rdd)

    # Compute ROI
    buy_df = trades_df.filter(col("trade_type") == "BUY").groupBy("user_id").agg(avg("price").alias("avg_buy_price"))
    sell_df = trades_df.filter(col("trade_type") == "SELL").groupBy("user_id").agg(avg("price").alias("avg_sell_price"))

    roi_df = buy_df.join(sell_df, on="user_id", how="inner")
    roi_df = roi_df.withColumn("roi", (col("avg_sell_price") - col("avg_buy_price")) / col("avg_buy_price"))    # Join ROI with user emails
    roi_df = roi_df.join(users_df.select("user_id", "email"), on="user_id", how="left")

    # Rank users by ROI
    windowSpec = Window.orderBy(desc("roi"))
    ranked_df = roi_df.withColumn("rank", row_number().over(windowSpec))

    # Collect top 50
    top_n = ranked_df.limit(50).toPandas().to_dict(orient="records")

    # Upsert to Supabase leaderboard
    for idx, entry in enumerate(top_n, start=1):
        supabase.table("leaderboard").upsert(
            {
                "user_id": entry["user_id"],
                "name": entry.get("email", f"User {entry['user_id'][:6]}"),
                "xp": int(entry["roi"] * 1000),
                "rank": int(entry["rank"]),
                "avatar": f"https://api.dicebear.com/7.x/thumbs/svg?seed={entry['user_id']}",
                "recentachievement": "Top ROI performer",
                "position": idx,
                "streak": random.randint(1, 10)
            },
            on_conflict="user_id"
        ).execute()

    spark.stop()
    print("✅ Leaderboard job finished.\n")

# Run once immediately
run_leaderboard_job()

# Schedule to run every 5 minutes after
schedule.every(5).minutes.do(run_leaderboard_job)

print("🕒 Scheduler started. Running every 5 minutes...")
while True:
    schedule.run_pending()
    time.sleep(1)
