import pandas as pd
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.environ.get("GROQ_API_KEY")
MODEL_NAME = os.environ.get('MODEL_NAME')

df = pd.read_csv("synthetic_transaction_data.csv")

df["transaction_date"] = pd.to_datetime(df["transaction_date"])

current_month = df["transaction_date"].max().to_period("M")
current_month_data = df[df["transaction_date"].dt.to_period("M") == current_month]

ESSENTIAL_CATEGORIES = ["Rent", "Utilities", "Healthcare"]
VARIABLE_CATEGORIES = ["Dining", "Shopping", "Entertainment"]

total_income = current_month_data[current_month_data["amount_type"] == "credit"]["amount"].sum()

fixed_expenses = current_month_data[current_month_data["category"].isin(ESSENTIAL_CATEGORIES)]["amount"].sum()

variable_expenses = current_month_data[current_month_data["category"].isin(VARIABLE_CATEGORIES)]
variable_expenses_summary = variable_expenses.groupby("category")["amount"].sum().to_dict()

subscriptions = [
    {"name": "Netflix", "cost": 1599, "usage": "Daily", "priority": "High"},
    {"name": "Spotify", "cost": 999, "usage": "Weekly", "priority": "Medium"},
    {"name": "Gym Membership", "cost": 50, "usage": "Rarely", "priority": "Low"},
]

debts = [
    {"name": "Credit Card", "amount": 2000, "interest_rate": 18.5, "priority": "High"},
    {"name": "Student Loan", "amount": 15000, "interest_rate": 6.8, "priority": "Medium"},
]

current_savings = 1000
savings_goal = 10000
time_frame_months = 12

total_expenses = fixed_expenses + sum(variable_expenses_summary.values())

essential_expenses_ratio = fixed_expenses / total_income
variable_expenses_ratio = sum(variable_expenses_summary.values()) / total_income
savings_and_debt_ratio = (total_income - total_expenses) / total_income

stress_score = (
    (essential_expenses_ratio * 0.50) + 
    (variable_expenses_ratio * 0.30) + 
    (savings_and_debt_ratio * 0.20)
).clip(0, 100)  

user_data = {
    "income": total_income,
    "fixed_expenses": fixed_expenses,
    "variable_expenses": variable_expenses_summary,
    "subscriptions": subscriptions,
    "debts": debts,
    "current_savings": current_savings,
    "savings_goal": savings_goal,
    "time_frame_months": time_frame_months,
    "stress_score": stress_score,
}

user_data_json = json.dumps(user_data, indent=2)

print("Current Month's Data in JSON Format:")
print(user_data_json)

llm = ChatGroq(
    model_name=MODEL_NAME,
    temperature=0.7,
    api_key=API_KEY
)

parser = JsonOutputParser(pydantic_object={
    "type": "object",
    "properties": {
        "recommendations": {
            "type": "array",
            "items": {"type": "string"}
        }
    }
})

prompt = ChatPromptTemplate.from_messages([
    ("system", """Provide financial recommendations based on the user's current month transactional data. 
        Here is the JSON structure for the data:
        {current_month_json}
        Extract recommendations into JSON format:
        {{
            "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
        }}"""),
    ("user", "{current_month_json}")
])

chain = prompt | llm | parser

def get_recommendations(current_month_json: str) -> dict:
    result = chain.invoke({"current_month_json": current_month_json})
    return json.dumps(result, indent=2)

# recommendations = get_recommendations(user_data_json)

# print("Financial Recommendations:")
# print(recommendations)

def stress_score(user_data_json):
    return get_recommendations(user_data_json)