from pydantic import ( BaseModel, ConfigDict, Field)

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

    image_url: str = Field(
        serialization_alias="imageUrl"
    )

    available: bool

    is_popular: bool = Field(
        serialization_alias="isPopular"
    )

    category: str

    model_config = ConfigDict(
        from_attributes=True
    )