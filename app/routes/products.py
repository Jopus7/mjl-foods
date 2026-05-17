from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse

router = APIRouter()

@router.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/api/menu")
def get_menu(db: Session = Depends(get_db)):
    return {
        "zupy": db.query(Product)
        .filter(Product.category == "zupy")
        .all(),

        "daniaGlowne": db.query(Product)
        .filter(Product.category == "daniaGlowne")
        .all(),

        "desery": db.query(Product)
        .filter(Product.category == "desery")
        .all(),

        "napoje": db.query(Product)
        .filter(Product.category == "napoje")
        .all(),
    }

@router.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(
    name=product.name,
    description=product.description,
    price=product.price,
    image_url=product.image_url,
    available=product.available,
    is_popular=product.is_popular,
    category=product.category
    )


    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    db_product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.image_url = product.image_url
    db_product.available = product.available
    db_product.is_popular = product.is_popular
    db_product.category = product.category

    db.commit()
    db.refresh(db_product)

    return db_product

@router.delete(
    "/products/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()

    return {"message": "Deleted"}