from pydantic import BaseModel, ConfigDict, Field


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

    image_url: str = Field(alias="imageUrl")

    available: bool

    is_popular: bool = Field(alias="isPopular")

    category: str

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )