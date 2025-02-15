from flask import Flask, jsonify, request
from financial_recommender import get_recommendations
from budget_model import budget_model
from reciept_model import preprocess_receipt, extract_text_from_receipt, query_llm
import os
import tempfile
from stress_score import get_recommendations as get_stress_recommendations


app = Flask(__name__)

@app.route('/')
def helloworld():
    return "Hello World!"

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/receipt', methods=['POST'])
def receipt():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    try:
        # Save temp file
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, file.filename)
        file.save(temp_path)
        
        # Process receipt
        processed_image = preprocess_receipt(temp_path)
        extracted_text = extract_text_from_receipt(processed_image)
        result = query_llm(extracted_text)
        
        # Clean up temp file
        os.remove(temp_path)
        os.rmdir(temp_dir)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

@app.route("/stress-score", methods=['POST'])
def stress_score():
    data = request.get_json()
    if not data or 'budget_data' not in data:
        return jsonify({"error": "Missing required budget data"}), 400
    result = get_stress_recommendations(data['budget_data'])
    return jsonify(result)

@app.route("/financial-recommender", methods=['POST'])
def handle_financial_recommendation():
    data = request.get_json()
    if not data or 'user_data' not in data:
        return jsonify({"error": "Missing required user data"}), 400
    result = get_recommendations(data['user_data'])
    return jsonify(result)

@app.route("/budget-model", methods=['POST'])
def budget_planning():
    data = request.get_json()
    if not data or 'income' not in data:
        return jsonify({"error": "Missing required budget data"}), 400
    result = budget_model(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='0.0.0.0')
