from typing import List, Optional
from pydantic import BaseModel

class BudgetCategory(BaseModel):
    category: str
    allocated_amount: float
    actual_spent: Optional[float] = 0.0

class Budget(BaseModel):
    income: float
    savings: float
    expenses: List[BudgetCategory]

class UserFinancialData(BaseModel):
    income: float
    fixed_expenses: float
    variable_expenses: dict
    subscriptions: List[dict]
    debts: List[dict]
    current_savings: float
    savings_goal: float
    time_frame_months: Optional[int] = 12
    stress_score: Optional[float] = None