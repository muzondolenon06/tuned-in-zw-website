import urllib.request
import json
import traceback

API_BASE = 'http://localhost:8002'

endpoints_to_test = [
    ('/admin/posts', list),
    ('/opportunities', list),
    ('/news/today', list),
    ('/news/NewsDay', list),
    ('/radio/All', list),
    ('/radio/ZiFM', list)
]

def test_endpoints():
    print("Starting Adversarial API Tests for Website...")
    for endpoint, expected_type in endpoints_to_test:
        url = f"{API_BASE}{endpoint}"
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read())
                if isinstance(data, expected_type):
                    print(f"[PASS] {endpoint} returned {type(data).__name__} with {len(data) if isinstance(data, list) else 1} items.")
                    # Check for mandatory keys that app.js relies on
                    if len(data) > 0:
                        first_item = data[0]
                        # check if url exists
                        if 'url' not in first_item:
                            print(f"  [WARN] 'url' missing in {endpoint}")
                        if 'title' not in first_item:
                            print(f"  [WARN] 'title' missing in {endpoint}")
                else:
                    print(f"[FAIL] {endpoint} returned {type(data).__name__}, expected {expected_type.__name__}")
        except Exception as e:
            print(f"[ERROR] {endpoint} failed: {e}")

if __name__ == '__main__':
    test_endpoints()
