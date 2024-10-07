# Use the official Python image as the base image
FROM public.ecr.aws/lambda/python:3.8

# Copy the requirements file to the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .


CMD ["api.handler"]