from flask import Flask, request, jsonify
from budget_model import BudgetService
from financial_recommender import FinancialRecommender
from stress_score import StressScoreCalculator
from models.budget import UserFinancialData
import pandas as pd

app = Flask(__name__)

budget_service = BudgetService()
financial_recommender = FinancialRecommender()
stress_calculator = StressScoreCalculator()

@app.route('/api/budget', methods=['POST'])
def create_budget():
    data = request.json
    description = data.get('description')
    if not description:
        return jsonify({'error': 'Description is required'}), 400
    
    try:
        budget = budget_service.parse_budget(description)
        return jsonify(budget)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        df = pd.DataFrame(request.json['transactions'])
        user_data = financial_recommender.process_transaction_data(df)
        recommendations = financial_recommender.get_recommendations(user_data)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stress-score', methods=['POST'])
def calculate_stress_score():
    try:
        user_data = UserFinancialData(**request.json)
        score = stress_calculator.calculate_stress_score(user_data)
        return jsonify({'stress_score': score})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)