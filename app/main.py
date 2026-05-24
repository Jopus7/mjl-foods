from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.models import ( product, order, order_item )

from app.routes import ( products, orders, auth, payments )

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MJL foods"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(auth.router)
app.include_router(payments.router)


@app.get("/")
def root():
    return {
        "message":
        "Welcome to MJL foods API"
    }