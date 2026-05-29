import os
import stripe

from dotenv import load_dotenv

from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import BaseModel

from sqlalchemy.orm import Session
from fastapi import Depends

from app.db.database import get_db
from app.models.product import Product

load_dotenv()

stripe.api_key = os.getenv(
    "STRIPE_SECRET_KEY"
)

router = APIRouter()


class CartItem(BaseModel):
    productId: int
    quantity: int


class CheckoutRequest(BaseModel):
    items: list[CartItem]


@router.post(
    "/api/create-checkout-session"
)
def create_checkout_session(
    checkout: CheckoutRequest,
    db: Session = Depends(get_db)
):
    try:
        line_items = []

        for item in checkout.items:

            product = (
                db.query(Product)
                .filter(
                    Product.id ==
                    item.productId
                )
                .first()
            )

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=
                    f"Product {item.productId} not found"
                )

            line_items.append({
                "price_data": {
                    "currency": "pln",

                    "product_data": {
                        "name":
                        product.name
                    },

                    "unit_amount":
                    int(
                        product.price * 100
                    )
                },

                "quantity":
                item.quantity
            })

        session = (
            stripe.checkout.Session.create(
                payment_method_types=[
                    "card"
                ],

                line_items=line_items,

                mode="payment",

                success_url=
                "http://localhost:5173/status",

                cancel_url=
                "http://localhost:5173/failed"
            )
        )

        return {
            "checkoutUrl":
            session.url
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )