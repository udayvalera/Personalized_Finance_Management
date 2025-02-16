import cv2
import pytesseract
import re
import json
from pydantic import BaseModel
from typing import List
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

API_KEY = os.environ.get("GROQ_API_KEY")
MODEL_NAME = os.environ.get('MODEL_NAME')

llm = ChatGroq(
    model_name=MODEL_NAME,
    temperature=0.7,
    api_key=API_KEY
)

parser = JsonOutputParser(pydantic_object={
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "price": {"type": "number"}
    }
})

prompt = ChatPromptTemplate.from_messages([
    ("system", """Extract product details into JSON with this structure(If there are multiple products, provide a total sum of all prices):
        {{
            "name": "product name here",
            "price": number_here_without_currency_symbol
        }}"""),
    ("user", "{input}")
])

chain = prompt | llm | parser

class Product(BaseModel):
    name: str
    price: str

class ParsedReceiptData(BaseModel):
    products: List[Product]

def preprocess_receipt(image_path):
    print(f"Inside preprocess_receipt. File path: {image_path}")
    
    # Verify the file exists
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"File not found at path: {image_path}")
    
    # Read the image using OpenCV
    image = cv2.imread(image_path)
    
    # Check if the image was loaded successfully
    if image is None:
        raise ValueError(f"Failed to read image from path: {image_path}. Check if the file is a valid image.")
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    processed = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                      cv2.THRESH_BINARY, 11, 2)
    
    return processed

def extract_text_from_receipt(image_path):
    processed_image = preprocess_receipt(image_path)
    
    extracted_text = pytesseract.image_to_string(processed_image)
    return extracted_text

# def parse_receipt_data(text):
#     data = ParsedReceiptData(products=[])
    
#     product_pattern = re.compile(r'([a-zA-Z ]+)\s+\$?(\d+[.,]\d+)')
#     matches = product_pattern.findall(text)
#     for match in matches:
#         product_name = match[0].strip()
#         product_price = match[1].strip()
#         data.products.append(Product(name=product_name, price=product_price))
    
#     return data

def query_llm(extracted_text):
    result = chain.invoke({"input": extracted_text})
    return result

def save_json_to_file(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=2)

# # Example usage
# image_path = 'receipt-ocr-original.jpg'  # Ensure this path is correct
# extracted_text = extract_text_from_receipt(image_path)
# llm_response = query_llm(extracted_text)

# # print("Extracted Text:", extracted_text)
# print("LLM Analysis:", json.dumps(llm_response, indent=2))

# # Save the JSON response to a file
# save_json_to_file(llm_response, 'llm_response.json')

def reciept_model(image_path):
    extracted_text = extract_text_from_receipt(image_path)
    llm_response = query_llm(extracted_text)
    save_json_to_file(llm_response)