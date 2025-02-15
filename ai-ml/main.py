from flask import Flask, jsonify, request
from financial_recommender import financial_recommender
from budget_model import budget_model
from reciept_model import reciept_model
from stress_score import get_recommendations as get_stress_recommendations


app = Flask(__name__)

@app.route('/')
def helloworld():
    return "Hello World!"

@app.route('/receipt')
def receipt():
    #model import here
    return "Receipt Models!"

@app.route("/stress-score", methods=['POST'])
def stress_score():
    data = request.get_json()
    if not data or 'budget_data' not in data:
        return jsonify({"error": "Missing required budget data"}), 400
    result = get_stress_recommendations(data['budget_data'])
    return jsonify(result)

@app.route("/financial-recommender")
def financial_recommender():
    return "Financial Recommender"

@app.route("/budget-model", methods=['POST'])
def budget_planning():
    data = request.get_json()
    if not data or 'income' not in data:
        return jsonify({"error": "Missing required budget data"}), 400
    result = budget_model(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='0.0.0.0')
