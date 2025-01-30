import json
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer

class SavingsRecommender:
    def __init__(self, data):
        self.data = data  # User's transactional data
        # Initialize the language model pipeline with phi3
        model_name_or_path = 'microsoft/Phi-3.5-mini-instruct'  # Replace with the actual path or model name

        # Load the tokenizer and model
        self.tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
        self.model = AutoModelForCausalLM.from_pretrained(model_name_or_path)

        # Set up the pipeline
        self.llm = pipeline(
            'text-generation',
            model=self.model,
            tokenizer=self.tokenizer,
            max_length=512,
            pad_token_id=self.tokenizer.eos_token_id  # Ensure pad token ID is set correctly
        )

    def saving_recommender(self):
        # Generate savings recommendations
        prompt = (
            "As a financial advisor, analyze the following financial data and suggest savings strategies. "
            "Provide clear recommendations to help the user achieve their savings goal.\n\n"
            f"Data: {json.dumps(self.data)}\n\n"
            "Recommendations:"
        )
        return self.query_local_llm(prompt)

    def subscription_recommender(self):
        # Generate subscription management recommendations
        prompt = (
            "As a financial advisor, analyze the following subscription data and suggest how to optimize it. "
            "Identify subscriptions to cancel or manage to help the user achieve their savings goals.\n\n"
            f"Data: {json.dumps(self.data)}\n\n"
            "Recommendations:"
        )
        return self.query_local_llm(prompt)

    def debt_recommender(self):
        # Generate debt management recommendations
        prompt = (
            "As a financial advisor, analyze the following debt data and suggest strategies to pay off debt efficiently. "
            "Provide recommendations that align with achieving the user's savings goals.\n\n"
            f"Data: {json.dumps(self.data)}\n\n"
            "Recommendations:"
        )
        return self.query_local_llm(prompt)

    def query_local_llm(self, prompt):
        # Interact with the local LLM using transformers
        try:
            responses = self.llm(prompt, max_length=300, num_return_sequences=1, do_sample=True)
            # Extract the generated text after the prompt
            generated_text = responses[0]['generated_text']
            # Remove the prompt from the generated text
            recommendation = generated_text[len(prompt):].strip()
            return recommendation
        except Exception as e:
            return f"Error generating response from LLM: {e}"

# Example usage
if __name__ == "__main__":
    data = {
        "income": 5000,
        "expenses": 4500,
        "subscriptions": [
            {"name": "Netflix", "cost": 15},
            {"name": "Spotify", "cost": 10},
            {"name": "Gym", "cost": 50}
        ],
        "debts": [
            {"name": "Credit Card", "amount": 2000, "interest_rate": 15}
        ],
        "savings_goal": 1000
    }

    recommender = SavingsRecommender(data)

    print("Savings Recommendations:")
    print(recommender.saving_recommender())

    print("\nSubscription Recommendations:")
    print(recommender.subscription_recommender())

    print("\nDebt Recommendations:")
    print(recommender.debt_recommender())
