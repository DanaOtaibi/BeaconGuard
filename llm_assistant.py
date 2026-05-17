import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_ai_report(networks):
    prompt = f"""
You are a cybersecurity assistant.

Analyze these Wi-Fi scan results and return ONLY valid JSON.

The JSON format must be exactly:

{{
  "networks": [
    {{
      "network_name": "string",
      "security_status": "Secure / Moderate / Risky",
      "authentication": "string",
      "encryption": "string",
      "signal_quality": "Excellent / Good / Fair / Weak",
      "risk_level": "Low / Medium / High",
      "reason": "detailed reason",
      "recommendation": "detailed practical recommendation"
    }}
  ],
  "overall_summary": "one clear overall summary sentence"
}}

Do not use markdown.
Do not add text outside the JSON.

Wi-Fi Scan Results:
{json.dumps(networks, indent=2)}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional cybersecurity assistant that returns valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        return {
            "networks": [],
            "overall_summary": f"AI Error: {str(e)}"
        }