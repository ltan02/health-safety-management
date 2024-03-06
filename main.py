from fastapi import FastAPI, HTTPException
from google.oauth2 import service_account
from pydantic import BaseModel
from google.cloud import aiplatform
from vertexai.preview.language_models import TextGenerationModel, TextEmbeddingModel
from dotenv import load_dotenv
from firebase_admin import firestore
import os
import json


load_dotenv()
google_credentials_json = json.loads(os.getenv("GOOGLE_CREDENTIALS_JSON"))
credentials = service_account.Credentials.from_service_account_info(google_credentials_json)


db = firestore.Client(credentials=credentials)
doc_ref = db.collection('categories').document('categories')
doc = doc_ref.get()
categories = doc.to_dict().get('words', [])

aiplatform.init(project="pwc-project-b3778", location="us-central1", credentials=credentials)
model = TextGenerationModel.from_pretrained("text-bison@001")
app = FastAPI()

class IncidentModel(BaseModel):
    incident: str

@app.post("/generate-text/")
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)