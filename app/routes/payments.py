import os
import stripe

from dotenv import load_dotenv

from fastapi import (
    APIRouter,
    HTTPException,
    Request
)

from pydantic import BaseModel

from sqlalchemy.orm import Session
from fastapi import Depends

from app.db.database import get_db
from app.models.product import Product
from app.models.order import Order
from app.services.email_service import send_order_email

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()


class CartItem(BaseModel):
    productId: int
    quantity: int


class CheckoutRequest(BaseModel):
    email: str
    orderId: str
    estimatedDeliveryTime: str
    items: list[CartItem]


class EmailTriggerRequest(BaseModel):
    orderId: str


@router.post("/api/create-checkout-session")
def create_checkout_session(
    checkout: CheckoutRequest,
    db: Session = Depends(get_db)
):
    try:
        line_items = []

        for item in checkout.items:
            product = (
                db.query(Product)
                .filter(Product.id == item.productId)
                .first()
            )

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.productId} not found"
                )

            line_items.append({
                "price_data": {
                    "currency": "pln",
                    "product_data": {
                        "name": product.name
                    },
                    "unit_amount": int(product.price * 100)
                },
                "quantity": item.quantity
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            customer_email=checkout.email,
            line_items=line_items,
            mode="payment",
            success_url=f"http://localhost:5173/status/{checkout.orderId}",
            cancel_url="http://localhost:5173/failed",
            metadata={
                "order_id": checkout.orderId,
                "delivery_time": checkout.estimatedDeliveryTime
            }
        )

        return {
            "checkoutUrl": session.url
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/api/orders/send-success-email")
def trigger_success_email(
    payload: EmailTriggerRequest,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.order_number == payload.orderId)
        .with_for_update()
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status == "paid":
        return {"status": "email_already_sent"}

    order.status = "paid"
    db.commit()

    send_order_email(
        email=order.email,
        order_number=order.order_number,
        delivery_time=str(order.estimated_delivery_time),
        order_id=order.order_number
    )

    return {"status": "email_sent"}