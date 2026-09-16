import os

def test_decode():
    s = "â€“"
    try:
        fixed = s.encode('cp1252').decode('utf-8')
        print(f"cp1252 -> utf-8: {repr(fixed)}")
    except Exception as e:
        print("cp1252 error:", e)

test_decode()
