from pydantic import BaseModel, EmailStr
from typing import Optional


class CustomerSchema(BaseModel):
    firstName: str
    lastName: str
    phone: str
    email: EmailStr
    address: str
    postalCode: str
    city: str


class OrderItemSchema(BaseModel):
    productId: int
    quantity: int


class OrderCreate(BaseModel):
    customer: CustomerSchema
    promoCode: Optional[str] = None
    comment: Optional[str] = None
    items: list[OrderItemSchema]


class OrderResponse(BaseModel):
    success: bool
    orderId: str
    estimatedDeliveryTime: str
    status: str