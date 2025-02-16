from flask import Flask, jsonify, request
from budget_model import budget_model
from reciept_model import preprocess_receipt, extract_text_from_receipt, query_llm
import os
import shutil
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



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

    # Create upload folder within the same directory as main.py
    upload_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'upload')
    os.makedirs(upload_folder, exist_ok=True)

    try:
        # Save file to upload folder
        file_path = os.path.join(upload_folder, file.filename)
        print(f"Saving file to: {file_path}")
        file.save(file_path)

        # Verify the file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found at path: {file_path}")

        print(f"File saved successfully. Processing receipt...")
        
        extracted_text = extract_text_from_receipt(file_path)
        result = query_llm(extracted_text)
        
        # Clean up upload folder
        shutil.rmtree(upload_folder)
        print(result)
        return jsonify(result)
        
    except Exception as e:
        print(f"Error processing receipt: {str(e)}")
        # Ensure upload folder is deleted even if an error occurs
        if os.path.exists(upload_folder):
            shutil.rmtree(upload_folder)
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

# @app.route("/stress-score", methods=['POST'])
# def stress_score():
#     data = request.get_json()
#     if not data or 'budget_data' not in data:
#         return jsonify({"error": "Missing required budget data"}), 400
#     result = get_stress_recommendations(data['budget_data'])
#     return jsonify(result)

# @app.route("/financial-recommender", methods=['POST'])
# def handle_financial_recommendation():
#     data = request.get_json()
#     if not data or 'user_data' not in data:
#         return jsonify({"error": "Missing required user data"}), 400
#     result = get_recommendations(data['user_data'])
#     return jsonify(result)

@app.route("/budget-model", methods=['POST'])
def budget_planning():
    data = request.get_json()
    if not data or 'income' not in data:
        return jsonify({"error": "Missing required budget data"}), 400
    result = budget_model(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='0.0.0.0')
