import os

def test_decode():
    s = "â€“"
    try:
        # If it was UTF-8 interpreted as cp1252
        fixed = s.encode('cp1252').decode('utf-8')
        print(f"cp1252 -> utf-8: {fixed}")
    except Exception as e:
        print("cp1252 error:", e)

test_decode()
