FROM python:3.11-alpine3.19

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN python -m pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Command to start the server
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]