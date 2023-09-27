FROM python:3.9

WORKDIR /bot
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py flag.txt ./
COPY app ./app
CMD ["python", "./main.py"]
