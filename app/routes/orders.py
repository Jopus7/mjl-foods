import os
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter()

@router.get("/api/orders")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.get("/api/orders/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .filter(Order.order_number == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    minutes_passed = (datetime.now() - order.created_at).total_seconds() / 60

    if minutes_passed < 1:
        status = "accepted"
    elif minutes_passed < 2:
        status = "preparing"
    elif minutes_passed < 3:
        status = "on_the_way"
    else:
        status = "delivered"

    return {
        "orderId": order.order_number,
        "status": status,
        "estimatedDeliveryTime": str(order.estimated_delivery_time)
    }

@router.post("/api/orders/create", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    if not order.items:
        raise HTTPException(status_code=400, detail="Order must contain items")

    order_number = f"ORD-{uuid.uuid4().hex[:6].upper()}"
    estimated_delivery = datetime.now() + timedelta(minutes=45)

    new_order = Order(
        order_number=order_number,
        full_name=order.customer.firstName,
        phone=order.customer.phone,
        email=order.customer.email,
        address=order.customer.address,
        city=order.customer.city,
        comment=order.comment,
        promo_code=order.promoCode,
        status="accepted",
        estimated_delivery_time=estimated_delivery
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order.items:
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
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price_at_purchase=product.price
        )
        db.add(order_item)

    db.commit()
    return {
        "success": True,
        "orderId": order_number,
        "estimatedDeliveryTime": estimated_delivery.isoformat(),
        "status": "accepted"
    }

@router.put("/api/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return order