from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import deps, models, schemas

router = APIRouter()

@router.get("/movements", response_model=List[schemas.StockMovementResponse])
def read_stock_movements(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    movements = db.query(models.StockMovement).order_by(models.StockMovement.created_at.desc()).offset(skip).limit(limit).all()
    # Populate product name manually if needed or rely on ORM lazy load in schema response if configured?
    # Schema has product_name field, let's make sure we can fill it.
    for m in movements:
        m.product_name = m.product.name if m.product else "Unknown"
    return movements

@router.post("/adjust", response_model=schemas.StockMovementResponse)
def create_stock_movement(
    movement: schemas.StockMovementCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    product = db.query(models.Product).filter(models.Product.id == movement.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update product stock
    if movement.change_type == models.StockMovementType.IN:
        product.stock_quantity += movement.quantity
    elif movement.change_type == models.StockMovementType.OUT:
        if product.stock_quantity < movement.quantity:
             raise HTTPException(status_code=400, detail="Insufficient stock")
        product.stock_quantity -= movement.quantity
    elif movement.change_type == models.StockMovementType.ADJUSTMENT:
        # Adjustment could be setting to absolute value or relative.
        # Let's assume adjustment is relative addition (negative for subtraction).
        # Actually usually adjustment sets the stock to a new value or adds/subtracts.
        # Interpretation: "adjustment" here acts like a generic add/sub but we recorded it as 'adjustment'.
        # Let's assume the user sends the 'quantity' to ADD (negative to subtract).
        # OR simple interpretation: same as IN/OUT but just different label?
        # Let's treat it as: quantity is the DELTA.
        new_qty = product.stock_quantity + movement.quantity
        if new_qty < 0:
             raise HTTPException(status_code=400, detail="Resulting stock cannot be negative")
        product.stock_quantity = new_qty

    db_movement = models.StockMovement(**movement.model_dump())
    db.add(db_movement)
    db.add(product)
    db.commit()
    db.refresh(db_movement)
    db_movement.product_name = product.name
    return db_movement
