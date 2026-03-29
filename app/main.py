from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import product
from app.routes import products


Base.metadata.create_all(bind=engine)

app = FastAPI(title="MJL foods")

app.include_router(products.router)

@app.get("/")
def root():
    return {"message": "Welcome to MJL foods API"}

