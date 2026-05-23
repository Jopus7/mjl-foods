from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    order_number = Column(
        String,
        unique=True
    )
    full_name = Column(
        String,
        nullable=False
)

    phone = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=False
    )

    address = Column(
        String,
        nullable=False
    )


    city = Column(
        String,
        nullable=False
    )

    comment = Column(
        String,
        nullable=True
    )

    promo_code = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default="pending"
    )

    estimated_delivery_time = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.now
    )