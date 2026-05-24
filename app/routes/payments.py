import os
import stripe

from dotenv import load_dotenv

from fastapi import (
    APIRouter,
    HTTPException
)

load_dotenv()

stripe.api_key = os.getenv(
    "STRIPE_SECRET_KEY"
)

router = APIRouter()


@router.post(
    "/api/create-checkout-session"
)
def create_checkout_session():
    try:
        session = (
            stripe.checkout.Session.create(
                payment_method_types=[
                    "card"
                ],

                line_items=[
                    {
                        "price_data": {
                            "currency":
                            "pln",

                            "product_data": {
                                "name":
                                "MJL Foods Order"
                            },

                            "unit_amount":
                            5000
                        },

                        "quantity": 1
                    }
                ],

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