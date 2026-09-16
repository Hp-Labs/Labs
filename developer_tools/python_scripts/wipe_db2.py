import sqlite3
import os

db_path = os.path.join(os.getcwd(), "data", "hplabs.db")
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("DELETE FROM lab_sessions")
conn.commit()
conn.close()
print("Wiped lab_sessions table from data/hplabs.db.")
