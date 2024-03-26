from fastapi import FastAPI, HTTPException
from google.oauth2 import service_account
from pydantic import BaseModel
from google.cloud import aiplatform
from vertexai.preview.language_models import TextGenerationModel, TextEmbeddingModel
from dotenv import load_dotenv
from firebase_admin import firestore
import os
import json
from vertexai.generative_models import ChatSession, GenerativeModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


# load_dotenv()
# google_credentials_json = json.loads(os.getenv("GOOGLE_CREDENTIALS_JSON"))
# credentials = service_account.Credentials.from_service_account_info(google_credentials_json)


# db = firestore.Client(credentials=credentials)
db = firestore.Client()
doc_ref = db.collection('categories').document('categories')
doc = doc_ref.get()
categories = doc.to_dict().get('words', [])

# aiplatform.init(project="pwc-project-b3778", location="us-central1", credentials=credentials)
aiplatform.init(project="pwc-project-b3778", location="us-central1")
model = TextGenerationModel.from_pretrained("text-bison@001")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IncidentModel(BaseModel):
    incident: str


@app.post("/categorize/")
async def generate_text(incident_model: IncidentModel):
    incident = incident_model.incident
    prompt = f"Classify the following incident: '{incident}' into one of the following categories: {categories}. " \
             f"Return only the category, nothing else."

    try:
        response = model.predict(
            prompt=prompt,
            temperature=1,
            max_output_tokens=256,
            top_k=40,
            top_p=0.95,
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ChatPrompt(BaseModel):
    prompt: str


model2 = GenerativeModel("gemini-1.0-pro")
chat_session = model2.start_chat(response_validation=False)

users_ref = db.collection('incidents')
docs = users_ref.stream()

texts = []
for doc in docs:
    texts.append(str(doc.to_dict()))


# print(len(texts))

prompt = "You are a querying bot for PwC that answers user questions based on incident data. The data is as following" + str(texts) + " Once the data is loaded, reply with - 'Data Loaded'. Answer only incidents-related questions, for other questions, say - 'Query not related to incidents, try again.'"

t = []
r = chat_session.send_message(prompt, stream=True)

for chunk in r:
    t.append(chunk.text)
print("".join(t))
#
# for i in range(0, len(texts), 10):
#     t = []
#     r = chat_session.send_message("incidents - " + str(texts[i:10]), stream=True)
#     for chunk in r:
#         t.append(chunk.text)
#     print("".join(t))



@app.post("/chat/")
async def get_chat_response(chat_prompt: ChatPrompt) -> dict:
    text_response = []
    try:
        responses = chat_session.send_message(chat_prompt.prompt, stream=True)
        for chunk in responses:
            text_response.append(chunk.text)
        return {"response": "".join(text_response)}
    except Exception as e:
        return {"response": "Please try again with a different query."}



if __name__ == "__main__":
    uvicorn.run(app, port=8000)
