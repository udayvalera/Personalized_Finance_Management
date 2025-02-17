from models.budget import UserFinancialData

class StressScoreCalculator:
    def __init__(self):
        self.weights = {
            'essential': 0.50,
            'variable': 0.30,
            'savings': 0.20
        }

    def calculate_stress_score(self, data: UserFinancialData) -> float:
        total_expenses = data.fixed_expenses + sum(data.variable_expenses.values())
        
        essential_expenses_ratio = data.fixed_expenses / data.income
        variable_expenses_ratio = sum(data.variable_expenses.values()) / data.income
        savings_and_debt_ratio = (data.income - total_expenses) / data.income

        stress_score = (
            (essential_expenses_ratio * self.weights['essential']) + 
            (variable_expenses_ratio * self.weights['variable']) + 
            (savings_and_debt_ratio * self.weights['savings'])
        )
        
        return min(max(stress_score, 0), 100)