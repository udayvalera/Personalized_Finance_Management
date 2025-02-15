from typing import List, Optional
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import json
from dotenv import load_dotenv
import os


load_dotenv()

API_KEY = os.environ.get("GROQ_API_KEY")
MODEL_NAME = os.environ.get('MODEL_NAME')

class BudgetCategory(BaseModel):
    category: str
    allocated_amount: float
    actual_spent: Optional[float] = 0.0

class Budget(BaseModel):
    income: float
    savings: float
    expenses: List[BudgetCategory]

llm = ChatGroq(
    model_name=MODEL_NAME,
    temperature=0.7,
    api_key=API_KEY
)

parser = JsonOutputParser(pydantic_object=Budget)

prompt = ChatPromptTemplate.from_messages([
    ("system", """Extract budget details into JSON with this structure:
        {{
            "income": income_value,
            "savings": savings_value,
            "expenses": [
                {{"category": "category_name", "allocated_amount": amount, "actual_spent": optional_amount}}
            ]
        }}"""),
    ("user", "{input}")
])

chain = prompt | llm | parser

def save_json_to_file(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=2)

def parse_budget(description: str) -> dict:
    result = chain.invoke({"input": description})
    # print(json.dumps(result, indent=2))
    save_json_to_file(result,'budget_data.json')
# budget_description = """I earn 5000 per month. I allocate 2000 for rent, 500 for groceries, 
# 300 for utilities, and 500 for entertainment. I save 1000 each month."""
# parse_budget(budget_description)

def budget_model(budget_description):
    budget_description = input("Enter the prompt")
    parse_budget(budget_description)