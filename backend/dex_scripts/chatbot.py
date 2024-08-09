import openai
import yaml

# Load config
with open('dex_config/config.yaml', 'r') as f:
    config = yaml.safe_load(f)

openai.api_key = config['openai_api_key']

def query_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    return response['choices'][0]['message']['content'].strip()

if __name__ == "__main__":
    print("Dex is ready. Type 'stop' or 'quit' to end the session.")
    
    while True:
        user_query = input("Please enter your query: ")
        
        if user_query.lower() in ["stop", "quit"]:
            print("Exiting Dex.")
            break
        
        response = query_gpt(user_query)
        print("Dex Response:")
        print(response)
