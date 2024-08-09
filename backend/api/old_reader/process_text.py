import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def simple_text_splitter(text, max_length):
    words = text.split()
    chunks = []
    current_chunk = []

    for word in words:
        if sum(len(w) for w in current_chunk) + len(word) <= max_length:
            current_chunk.append(word)
        else:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

def process_text_with_gpt(text):
    max_tokens = 2048
    chunks = simple_text_splitter(text, max_tokens)

    responses = []
    for chunk in chunks:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=chunk,
            max_tokens=150
        )
        responses.append(response.choices[0].text)

    return responses
