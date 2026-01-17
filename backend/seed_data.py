from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import (
    User, UserRole, Supplier, Customer, Product, StockMovement, 
    StockMovementType, Order, OrderItem, OrderStatus
)
from app.core.security import get_password_hash
import logging
import random
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- DEMO DATA CONSTANTS ---

SUPPLIERS_DATA = [
    {"name": "TechGiant Wholesale", "email": "sales@techgiant.com", "phone": "555-0101", "address": "123 Silicon Blvd, Tech City"},
    {"name": "OfficeDepot Pro", "email": "b2b@officedepotpro.com", "phone": "555-0102", "address": "456 Paper St, Business Park"},
    {"name": "Global Components Ltd", "email": "supply@globalcomp.com", "phone": "555-0103", "address": "789 Circuit Rd, Industrial Zone"},
    {"name": "Furniture World", "email": "orders@furnitureworld.com", "phone": "555-0104", "address": "321 Comfort Ln, Warehouse Dist"},
    {"name": "Network Solutions Inc", "email": "partners@netsol.com", "phone": "555-0105", "address": "654 Router Way, Connectivity Hub"},
    {"name": "Retail Fast Distributors", "email": "sales@retailfast.com", "phone": "555-0106", "address": "987 Market St, Commerce City"},
]

CUSTOMERS_DATA = [
    {"name": "Acme Corp", "email": "purchasing@acme.com", "phone": "555-1111", "address": "100 Acme Way"},
    {"name": "Stark Industries", "email": "tony@stark.com", "phone": "555-2222", "address": "Avengers Tower, NY"},
    {"name": "Wayne Enterprises", "email": "bruce@wayne.com", "phone": "555-3333", "address": "Gotham City"},
    {"name": "Cyberdyne Systems", "email": "contact@cyberdyne.com", "phone": "555-4444", "address": "Future Blvd, CA"},
    {"name": "Massive Dynamic", "email": "info@massivedynamic.com", "phone": "555-5555", "address": "Science Park, Boston"},
    {"name": "Initech", "email": "peter@initech.com", "phone": "555-6666", "address": "Software Park, TX"},
    {"name": "Hooli", "email": "gavin@hooli.com", "phone": "555-7777", "address": "Silicon Valley, CA"},
    {"name": "Umbrella Corp", "email": "hive@umbrella.com", "phone": "555-8888", "address": "Raccoon City"},
    {"name": "Aperture Science", "email": "cake@aperture.com", "phone": "555-9999", "address": "Upper Michigan"},
    {"name": "Black Mesa", "email": "gordon@blackmesa.com", "phone": "555-0000", "address": "New Mexico"},
]

PRODUCT_TEMPLATES = [
    {"cat": "Electronics", "name": "Dell XPS 15 Laptop", "price": 1800.00},
    {"cat": "Electronics", "name": "MacBook Pro M3", "price": 2400.00},
    {"cat": "Electronics", "name": "Samsung 32' 4K Monitor", "price": 450.00},
    {"cat": "Electronics", "name": "Logitech MX Master 3", "price": 99.00},
    {"cat": "Electronics", "name": "Keychron K2 Keyboard", "price": 85.00},
    {"cat": "Electronics", "name": "Sony WH-1000XM5 Headphones", "price": 350.00},
    {"cat": "Accessories", "name": "USB-C Hub Multiport", "price": 45.00},
    {"cat": "Accessories", "name": "HDMI Cable 2m", "price": 12.00},
    {"cat": "Accessories", "name": "Laptop Stand Aluminum", "price": 35.00},
    {"cat": "Networking", "name": "Ubiquiti UniFi AP", "price": 149.00},
    {"cat": "Networking", "name": "Cisco 24-Port Switch", "price": 299.00},
    {"cat": "Furniture", "name": "Ergonomic Office Chair", "price": 250.00},
    {"cat": "Furniture", "name": "Standing Desk Motorized", "price": 450.00},
    {"cat": "Furniture", "name": "Filing Cabinet", "price": 120.00},
    {"cat": "Office Supplies", "name": "Printer Paper (Box)", "price": 45.00},
    {"cat": "Office Supplies", "name": "Toner Cartridge HP", "price": 85.00},
    {"cat": "Office Supplies", "name": "Whiteboard 4x6", "price": 120.00},
]

STAFF_NAMES = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Prince", "Evan Wright"]

