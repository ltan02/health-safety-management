from fastapi import FastAPI, HTTPException, Header
from google.cloud import firestore
import json
from dotenv import load_dotenv
from google.cloud import aiplatform
import os
from google.oauth2 import service_account
from vertexai.generative_models import ChatSession, GenerativeModel
from google.cloud import bigquery
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import re


load_dotenv()
google_credentials_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
if google_credentials_json:
    parsed_credentials = json.loads(google_credentials_json)
    credentials = service_account.Credentials.from_service_account_info(parsed_credentials)
    db = firestore.Client(credentials=credentials)
    aiplatform.init(project="pwc-project-b3778", location="us-west1", credentials=credentials)
    client = bigquery.Client(credentials=credentials)
else:
    db = firestore.Client()
    aiplatform.init(project="pwc-project-b3778", location="us-west1")
    client = bigquery.Client()

doc_ref = db.collection('categories').document('categories')
doc = doc_ref.get()
categories = doc.to_dict().get('words', [])


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/getCategories")
async def get_categories():
    return {"categories": str(categories)}


@app.delete("/purge")
async def purge():
    incidents = db.collection('incidents').stream()
    for incident in incidents:
        incident_dict = incident.to_dict()
        if incident_dict['employeesInvolved'] is None and incident_dict['incidentCategory'] is None and incident_dict['incidentDate'] is None and incident_dict['reviewer'] is None and incident_dict['statusId'] is None:
            db.collection('incidents').document(incident.id).delete()
    return {"message": "Incidents purged"}


class IncidentModel(BaseModel):
    incident: str


class Prompt(BaseModel):
    prompt: str


class ChatPrompt(BaseModel):
    prompt: str


@app.post("/categorize/")
async def generate_text(incident_model: IncidentModel):
    incident = incident_model.incident
    prompt = f"Classify the following incident: '{incident}' into one of the following categories: {categories}. " \
             f"Only return the category. Do not return a sentence, just the category classification."

    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate")
