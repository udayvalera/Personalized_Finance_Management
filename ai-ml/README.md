# AI/ML Financial Services API

This API provides financial analysis and recommendations using machine learning models. The API endpoints are built with Flask.

## Endpoints

### 1. Stress Score Analysis
- **Path**: `/stress-score`
- **Method**: GET
- **Response**: 
  ```json
  { 
    "stress_score": "calculated financial stress score"
  }
  ```

### 2. Financial Recommendations
- **Path**: `/financial-recommender`
- **Method**: POST
- **Input** (JSON body):
  ```json
  {
    "income": 5000,
    "expenses": {
      "fixed": 2000,
      "variable": 1500
    },
    "savings": 1000
  }
  ```
- **Response**: 
  ```json
  {
    "recommendations": ["Save 20% of income", "Reduce dining expenses"]
  }
  ```

### 3. Receipt Processing
- **Path**: `/receipt`
- **Method**: POST
- **Input**: Multipart/form-data with receipt image
- **Response**:
  ```json
  {
    "products": [
      {"name": "Milk", "price": 2.99},
      {"name": "Bread", "price": 1.99}
    ]
  }
  ```

### 4. Budget Modeling
- **Path**: `/budget-model`
- **Method**: POST
- **Input** (JSON body):
  ```json
  {
    "income": 5000,
    "expenses": [
      {"category": "Rent", "amount": 1500}
    ]
  }
  ```
- **Response**:
  ```json
  {
    "budget": {
      "income": 5000,
      "savings": 1000,
      "expenses": [
        {"category": "Rent", "allocated_amount": 1500}
      ]
    }
  }
  ```

## Setup
1. Install requirements:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export GROQ_API_KEY=your_api_key
export MODEL_NAME="mixtral-8x7b-32768"
```

3. Run the server:
```bash
python main.py
```
