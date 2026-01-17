from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import deps, models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.OrderResponse])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@router.post("/", response_model=schemas.OrderResponse)
def create_order(
    order_in: schemas.OrderCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # 1. Validate customer
    customer = db.query(models.Customer).filter(models.Customer.id == order_in.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # 2. Check stock and calculate total
    total_amount = 0.0
    order_items_data = []

    for item in order_in.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.stock_quantity < item.quantity:
             raise HTTPException(status_code=400, detail=f"Insufficient stock for product: {product.name}")
        
        total_amount += product.price * item.quantity
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "price": product.price
        })

    # 3. Create Order
    db_order = models.Order(
        customer_id=order_in.customer_id,
        user_id=current_user.id,
        total_amount=total_amount,
        status=models.OrderStatus.COMPLETED # Auto-complete for simplicity or based on input? Let's assume completed for stock deduction.
    )
    db.add(db_order)
    db.flush() # get ID

    # 4. Create Items and Deduct Stock
    for data in order_items_data:
        product = data["product"]
        qty = data["quantity"]
        price = data["price"]

        # Create Item
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=qty,
            price_at_time=price
        )
        db.add(db_item)

        # Update Stock
        product.stock_quantity -= qty
        db.add(product)

        # Record Movement
        db_movement = models.StockMovement(
            product_id=product.id,
            change_type=models.StockMovementType.OUT,
            quantity=qty,
            notes=f"Order #{db_order.id}"
        )
        db.add(db_movement)

    db.commit()
    db.refresh(db_order)
    return db_order
