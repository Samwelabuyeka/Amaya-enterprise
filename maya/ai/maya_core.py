import os
from supabase import create_client
import openai

# 🔐 ENV Variables (you should inject these safely)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

# ⚙️ Init Supabase + OpenAI
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
openai.api_key = OPENAI_KEY

# 🎯 Maya Core Logic
def fetch_brands():
    response = supabase.table("brands").select("*").execute()
    return response.data

def suggest_improvements(brand):
    prompt = f"Suggest ways to improve this brand on a marketplace: {brand}"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a business growth advisor AI."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message["content"]

def analyze_all_brands():
    brands = fetch_brands()
    suggestions = {}
    for brand in brands:
        suggestions[brand['name']] = suggest_improvements(brand)
    return suggestions

# Example call (for testing):
if __name__ == "__main__":
    print("Maya AI Suggestions:")
    results = analyze_all_brands()
    for name, suggestion in results.items():
        print(f"\n🔍 {name}:\n{suggestion}\n")
