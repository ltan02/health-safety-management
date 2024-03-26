FROM python:3.11-slim as builder

WORKDIR /opt/app

RUN pip install pipenv

COPY Pipfile Pipfile.lock ./

RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy

COPY . ./

FROM python:3.11-slim

WORKDIR /opt/app

COPY --from=builder /opt/app/.venv /opt/app/.venv

ENV PATH="/opt/app/.venv/bin:$PATH"

EXPOSE 8000

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]