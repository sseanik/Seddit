# pull official base image
FROM python:latest

# set work directory
WORKDIR /usr/src/seddit

# install dependencies
RUN pip install --upgrade pip

COPY ./requirements.txt /usr/src/seddit/requirements.txt

RUN pip install -r requirements.txt

COPY . /usr/src/seddit

CMD ["python3", "backend_server.py"]