async def talk(prompt_model: Prompt):
    try:
        response = model.generate_content(prompt_model.prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


schema = '''[
    bigquery.SchemaField("statusHistory", "RECORD", mode="REPEATED", fields=[
        bigquery.SchemaField("statusId", "STRING"),
        bigquery.SchemaField("date", "TIMESTAMP"),
        bigquery.SchemaField("userId", "STRING"),
    ]),
    bigquery.SchemaField("incidentCategory", "STRING"),
    bigquery.SchemaField("preventive_measures", "STRING"),
    bigquery.SchemaField("description", "STRING"),
    bigquery.SchemaField("actions_taken", "STRING"),
    bigquery.SchemaField("existing_barriers", "STRING"),
    bigquery.SchemaField("location", "STRING"),
    bigquery.SchemaField("witnesses", "STRING"),
    bigquery.SchemaField("involvement_type", "STRING"),

    bigquery.SchemaField("incidentDate", "TIMESTAMP"),
    bigquery.SchemaField("employeesInvolved", "STRING", mode="REPEATED"),
    bigquery.SchemaField("lastUpdatedAt", "TIMESTAMP"),
    bigquery.SchemaField("reporter", "STRING"),
    bigquery.SchemaField("comments", "RECORD", mode="REPEATED", fields=[
        bigquery.SchemaField("content", "STRING"),
        bigquery.SchemaField("userId", "STRING"),
        bigquery.SchemaField("timestamp", "TIMESTAMP"),
    ]),
    bigquery.SchemaField("statusId", "STRING"),
    bigquery.SchemaField("createdAt", "TIMESTAMP"),
    bigquery.SchemaField("reviewer", "STRING"),
]'''


model = GenerativeModel("gemini-1.0-pro")
model2 = GenerativeModel("gemini-1.0-pro")


def newChat(chatsession):
    prompt = f"""
    You are now acting as a querying assistant for PricewaterhouseCoopers (PwC), a global leader in professional 
    services, specializing in Assurance, Tax, and Advisory services.

    Your task is to answer queries by generating SQL queries for a table called 'incidents.incidents_main'

    An example SQL query for getting all information from the table is: SELECT * FROM incidents.incidents_main;

    The incidentCategory for each incident will be one of - {categories}. When a user asks a category-related question, first match their query to the closest category and then query that category.

    IMPORTANT: For date or time period related questions, remember that the 'incidentDate' field is an ISO formatted string (yyyy-MM-dd'T'HH:mm:ss). Use functions like SUBSTR() to extract date parts - do not cast them to the DATE format directly.

    When comparing time periods, ensure that both sides are strings. For example, the clause should be written as:
    incidentDate >= CAST(FORMAT_TIMESTAMP('%Y-%m-%d', CURRENT_TIMESTAMP() - INTERVAL 7 DAY) AS STRING);

    For non-incident-related queries such as 'What's the weather like today?', respond with: 'Query not related to incidents, please try again with an incident-related question.'

    The schema of the table is {schema}. Once the schema is read, simply respond with 'Done Reading' and nothing else. Ensure you use correct field and subfield names in the SQL query.

    IMPORTANT: For queries related to fields like 'comments' or 'statusHistory', you must use JSON_EXTRACT_SCALAR function as shown below:

    SELECT
        JSON_EXTRACT_SCALAR(comments, '$.<field to be queried>')
    FROM
        incidents.incidents_main,
        UNNEST(comments) AS comments;

    Ensure all SQL queries:
    - Do not contain syntax errors.
    - Are complete with necessary clauses.
    - End with a semicolon.
    - Do not include unnecessary characters or formatting symbols like backticks unless needed for identifiers.

    Please review your queries for correctness before sending them for execution.
    """

    t = []
    r = chatsession.send_message(prompt, stream=True)

    for chunk in r:
        t.append(chunk.text)
    print("".join(t))


def getUsers():
    collection_ref = db.collection('users')
    docs = collection_ref.stream()
    documents_dict = {}

    for doc in docs:
        documents_dict[doc.id] = doc.to_dict()

    return documents_dict


def getStatuses():
    collection_ref = db.collection('status')
    docs = collection_ref.stream()
    documents_dict = {}

    for doc in docs:
        documents_dict[doc.id] = doc.to_dict()

    return documents_dict


users = getUsers()
statuses = getStatuses()

def newChat2(chatsession):
    prompt = """
    You are now acting as a result presenting bot for PricewaterhouseCoopers (PwC), a global leader in professional 
    services, specializing in Assurance, Tax, and Advisory services. With the post-pandemic return to office, there is 
    a renewed focus on Health and Safety, critical for PwC's rapidly growing cloud engineering consulting practice in 
    Canada.
    
    I will give you the results that I got by running an SQL query on data about incidents are PwC and your job is to 
    present them to the user in a nice and readable way. If, however, you receive the string - 'Query not related to 
    incidents, please try again with an incident-related question.', then return this string to the user as is. 
    
    Be sure to be highly accurate and incorporate the data given to you in your answers in the most effective way. 
    When done reading this prompt, respond with Done. The first part of the prompt is the user's query and the second 
    part of the prompt the data received by running the SQL query.
    
    If in the data you see any user ids - replace them with first and last names according to the dictionary - """ \
    + str(users) + """. Also, replace any status ids with their names according to - """ + str(statuses) + """
    """

    t = []
    r = chatsession.send_message(prompt, stream=True)

    for chunk in r:
        t.append(chunk.text)
    print("".join(t))


ids = {}
ids2 = {}


@app.post("/chat/")
async def get_chat_response(chat_prompt: ChatPrompt, uuid: str = Header(None)) -> dict:
    text_response = []
    text_response2 = []

    if uuid not in ids:
        ids[uuid] = model.start_chat(response_validation=False)
        ids2[uuid] = model2.start_chat(response_validation=False)
        newChat(ids[uuid])
        newChat2(ids2[uuid])

    chat_session = ids[uuid]
    chat_session2 = ids2[uuid]

    try:
        responses = chat_session.send_message(chat_prompt.prompt, stream=True)
        for chunk in responses:
            text_response.append(chunk.text)

        query = "".join(text_response)
        matches = re.findall(r"SELECT[\s\S]*?(?=$)", query, re.DOTALL)
        query = matches[0] if matches else "SELECT * FROM incidents.incidents_main;"
        query = re.sub(r"[`;\s]+$", "", query)
        if not query.strip().endswith(';'):
            query += ';'

        query_job = client.query(query)
        results = query_job.result()

        rows_data = []

        for row in results:
            row_data = ", ".join(f"{column}: {row[column]}" for column in row.keys())
            rows_data.append(row_data)

        result_string = "\n".join(rows_data)

        main_string = "User Query: " + chat_prompt.prompt + "\n Data: " + str(result_string)

        responses2 = chat_session2.send_message(main_string, stream=True)
        for chunk in responses2:
            text_response2.append(chunk.text)

        return {"response": "".join(text_response2)}

    except Exception as e:
        print(e)
        return {"response": "Please try again with a different query."}