import pandas as pd
from utils.llm_helper import create_recommendation_chain
from config.settings import Config
from models.budget import UserFinancialData

class FinancialRecommender:
    def __init__(self):
        self.prompt_template = """Provide financial recommendations based on the user's current month transactional data.
            and provide them with the budgeting recommendations. 
            Here is the JSON structure for the data:
            {input_data}
            Extract recommendations into JSON format:
            {
                "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
            }"""
        self.chain = create_recommendation_chain(self.prompt_template)

    def process_transaction_data(self, df: pd.DataFrame) -> UserFinancialData:
        df["transaction_date"] = pd.to_datetime(df["transaction_date"])
        current_month = df["transaction_date"].max().to_period("M")
        current_month_data = df[df["transaction_date"].dt.to_period("M") == current_month]
        
        total_income = current_month_data[current_month_data["amount_type"] == "credit"]["amount"].sum()
        fixed_expenses = current_month_data[current_month_data["category"].isin(Config.ESSENTIAL_CATEGORIES)]["amount"].sum()
        
        variable_expenses = current_month_data[current_month_data["category"].isin(Config.VARIABLE_CATEGORIES)]
        variable_expenses_summary = variable_expenses.groupby("category")["amount"].sum().to_dict()
        
        return UserFinancialData(
            income=total_income,
            fixed_expenses=fixed_expenses,
            variable_expenses=variable_expenses_summary,
            subscriptions=[],  # Add actual subscriptions data
            debts=[],  # Add actual debts data
            current_savings=0,  # Add actual savings
            savings_goal=0  # Add actual goal
        )

    def get_recommendations(self, user_data: UserFinancialData) -> dict:
        return self.chain.invoke({"input_data": user_data.model_dump()})