from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    available: bool = True
    is_popular: bool = False
    category: str


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image_url: str
    available: bool
    is_popular: bool
    category: str

    class Config:
        from_attributes = True