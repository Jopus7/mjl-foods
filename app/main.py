from fastapi import FastAPI

app = FastAPI(title="MJL foods")

@app.get("/")
def root():
    return {"message": "Welcome to MJL foods API"}