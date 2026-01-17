# 📦 Inventory Management System

A full-stack **Inventory Management System** built using **FastAPI (Backend)** and **React + Vite + Tailwind CSS (Frontend)**.
This project provides a complete solution for managing products, inventory, orders, suppliers, customers, and reports with secure JWT authentication.

---

## 🚀 Features

### 🔐 Authentication

* JWT based authentication
* Role-based access (Admin / Staff)
* Protected frontend routes

### 📊 Dashboard

* Total products
* Total stock value
* Low stock alerts
* Orders & revenue overview

### 📦 Products

* Add / Edit / Delete products
* Supplier & category mapping
* Stock quantity tracking

### 🏬 Inventory

* Stock IN / OUT movements
* Low stock monitoring

### 🧾 Orders

* Create orders
* Automatic stock deduction
* Order status tracking

### 🧑‍💼 Suppliers & Customers

* Supplier management
* Customer management

### 📈 Reports

* Aggregated dashboard statistics
* API ready for future PDF / CSV exports

---

## 🛠 Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite (can be replaced with PostgreSQL)
* JWT Authentication

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Recharts
* Lucide Icons

---

## 📂 Project Structure

```
Inventory-Management/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── main.py
│   ├── seed_data.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ How to Run the Project (Step-by-Step)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/hprajapati1606-ux/Inventory-Management-.git
cd Inventory-Management-
```

---

### 2️⃣ Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\Activate
pip install -r requirements.txt
pip install email-validator
```

#### Seed Database (Demo Data)

```bash
python seed_data.py
```

#### Run Backend

```bash
uvicorn app.main:app --reload --port 8000
```

Backend URLs:

* [http://127.0.0.1:8000](http://127.0.0.1:8000)
* [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 3️⃣ Frontend Setup (React)

```bash
cd ../frontend
npm install
npm run dev
```

Frontend URL:

* [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Login Credentials

### Admin

* Email: **[admin@example.com](mailto:admin@example.com)**
* Password: **admin123**

### Staff

* Email: **[staff@example.com](mailto:staff@example.com)**
* Password: **staff123**

---

## 🧪 Verified Functionality

✔ Login works
✔ JWT token stored and sent
✔ Dashboard loads
✔ Reports load
✔ Products / Suppliers / Customers connected
✔ Role-based access enforced

---

## 🌱 Future Enhancements

* PDF / CSV report export
* Docker deployment
* PostgreSQL production database
* Advanced role permissions
* Automated testing

---

## 👨‍💻 Author

**Hitesh Prajapati**
GitHub: [https://github.com/hprajapati1606-ux](https://github.com/hprajapati1606-ux)

⭐ If you like this project, please give it a star!
