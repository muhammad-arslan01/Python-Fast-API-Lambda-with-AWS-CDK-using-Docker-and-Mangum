# app/main.py

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from mangum import Mangum
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware

# Create a FastAPI application
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend origin
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# Define a custom middleware to check the Authorization header
class AuthorizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Check if the "Authorization" header exists and its value is "eyj123"
        if request.headers.get("authorization") != "eyj123":
            # Return a custom JSON response instead of raising an exception
            return JSONResponse(
                status_code=403,
                content={"detail": "Invalid Authorization header. Please provide a valid 'Authorization' header."}
            )
        # If header is correct, proceed to the next middleware or endpoint
        response = await call_next(request)
        return response

# Add the custom middleware to the FastAPI app
app.add_middleware(AuthorizationMiddleware)

# Define a root endpoint
@app.get("/hello1")
async def root():
    return {"message": "Hello from FastAPI with Mangum and Docker-HELLO 1!"}

# Define a root endpoint
@app.get("/hello2")
async def root():
    return {"message": "Hello from FastAPI with Mangum and Docker-hello 2!"}

# Create a Mangum handler to wrap the FastAPI app for AWS Lambda
handler = Mangum(app)






