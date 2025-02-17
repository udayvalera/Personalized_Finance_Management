from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
    MODEL_NAME = os.environ.get("MODEL_NAME")
    ESSENTIAL_CATEGORIES = ["Rent", "Utilities", "Healthcare"]
    VARIABLE_CATEGORIES = ["Dining", "Shopping", "Entertainment"]