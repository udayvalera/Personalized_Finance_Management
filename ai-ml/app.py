from flask import Flask, request, jsonify
from budget_model import BudgetService
from financial_recommender import FinancialRecommender
from stress_score import StressScoreCalculator
from reciept_model import extract_text_from_receipt, query_llm
from models.budget import UserFinancialData
from utils.file_handler import FileHandler
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Services initialization
budget_service = BudgetService()
financial_recommender = FinancialRecommender()
stress_calculator = StressScoreCalculator()

@app.route('/receipt', methods=['POST'])
def process_receipt():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "No selected file"}), 400
        
    if not FileHandler.allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    upload_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'upload')
    
    try:
        file_path = FileHandler.save_file(file, upload_folder)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found at path: {file_path}")

        extracted_text = extract_text_from_receipt(file_path)
        result = query_llm(extracted_text)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500
    finally:
        FileHandler.cleanup_folder(upload_folder)

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