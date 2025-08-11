from openai import OpenAI
from django.conf import settings

def get_ai_answer(question):
    try:
        # Create client when function is called (ensures settings are loaded)
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # or "gpt-4o" for better quality
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": question}
            ],
            temperature=0.7,
            max_tokens=500
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error: {str(e)}"
