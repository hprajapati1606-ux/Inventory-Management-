from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import deps, models, schemas

router = APIRouter()

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    total_products = db.query(models.Product).count()
    
    # Calculate stock value
    products = db.query(models.Product).all()
    total_stock_value = sum(p.price * p.stock_quantity for p in products)
    
    low_stock_items = db.query(models.Product).filter(models.Product.stock_quantity < models.Product.min_stock_threshold).count()
    
    total_orders = db.query(models.Order).count()
    pending_orders = db.query(models.Order).filter(models.Order.status == models.OrderStatus.PENDING).count()
    
    # Revenue (only completed)
    revenue_query = db.query(func.sum(models.Order.total_amount)).filter(models.Order.status == models.OrderStatus.COMPLETED).scalar()
    total_revenue = revenue_query if revenue_query else 0.0

    return {
        "total_products": total_products,
        "total_stock_value": total_stock_value,
        "low_stock_items": low_stock_items,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_revenue": total_revenue
    }