def init_db(db: Session):
    logger.info("Checking seed status...")
    if db.query(User).count() > 20: 
        logger.info("Database appears populated. Skipping.")
        return

    # 1. USERS
    logger.info("Seeding Users...")
    # Admin
    if not db.query(User).filter(User.email == "admin@example.com").first():
        db.add(User(email="admin@example.com", hashed_password=get_password_hash("admin123"), full_name="Admin User", role=UserRole.ADMIN))
    
    # Staff
    for name in STAFF_NAMES:
        email = f"{name.split()[0].lower()}@example.com"
        if not db.query(User).filter(User.email == email).first():
            db.add(User(email=email, hashed_password=get_password_hash("staff123"), full_name=name, role=UserRole.STAFF))
    db.commit()

    # 2. SUPPLIERS
    logger.info("Seeding Suppliers...")
    suppliers_map = [] # Keep references
    for s_data in SUPPLIERS_DATA:
        s = db.query(Supplier).filter(Supplier.email == s_data["email"]).first()
        if not s:
            s = Supplier(**s_data)
            db.add(s)
            db.commit() # Commit to get ID
            db.refresh(s)
        suppliers_map.append(s)

    # 3. PRODUCTS
    logger.info("Seeding Products...")
    products_map = []
    
    # Generate variations to reach ~50 products
    for i in range(3): # repeat templates with variations
        for tmpl in PRODUCT_TEMPLATES:
            sku = f"{tmpl['cat'][:3].upper()}-{random.randint(1000, 9999)}"
            name = f"{tmpl['name']} {['Pro', 'Lite', 'V2', 'Black', 'White'][random.randint(0,4)]}" if i > 0 else tmpl['name']
            
            # Randomize price slightly
            price = round(tmpl['price'] * random.uniform(0.9, 1.1), 2)
            qty = random.randint(0, 100)
            
            # Check exist
            if not db.query(Product).filter(Product.sku == sku).first():
                p = Product(
                    sku=sku,
                    name=name,
                    category=tmpl['cat'],
                    price=price,
                    stock_quantity=qty,
                    min_stock_threshold=random.randint(5, 20),
                    supplier_id=random.choice(suppliers_map).id
                )
                db.add(p)
                products_map.append(p)
    db.commit()
    # Reload products
    products = db.query(Product).all()

    # 4. CUSTOMERS
    logger.info("Seeding Customers...")
    customers_map = []
    for c_data in CUSTOMERS_DATA:
        c = db.query(Customer).filter(Customer.email == c_data["email"]).first()
        if not c:
            c = Customer(**c_data)
            db.add(c)
            db.commit()
            db.refresh(c)
        customers_map.append(c)
    
    # Generate more fake customers
    for i in range(15):
        name = f"Customer {i+100}"
        email = f"cust{i+100}@demo.com"
        if not db.query(Customer).filter(Customer.email == email).first():
            c = Customer(name=name, email=email, address=f"Street {i}, City")
            db.add(c)
            customers_map.append(c)
    db.commit()
    customers = db.query(Customer).all()

    # 5. ORDERS & MOVEMENTS
    logger.info("Seeding Orders & Movements...")
    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    
    # Create past orders (last 60 days)
    for _ in range(40):
        cust = random.choice(customers)
        status = random.choice([OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.PENDING])
        date_offset = random.randint(0, 60)
        created_at = datetime.utcnow() - timedelta(days=date_offset)
        
        o = Order(
            customer_id=cust.id,
            user_id=admin_user.id,
            status=status,
            total_amount=0, # Calc later
            created_at=created_at
        )
        db.add(o)
        db.commit()
        db.refresh(o)
        
        # Add items
        total = 0
        num_items = random.randint(1, 4)
        selected_prods = random.sample(products, num_items)
        
        for p in selected_prods:
            qty = random.randint(1, 5)
            # Ensure price matches product
            price = p.price
            
            oi = OrderItem(order_id=o.id, product_id=p.id, quantity=qty, price_at_time=price)
            db.add(oi)
            total += price * qty
            
            # Stock movement if completed
            if status == OrderStatus.COMPLETED:
                mv = StockMovement(
                    product_id=p.id,
                    change_type=StockMovementType.OUT,
                    quantity=qty,
                    notes=f"Order #{o.id}",
                    created_at=created_at 
                )
                db.add(mv)
                # Note: We are assuming sync, in real app updating product stock is separate logic.
                # Here we just log. The Product.stock_quantity should ideally be updated too if logic requires.
                # For demo data, we set random stock initially, so we don't strictly need to deduct 
                # unless we want perfect consistency. Let's just create log record.

        o.total_amount = total
        db.add(o)
        
    db.commit()
    logger.info("Seeding Complete!")

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
