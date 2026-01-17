# Inventory Management System

A production-ready Inventory Management System built with FastAPI and React.

## Features
- **Dashboard**: Real-time overview of stock value, products, and orders.
- **Products**: CRUD operations with stock tracking.
- **Inventory**: Track stock movements (In/Out/Adjustments).
- **Orders**: Create orders for customers that automatically deduct stock.
- **Suppliers & Customers**: Manage registry.
- **Authentication**: JWT-based Role-Based Access Control (Admin/Staff).

## Tech Stack
- **Backend**: Python FastAPI, SQLAlchemy, SQLite (production-ready for Postgres).
- **Frontend**: React (Vite), Tailwind CSS, Axios, Recharts, Lucide Icons.

## Setup Instructions

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate
   pip install -r requirements.txt
   ```
3. Initialize Database and Seed Data:
   ```bash
   python seed_data.py
   ```
   *Note: This creates `inventory.db` and default users.*

4. Run Server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Development Server:
   ```bash
   npm run dev
   ```
4. Open browser at `http://localhost:5173`.

## Demo Credentials
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`

## Project Structure
- `backend/app`: FastAPI application core.
  - `models.py`: Database tables.
  - `routers/`: API endpoints.
- `frontend/src`: React application.
  - `components/`: Reusable UI.
  - `pages/`: Application views.
  - `context/`: Auth state management.
