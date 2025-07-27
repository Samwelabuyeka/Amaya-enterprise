import os
from supabase import create_client, Client
import openai

# ✅ Amaya Production Credentials
SUPABASE_URL = "https://amaya-2da6f.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Replace with your actual OpenAI key for Maya core intelligence
OPENAI_API_KEY = "sk-REPLACE-WITH-YOUR-KEY"

# ✅ Init Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# ✅ Init OpenAI
openai.api_key = OPENAI_API_KEY

# ✅ Maya scans brands and gives real suggestions for platform growth
def maya_brand_review():
    print("🚀 Maya is scanning Amaya brands...\n")
    brands = supabase.table("brands").select("*").limit(5).execute().data
    if not brands:
        print("⚠️ No brands found.")
        return

    prompt = "You're Maya, AI co-founder of Amaya. Suggest improvements for these brands:\n\n"
    for b in brands:
        prompt += f"- {b['name']} ({b.get('category', 'No Category')}): {b.get('description', 'No description')}\n"

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are Maya, AI co-founder of Amaya."},
            {"role": "user", "content": prompt}
        ]
    )
    
    suggestions = response['choices'][0]['message']['content']
    print("💡 Maya's Suggestions:\n", suggestions)

# ✅ Run in prod mode
if __name__ == "__main__":
    print("🔐 Maya is running in PRODUCTION MODE\n")
    maya_brand_review()
