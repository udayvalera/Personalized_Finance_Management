from typing import List, Optional
from pydantic import BaseModel
from langchain_groq import ChatGroq
from models.budget import Budget
from utils.llm_helper import create_llm
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

class BudgetService:
    def __init__(self):
        self.llm = create_llm()
        self.parser = JsonOutputParser(pydantic_object=Budget)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """Extract budget details into JSON with this structure:
                {
                    "income": income_value,
                    "savings": savings_value,
                    "expenses": [
                        {"category": "category_name", "allocated_amount": amount, "actual_spent": optional_amount}
                    ]
                }"""),
            ("user", "{input}")
        ])
        self.chain = self.prompt | self.llm | self.parser

    def save_json_to_file(self, data, filename):
        with open(filename, 'w') as json_file:
            json.dump(data, json_file, indent=2)

    def parse_budget(self, description: str) -> dict:
        result = self.chain.invoke({"input": description})
        self.save_json_to_file(result, 'budget_data.json')
        return result

def budget_model(budget_description):
    # budget_description = input("Enter the prompt")
    parse_budget(budget_description)