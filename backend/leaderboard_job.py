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
    print("Running leaderboard job...")

    # Start Spark session
    spark = SparkSession.builder.appName("LeaderboardJob").getOrCreate()

    # Fetch trades from Supabase
    response = supabase.table("trades").select("*").execute()
    data = response.data

    if not data:
        print("No data found in trades table.")
        spark.stop()
        return

    # Convert to Spark DataFrame
    rdd = spark.sparkContext.parallelize([json.dumps(row) for row in data])
    df = spark.read.json(rdd)

    # Aggregate BUY & SELL prices per user
    buy_df = df.filter(col("trade_type") == "BUY").groupBy("user_id").agg(avg("price").alias("avg_buy_price"))
    sell_df = df.filter(col("trade_type") == "SELL").groupBy("user_id").agg(avg("price").alias("avg_sell_price"))

    # Join BUY and SELL by user_id
    roi_df = buy_df.join(sell_df, on="user_id", how="inner")

    # Calculate ROI
    roi_df = roi_df.withColumn("roi", (col("avg_sell_price") - col("avg_buy_price")) / col("avg_buy_price"))

    # Rank users by ROI
    windowSpec = Window.orderBy(desc("roi"))
    ranked_df = roi_df.withColumn("rank", row_number().over(windowSpec))

    # Collect top 50
    top_n = ranked_df.limit(50).toPandas().to_dict(orient="records")

    # Push to Supabase leaderboard table
    for idx, entry in enumerate(top_n, start=1):
        supabase.table("leaderboard").upsert({
            "name": f"User {entry['user_id'][:6]}",  # placeholder name
            "xp": int(entry["roi"] * 1000),          # convert ROI to XP scale
            "rank": int(entry["rank"]),
            "avatar": f"https://api.dicebear.com/7.x/thumbs/svg?seed={entry['user_id']}",
            "recentachievement": "Top ROI performer",
            "position": idx,
            "streak": random.randint(1, 10)
        }).execute()

    spark.stop()
    print("Leaderboard job finished.\n")

# Schedule every 5 minutes
schedule.every(5).minutes.do(run_leaderboard_job)

print("Scheduler started. Running every 5 minutes...")
while True:
    schedule.run_pending()
    time.sleep(1)
