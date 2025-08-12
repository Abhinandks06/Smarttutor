from groq import Groq
import os

# Make sure you set GROQ_API_KEY in your environment variables
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_ai_answer(question: str) -> str:
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",  # You can also try "llama3-70b-8192" for better answers
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": question}
            ],
            max_tokens=300,
        )

        # Groq returns content like OpenAI, but must be accessed via `.message.content`
        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error: {str(e)}"