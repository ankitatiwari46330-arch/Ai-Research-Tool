from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

messages = [
    {"role": "system", "content": "You are NeuroQuest AI assistant"}
]

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"reply": "⚠️ Empty message"}), 400

        messages.append({"role": "user", "content": user_message})

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": messages
            }
        )

        res_data = response.json()

        # DEBUG (important)
        print(res_data)

        reply = res_data["choices"][0]["message"]["content"]

        messages.append({"role": "assistant", "content": reply})

        return jsonify({"reply": reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": "❌ Server error"}), 500


if __name__ == "__main__":
    app.run(debug=True)