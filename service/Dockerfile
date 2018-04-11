FROM python:alpine

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

ENV FLASK_APP main.py
ENV FLASK_DEBUG 1

ENTRYPOINT [ "flask", "run", "--host=0.0.0.0" ]
