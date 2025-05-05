from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.functions import sum as Fsum
from pyspark.sql.window import Window

class PortfolioDataProcessor:
    def __init__(self):
        self.spark = SparkSession.builder \
            .appName("InvestiverseDataProcessor") \
            .config("spark.jars.packages", "io.delta:delta-core_2.12:2.1.0") \
            .getOrCreate()

    def process_portfolio_data(self, portfolio_data, trades_data):
        portfolio_df = self.spark.createDataFrame([portfolio_data])
        trades_df = self.spark.createDataFrame(trades_data)

        # 1. Stock-wise metrics
        stock_metrics = trades_df.groupBy("stock_name").agg(
            sum(when(col("trade_type") == "BUY", col("quantity") * col("price")).otherwise(0)).alias("total_invested"),
            sum(when(col("trade_type") == "SELL", col("quantity") * col("price")).otherwise(0)).alias("total_sold"),
            avg("price").alias("avg_trade_price"),
            count("*").alias("total_trades")
        )

        # 2. Trading patterns
        # define a per-user+stock window
        window_spec = Window.partitionBy("stock_name").orderBy("trade_time")
        trading_patterns = trades_df \
            .withColumn("prev_trade_type", lag("trade_type").over(window_spec)) \
            .withColumn("trade_interval", col("trade_time") - lag("trade_time").over(window_spec)) \
            .groupBy("stock_name") \
            .agg(
                avg("trade_interval").alias("avg_trade_interval"),
                sum(when(col("trade_type") == col("prev_trade_type"), 1)).alias("consecutive_same_trades")
            )

        # 3. Portfolio concentration
        total_value = portfolio_df.select("current_value").collect()[0][0]
        portfolio_concentration = trades_df \
            .groupBy("stock_name") \
            .agg(
                (sum(col("quantity") * col("price")) / lit(total_value) * 100).alias("portfolio_percentage")
            )

        # 4. Performance metrics
        performance = trades_df \
            .withColumn("profit_loss", 
                when(col("trade_type") == "SELL", 
                    col("price") * col("quantity") - lag(col("price") * col("quantity")).over(Window.partitionBy("stock_name").orderBy("trade_time"))
                ).otherwise(0)
            )

        # 4. Convert DataFrames to dictionaries
        stock_metrics_dict = stock_metrics.toPandas().to_dict(orient="records")
        trading_patterns_dict = trading_patterns.toPandas().to_dict(orient="records")
        portfolio_concentration_dict = portfolio_concentration.toPandas().to_dict(orient="records")
        performance_dict = performance.toPandas().to_dict(orient="records")

        # 5) Top‐3 users by transaction volume
        top_users_by_volume = (
            trades_df
            .withColumn(
                "txn_amount",
                col("quantity") * col("price")
            )
            .groupBy("user_id")
            .agg(
                Fsum("txn_amount").alias("total_transaction_volume")
            )
            .orderBy(col("total_transaction_volume").desc())
            .limit(3)
        )
        top_users_by_volume_dict = top_users_by_volume.toPandas().to_dict(orient="records")

        return {
            "stock_metrics":           stock_metrics_dict,
            "trading_patterns":        trading_patterns_dict,
            "portfolio_concentration": portfolio_concentration_dict,
            "performance":             performance_dict,
            "top_users_by_volume":     top_users_by_volume_dict
        }