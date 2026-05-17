from sqlalchemy import Column, Integer, String, Float, Boolean
from app.db.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    price = Column(Float, nullable=False)

    image_url = Column(String, nullable=False)

    available = Column(Boolean, default=True)

    is_popular = Column(Boolean, default=False)

    category = Column(String, nullable=False)