import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_flow():
    # 1. Login
    print("1. Attempting Login...")
    login_url = f"{BASE_URL}/auth/login"
    # Use FormData format (data=...)
    login_data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(login_url, data=login_data)
        if response.status_code != 200:
            print(f"LOGIN FAILED: {response.status_code}")
            print(response.text)
            sys.exit(1)
            
        data = response.json()
        token = data.get("access_token")
        if not token:
            print("LOGIN SUCCESS but no token found!")
            print(data)
            sys.exit(1)
            
        print(f"LOGIN SUCCESS. Token received (len={len(token)})")
        
        # 2. Access Dashboard
        print("\n2. Accessing Protected Dashboard...")
        dashboard_url = f"{BASE_URL}/reports/dashboard"
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        dash_response = requests.get(dashboard_url, headers=headers)
        
        if dash_response.status_code == 200:
            print("DASHBOARD SUCCESS!")
            print(dash_response.json())
        else:
            print(f"DASHBOARD FAILED: {dash_response.status_code}")
            print(dash_response.text)
            
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_flow()
