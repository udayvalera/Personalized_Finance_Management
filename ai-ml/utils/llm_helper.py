from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from config.settings import Config

def create_llm():
    return ChatGroq(
        model_name=Config.MODEL_NAME,
        temperature=0.7,
        api_key=Config.GROQ_API_KEY
    )

def create_recommendation_chain(prompt_template):
    llm = create_llm()
    parser = JsonOutputParser(pydantic_object={
        "type": "object",
        "properties": {
            "recommendations": {
                "type": "array",
                "items": {"type": "string"}
            }
        }
    })
    prompt = ChatPromptTemplate.from_messages([
        ("system", prompt_template),
        ("user", "{input_data}")
    ])
    return prompt | llm | parser