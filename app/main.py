from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import product, order, order_item
from app.routes import products, orders
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="MJL foods")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)

@app.get("/")
def root():
    return {"message": "Welcome to MJL foods API"}

