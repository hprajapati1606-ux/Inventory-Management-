import urllib.request
import urllib.parse
import json

url = "http://127.0.0.1:8000/api/v1/auth/login"
data = urllib.parse.urlencode({'username': 'admin', 'password': 'admin123'}).encode()

req = urllib.request.Request(url, data=data, method='POST')
# No explicit Content-Type, urllib usually sets application/x-www-form-urlencoded by default for data=...

try:
    print(f"Testing URL: {url}")
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        body = response.read().decode()
        print(f"Body: {body}")
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
