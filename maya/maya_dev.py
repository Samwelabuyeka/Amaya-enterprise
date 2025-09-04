import os
from supabase import create_client, Client
import openai

# ✅ Amaya Production Credentials
SUPABASE_URL = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

# OpenAI key must be set in env (do NOT commit API keys)
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError('SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment')

if not OPENAI_API_KEY:
    raise RuntimeError('OPENAI_API_KEY must be set in environment')

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
